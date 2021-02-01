indexDictionary = [];

function displayDocFunction(data) {

	doc = $(document.createElement('div'))
	var nameFunctionDiv = $(document.createElement('h4')).addClass('title is-3');
	doc.append(nameFunctionDiv);
	//add bar
	var des = $(document.createElement('p')).html(data.reference.description)
	doc.append(des);
	doc.append($(document.createElement('h3')).html('Arguments:'));

	nameFunctionDiv.append($(document.createElement('span')).addClass('libName').html('oeel'))
	nameFunctionDiv.append(data.fullPath + '(');
	var args = $(document.createElement('ul'));
	for (var i = 0; i < data.inputs.length; i++) {
		var input = data.inputs[i];
		if (input.name == 'Return') continue;
		var title = $(document.createElement('span')).html(input.name + ':');
		var b = $(document.createElement('li')).append(title)
		b.append($(document.createElement('p')).html(input.description))
		args.append(b);

		var imputTitle = $(document.createElement('span')).html(input.name);
		if (i > 0)
			nameFunctionDiv.append(', ');
		nameFunctionDiv.append(imputTitle);
		if (input.optional) {
			imputTitle.addClass('optional');
		}
		if ((input.defaultValue === undefined) && !input.optional) {
			imputTitle.addClass('mandatory')
		}
	}
	doc.append(args);

	nameFunctionDiv.append(')')


	$('#description').empty()
	$('#description').append(doc);
}



function displayData(data, level) {
	var keys = Object.keys(data);
	if (keys.includes('fullPath')) {
		return function () {
			displayDocFunction(data);
		}
	}
	var a = $(document.createElement('ul')).addClass('nested'); //menu-list 
	//tag is-white
	for (var i = 0; i < keys.length; i++) {

		a.addClass('level-' + level);
		var title = $(document.createElement('span')).html(keys[i]);

		var b = $(document.createElement('li')).append(title)
		var val = displayData(data[keys[i]], level + 1);
		if (typeof (val) == 'function') {
			b.click(val);
			b.addClass('tag is-white is-medium')
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

	}
	return a;
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
	} else {
		// We reached our target server, but it returned an error

	}
};

request.send();