indexDictionary = [];

initialLocation=window.location.href.match('#.*');
if(initialLocation)
	initialLocation=initialLocation[0].substring(1);

function displayDocFunction(data) {

	var doc = $('#description');
	doc.empty();

	var title = $(document.createElement('h3')).addClass('title is-3');
	title.html(data.reference.name+'(...)')
	if(data.reference.license)
		title.append($(document.createElement('img')).addClass('licenseBadge').attr('src','https://img.shields.io/badge/license-'+data.reference.license+'-blue'))
	doc.append(title);

	var codeBlock=$(document.createElement('div')).addClass('codeBlockWithCB')
	doc.append(codeBlock);
	var bt=$(document.createElement('div')).addClass('clipboard').html('&#xf0c5;');
	

	var code=$(document.createElement('code')).addClass("language-javascript")
	codeBlock.append($(document.createElement('pre')).addClass("language-javascript").append(code));
	code.append($(document.createElement('span')).addClass('libName').html('oeel'))
	code.append(data.fullPath + '(');
	codeBlock.append(bt)

	var text2copy='oeel'+data.fullPath + '({\n';
	//add bar
	var des = $(document.createElement('article')).addClass('message is-primary').
		append($(document.createElement('div')).addClass('message-body').html(data.reference.description))
	doc.append(des);
	doc.append($(document.createElement('h4')).addClass('is-4').html('Arguments:'));


	var args = $(document.createElement('ul'));
	for (var i = 0; i < data.inputs.length; i++) {
		var input = data.inputs[i];
		if (input.name == 'Return') continue;
		var b = $(document.createElement('li')).append($(document.createElement('code')).html(input.name)).append(input.description)
		args.append(b);

		var imputTitle = $(document.createElement('span')).html(input.name);
		if (i > 0)
			code.append(', ');
		code.append(imputTitle);
		if (input.optional) {
			imputTitle.addClass('optional');
			text2copy+='// '+input.name+':,\n';
		}
		if (input.defaultValue && !input.optional) {
			text2copy+='// '+input.name+':'+input.defaultValue+',\n';
		}
		if ((input.defaultValue === undefined) && !input.optional) {
			imputTitle.addClass('mandatory')
			text2copy+=input.name+':,\n';
		}
	}
	doc.append(args);
	code.append(')')
	text2copy+='});'

	bt.click(function(){navigator.clipboard.writeText(text2copy)});
	Prism.highlightElement(code.get(0));

	window.history.pushState("object or string", "Title", "#"+data.fullPath);
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

		if(initialLocation==data[keys[i]].fullPath){
			selectedAtLoading=title;
		}

	}
	return a;
}

function selectMenu(){
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