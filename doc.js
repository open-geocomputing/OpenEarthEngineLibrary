indexDictionary = [];
listFunctions={};

function displayDocFunction(data) {
	$('.documentation-menu').show();
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
	if(returns.length)
	{
		doc.append($("<h4>", {"class": "title is-4"}).html('Return:'));
		var returnslist=$("<ul>", {"id": "returns"});
		doc.append(returnslist);
		returnslist.html(returns.map( i => '<li><code>Return</code><span class="tag">'+ i.type +'</span></li>').join(''))
	}

 	// and DOI
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

	// format copy to be used in GEE
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
	text2copy += '\n});'

	// manage history in the browser
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
	$('.documentation-menu').show();
	var doc = $('#description');
	doc.empty();
	doc.append($("<h2>", {id: "startPage ", "class": "title is-3"}).html('How to use the library?'));
	doc.append($('<p>').html("To use the library simply do the following import in your code, then use the functions."))
	
	doc.append($('<p>').html("It’s as simple!"))

	doc.append($("<h2>", {id: "startPage ", "class": "title is-3"}).html('You need to know which function you used?'));
	doc.append($('<p>').html("Simply add at the end of your code, and you will get the list of all function used and other related information."))

	

	doc.append($("<h2>", {id: "startPage ", "class": "title is-3"}).html('License?'));
	doc.append($('<p>').html("Each function has its own license so please refer to it directly.<br>The license of the library is GPLv3, but this is only including the library architecture (synchronization with GEE, documentation code…) it’s unrelated to the license of each function."))

	Prism.highlightAll();
}

function displayContributePage(){
	$('.documentation-menu').hide();
	var doc = $('#description');
	doc.empty();

	doc.append($("<h2>", {"class": "title is-2"}).html("You want to contribute to the OEEL?<br> You are at the right place!"));


	doc.append($("<h3>", {"class": "title is-3"}).html("Documentation"));
	doc.append($('<p>').html("You see a typo, an incomplete or unclear documentation:\
	The issue is with a function?\
	Simply open the related file on GitHub and propose an edit.\
	<br>On this website, you can edit this web page on the “gh-pages” branch on GitHub."));
	doc.append($("<h3>", {"class": "title is-3"}).html("Missing examples"));
	doc.append($('<p>').html("You can simply add example on the dedicated GitHub repository"));
	doc.append($("<h3>", {"class": "title is-3"}).html("Bugs?"));
	doc.append($('<p>').html("You know how to fix it? Submit an edit with a justification of the issue (and possible an example). You don’t know? It’s not a problem simply open an issue on GitHub. The community can probably help you."));
	doc.append($("<h3>", {"class": "title is-3"}).html("A new function?"));
	doc.append($('<p>').html("You have a new function to add? Already thanks for considering it.\
		Start with a look on the <a href='https://code.earthengine.google.com/?scriptPath=users%2Fgravey_mathieu%2FtestlibGithub_v2%3ADarftNewFunction' target='_blanck'>draft script</a>, that provide a baseline to write new functions.\
		Start by filing the inputs section and the description, then implement the function. Finally, use the bottom part to implement the test and debug the function."));
	doc.append($('<p>').html("To submit your contribution simply copy the upper part (from inputs to the end of your function)"));
	doc.append($("<h4>", {"class": "title is-4"}).html("The inputs:"));
	var inp=$('<ul>');
	doc.append($('<p>').html("The order respects the list input order, so start by the mandatory variable, then the variable with default value, finally the optional ones."));
	doc.append(inp);
	doc.append($('<p>').html("<i class='fas fa-exclamation-triangle'></i> <code>name:\"Return\"</code> <br>The \"Return\" is a specific \"input\" that allows informing the documentation about the return type of the function. If the function returns nothing, you can remove it from the list."));
	doc.append($("<h4>", {"class": "title is-4"}).html("Reference:"));
	var ref=$('<ul>');
	doc.append(ref);
	doc.append($('<p>').html("Add any other field that you think can be relevant."));
	doc.append($("<h4>", {"class": "title is-4"}).html("The function:"));
	doc.append($('<p>').html("The parameters are automatically read that the function is informed as list or an object, and automatically generate an object (after checking the type), where each key refers to name in the input list. "));

	inp.append($('<li>').append($('<code>').html('name')).append($('<span>').html(" use to build the dictionary of parameters used in the functions.")))
	inp.append($('<li>').append($('<code>').html('description')).append($('<span>').html(" description use in the documentation.")))
	inp.append($('<li>').append($('<code>').html('type')).append($('<span>').html(" specify the input type (the type is tested when the function is called), if you support many types simply separate them with “|”, possible type: function, object, number, integer, string, ee.Image, ee.ImageCollection, … ee.Collection is a specific type that accepts ImageCollection and FeatureCollection.")))
	inp.append($('<li>').append($('<code>').html('defaultValue')).append($('<span>').html(" the default value that would be automatically affected if the field is not informed. (not mandatory).")))
	inp.append($('<li>').append($('<code>').html('Optional')).append($('<span>').html(" informed if the field is required to run the function.")))


	ref.append($('<li>').append($('<code>').html('name')).append($('<span>').html(" The office name, please use the same for the file name, the camelCase for the naming.")))
	ref.append($('<li>').append($('<code>').html('license')).append($('<span>').html(" Select the open license for this specific function, such as MIT or GPLv3 (any other is ok too ;) )")))
	ref.append($('<li>').append($('<code>').html('description')).append($('<span>').html(" the description used in the documentation can be as long as needed.")))
	ref.append($('<span>').html("<u>Optionals:</u>"))
	ref.append($('<li>').append($('<code>').html('experimental')).append($('<span>').html(" add experimental, is you want to flag the function as so. ")))
	ref.append($('<li>').append($('<code>').html('DOI')).append($('<span>').html(" add the DOI identifier if the paper related to this method. The documentation adds automatically, the link and the citation (in APA style).")))
	ref.append($('<li>').append($('<code>').html('contributors')).append($('<span>').html(" as an array, you can add your name or alias.")))

}

function displayAboutPage(){
	$('.documentation-menu').hide();
	var doc = $('#description');
	doc.empty();
	
	doc.append($("<h3>", {"class": "title is-3"}).html("The Goal"));
	doc.append($('<p>').html("The Open Earth Engine Library (aka. OEEL) is part of the <a href='https://www.open-geocomputing.org/' target='_blanck'>open-geocomputing initiative</a>.\
	 The goal is to provide Google Earth Engine (GEE) users with free and open algorithms. Some of the code requires many hours of design and debugging. It would be a waste not to share them with other users."))

	doc.append($("<h3>", {"class": "title is-3"}).html("Who can contribute?"));
	doc.append($('<p>').html("The library is open to everyone, from the development of the new algorithm to a simply fix of a typo. Even opening an issue on the GitHub when we detect a bug is a significant contribution to the community."))

	doc.append($("<h3>", {"class": "title is-3"}).html("How to contribute:"));
	doc.append($('<p>').html("To contribute please check the <a href='#How-to-contribute'>dedicated page</a>."))

	doc.append($("<h3>", {"class": "title is-3"}).html("The origins"));
	doc.append($('<p>').html("The project finds its origin from a library developed by Mathieu Gravey for his personal usage and store the algorithms developed during his PhD at the University of Lausanne. Starting with a simple git mapping between GitHub and Google Earth Engine. Finally, the project was enhanced with automatic documentation and examples, to allow easy integration of new codes. A particular thanks to Dr. Raphaël Nussbaumer that designed this web site."))

}


function displayContent(){
	var location = window.location.href.match('#\\..*');
	if (location){
		selectMenu(location[0].substring(1));
	}else if(window.location.href.match('#How-to-contribute')){
		displayContributePage();
	}else if(window.location.href.match('#About')){
		displayAboutPage();
	}
	else{
		displayStartingPage();
	}
}

window.onpopstate = function(event) {
	displayContent()
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

// load data 
var request = new XMLHttpRequest;
request.open('GET', 'doc.json', true);

request.onload = function () {
	if (request.status >= 200 && request.status < 400) {
		// Success!
		data = JSON.parse(request.responseText);
		$('footer span#lastUpdate').html(new Date(data.timeSinceEpoch))
		delete data.timeSinceEpoch;
		$('#menuID .documentation-menu').append(displayData(data, 0).removeClass('nested'))
		makeIndex();
		displayContent();
	} else {
		// We reached our target server, but it returned an error

	}
};

request.send();