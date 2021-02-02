indexDictionary = [];

initialLocation = window.location.href.match('#.*');
if (initialLocation)
	initialLocation = initialLocation[0].substring(1);

function displayDocFunction(data) {

	var doc = $('#description');
	doc.empty();

	if (data.reference.license) {
		$('#reference-license').attr("src",'https://img.shields.io/badge/license-' + data.reference.license + '-blue');
		$('#reference-license').show()
	} else {
		$('#reference-license').hide()
	}
	
	$('#reference-name').html(data.reference.name)
	$('#reference-code').html('oeel' + data.fullPath + '(' + data.inputs.map(i => i.name).join(', ') +')')
	$('#reference-description').html('<b>'+data.reference.name+'.</b> '+data.reference.description)
	var inputs = data.inputs.filter( input => input.name != 'Return');
	$('#arguments').html(inputs.map( i => {
		t = '<li><code>' + i.name + (!i.optional ? '*':'')+'</code> ' 
		t += '<span class="tag">'+ i.type +'</span>'
		t += i.defaultValue ? ' Default: '+i.defaultValue+'.': ""
		t += i.description
		t += '</li>'
		return t
	}).join(''))

	var returns = data.inputs.filter( input => input.name == 'Return');
	$('#returns').html(returns.map( i => '<li><code>Return</code><span class="tag">'+ i.type +'</span></li>').join(''))

	text2copy = 'oeel' + data.fullPath + '({\n'
	text2copy += inputs.map( function(i){
		var t=''
		if (i.optional | (i.defaultValue && !i.optional) ){
			t += '// '
		}
		t += i.name + ':'
		if (i.defaultValue){
			t += i.defaultValue
		}
		return t
	}).join(',\n')
	text2copy += '});'

	$('.clipboard').click(function () {
		navigator.clipboard.writeText(text2copy)
	});
	Prism.highlightAll();
	window.history.pushState("object or string", "Title", "#" + data.fullPath);
}


function displayData(data, level) {
	var keys = Object.keys(data);
	if (keys.includes('fullPath')) {
		return function () {
			displayDocFunction(data);
		}
	}
	var a = $(document.createElement('ul')).addClass('nested');
	for (var i = 0; i < keys.length; i++) {

		a.addClass('level-' + level);
		var title = $(document.createElement('span')).html(keys[i]);

		var b = $(document.createElement('li')).append(title)
		var val = displayData(data[keys[i]], level + 1);
		if (typeof (val) == 'function') {
			b.click(val);
			b.addClass('tag-perso')
			a.addClass('navLeaf');
			addSearchIndex(data[keys[i]], a);
		} else {
			title.addClass('caret');
			b.append(val);
		}



		a.append(b);

		title.click(function (e) {
			$(this).parent().children('.nested').toggleClass("active")
			$(this).toggleClass("caret-down");
		})

		if (initialLocation == data[keys[i]].fullPath) {
			selectedAtLoading = title;
		}

	}
	return a;
}

function selectMenu() {
	selectedAtLoading.parentsUntil().filter('li').children('span').click();
}

//search engine
function addSearchIndex(data, dom) {
	indexDictionary.push({
		id: data,
		dom: dom,
		description: data.reference.description,
		name: data.reference.name,
		fullPath: data.fullPath,
		inputsNames: data.inputs.map(x => x.name).join(' '),
		inputsDesc: data.inputs.map(x => x.description).join('; '),
	})
}


function makeIndex() {
	miniSearch = new MiniSearch({
		fields: ['description', 'name', 'fullPath', 'inputsNames', 'inputsDesc'], // fields to index for full-text search
		storeFields: ['dom'] // fields to return with search results
	})

	// Index all documents
	miniSearch.addAll(indexDictionary)
}

$('#search').on('propertychange input', function (e) {
	var valueChanged = false;

	if (e.type == 'propertychange') {
		valueChanged = e.originalEvent.propertyName == 'value';
	} else {
		valueChanged = true;
	}

	if (valueChanged) {
		if ($('#search').val() == '') {
			$('#menuID').removeClass('searchMode');
		} else {
			$('.macthSearch').removeClass('macthSearch');
			var result = miniSearch.search($('#search').val());
			console.log(result)
			for (var i = result.length - 1; i >= 0; i--) {
				$(result[i].dom).parentsUntil().filter('li').addClass('macthSearch');
				$(result[i].dom).children('li').addClass('macthSearch');
			}
			$('#menuID').addClass('searchMode');
		}
	}
});

$(".codeBlockWithCB").mouseenter(function() {
	$(".clipboard").show();
}).mouseleave(function() {
	$(".clipboard").hide();
});

// load data 
var request = new XMLHttpRequest;
request.open('GET', 'doc.json', true);

request.onload = function () {
	if (request.status >= 200 && request.status < 400) {
		// Success!
		data = JSON.parse(request.responseText);
		$('footer span#lastUpdate').html(new Date(data.timeSinceEpoch))
		delete data.timeSinceEpoch;
		$('#menuID').append(displayData(data, 0).removeClass('nested'))
		makeIndex();
		selectMenu();
	} else {
		// We reached our target server, but it returned an error

	}
};

request.send();