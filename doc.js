indexDictionary = [];
listFunctions={};

initialLocation = window.location.href.match('#.*');
if (initialLocation)
	initialLocation = initialLocation[0].substring(1);

function displayDocFunction(data) {

	var doc = $('#description');
	doc.empty();

	if (data.reference.license) {
		doc.append($("<img>", {id: "reference-license", "class": "subtitle", "src":'https://img.shields.io/badge/license-' + data.reference.license + '-blue'}));
	}

	doc.append($("<h3>", {id: "reference-name", "class": "title is-3"}).html('oeel' + data.fullPath+'(...)'));
	var clipboardElement=$("<div>", {"class": "clipboard"}).html('<i class="fas fa-copy"></i>');
	doc.append($("<div>", {"class": "codeBlockWithCB"})
		.append($("<pre>")
		.append($("<code>", {id: "reference-code", "class": "language-javascript"})
			.html('oeel' + data.fullPath + '(' + data.inputs.map(i => i.name).join(', ') +')')))
		.append(clipboardElement));
	doc.append($("<article>", {"class": "message is-primary"})
		.append($("<div>", {id: "reference-description", "class": "message-body"})
			.html('<b>'+data.reference.name+'.</b> '+data.reference.description)));
	if(data.reference.experimental){
			doc.append($("<article>", {"class": "message is-warning"}) // is-danger
		.append($("<div>", {id: "reference-experimental", "class": "message-body"})
			.html('<i class="fas fa-flask"></i>  '+'This is an experimental function!')));
	}

	doc.append($("<h4>", {"class": "title is-4"}).html('Arguments:'));
	var argumentsList=$("<ul>", {"id": "arguments"});
	doc.append(argumentsList);


	doc.append($("<h4>", {"class": "title is-4"}).html('Return:'));
	var returnslist=$("<ul>", {"id": "returns"});
	doc.append(returnslist);


	var inputs = data.inputs.filter( input => input.name != 'Return');
	argumentsList.html(inputs.map( i => {
		t = '<li><code>' + i.name + (!i.optional ? '*':'')+'</code> ' 
		t += '<span class="tag">'+ i.type +'</span>'
		t += i.defaultValue ? ('<span class="defaultvalue">  Default:'+ i.defaultValue+'</span>' )+'.': ""
		t += i.description
		t += '</li>'
		return t
	}).join(''))

	var returns = data.inputs.filter( input => input.name == 'Return');
	returnslist.html(returns.map( i => '<li><code>Return</code><span class="tag">'+ i.type +'</span></li>').join(''))

	if (data.reference.DOI) {
		var doiArticle=$("<article>", {"class": "message is-info"})
		doc.append(doiArticle)
		doiArticle.append($("<div>", {id: "reference-description", "class": "message-header"})
			.html('How to cite').append($("<a>", {id: "reference-DOI", "class": "DOI", "target":"_blank", "href":'https://www.doi.org/'+data.reference.DOI}).html(data.reference.DOI)));
		var citation=$("<div>", {id: "reference-apa", "class": "message-body"});
		doiArticle.append(citation)


		var request = new XMLHttpRequest;
		
		request.open('GET', 'https://dx.doi.org/'+data.reference.DOI, true);
		request.setRequestHeader('Accept', 'text/x-bibliography; style=apa')

		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				// Success!
				data = request.responseText;
				citation.html(data)
			}
		};

		request.send()
			
	}





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

	clipboardElement.click(function () {
		navigator.clipboard.writeText(text2copy)
	});
	Prism.highlightAll();
	var location = window.location.href.match('#.*');
	var currentLocation='';
	if(location)
		currentLocation=location[0].substring(1)
	if (data.fullPath!=currentLocation)
	{
		window.history.pushState("object or string", "Title", "#" + data.fullPath);
	}
	
}

function displayStartingPage(){
	var doc = $('#description');
	doc.empty();
	doc.append($('<p>').html("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\
								tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\
								quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\
								consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\
								cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\
								proident, sunt in culpa qui officia deserunt mollit anim id est laborum."));
}

window.onpopstate = function(event) {
	var location = window.location.href.match('#.*');
	if (location)
		selectMenu(location[0].substring(1));
	else{
		displayStartingPage();
	}
};

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
			if(data[keys[i]].reference.experimental){
				title.append('<i class="fas fa-flask"></i>');
			}
		} else {
			title.addClass('caret');
			b.append(val);
		}



		a.append(b);

		title.click(function (e) {
			$(this).parent().children('.nested').toggleClass("active")
			$(this).toggleClass("caret-down");
		})

		listFunctions[data[keys[i]].fullPath]=title;

	}
	return a;
}

function selectMenu(location) {
	var element=listFunctions[location];
	element.click()
	element.parentsUntil().filter('li').children('span').addClass('caret-down');
	element.parentsUntil().filter('li').children('.nested').addClass("active")
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

// $(".codeBlockWithCB").mouseenter(function() {
// 	$(".clipboard").show();
// }).mouseleave(function() {
// 	$(".clipboard").hide();
// });

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
		selectMenu(initialLocation);
	} else {
		// We reached our target server, but it returned an error

	}
};

request.send();