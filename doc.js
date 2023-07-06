indexDictionary = [];
listFunctions={};
exampleRepoName="users/OEEL/examples"

function displayDocFunction(data) {
	$('.documentation-menu').slideDown();
	var doc = $('#description');
	doc.empty();

	if (data.reference.license) {
		doc.append($("<img>", {id: "reference-license", "class": "subtitle", "src":'https://img.shields.io/badge/license-' + data.reference.license + '-blue'}));
	}
	doc.append($("<a>", {id: "reference-source", "class": "subtitle sourceLink", "target":"_blank", "href":'https://github.com/open-geocomputing/OpenEarthEngineLibrary/blob/master'+data.fullPath.replaceAll(".","/")}).text("</>"));

	doc.append($("<h3>", {id: "reference-name", "class": "title is-3"}).html('oeel' + data.fullPath+'(...)'));
	var clipboardElement=$("<div>", {"class": "clipboard"}).html('<i class="fas fa-copy"></i>');
	doc.append($("<div>", {"class": "codeBlockWithCB"})
		.append($("<pre>")
		.append($("<code>", {id: "reference-code", "class": "language-javascript"})
			.html('oeel' + data.fullPath + '(' + data.inputs.filter( input => input.name != 'Return').map(i => i.name).join(', ') +')')))
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

	// add examples
	var localExample=null
	if(exampleData && (localExample=exampleData["OpenEEL"+data.fullPath])){
		//console.log("OpenEEl"+data.fullPath,localExample)
		doc.append($("<h4>", {"class": "title is-4"}).html('Examples:'));
		var examplesList=$("<ul>", {"id": "examplesList"});
		doc.append(examplesList);
		examplesList.html(localExample.map( i => {
			return $("<li>").append($("<a>", {"class": "linkExample", 
				href:"https://code.earthengine.google.com/?scriptPath="+exampleRepoName+":"+i, target:'_blank'}).html(i));
			}))
	}

	// format copy to be used in GEE
	text2copy = 'oeel' + data.fullPath + '({\n'
	text2copy += inputs.map( function(i){
		var t=''
		if (i.optional || (i.defaultValue!=null && !i.optional) ){
			t += '// '
		}
		t += i.name + ':'
		if (i.defaultValue!=null){
			t += i.defaultValue
		}
		return t
	}).join(',\n')
	text2copy += '\n})'

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
		let state={};
		window.history.pushState(state, "", "#" + data.fullPath);
		let popStateEvent = new PopStateEvent('popstate', { state: state });
		dispatchEvent(popStateEvent);
	}
}

function displayStartingPage(){
	$('.documentation-menu').slideDown();
	var doc = $('#description');
	doc.empty();
	doc.append($("<h3>", {id: "startPage ", "class": "title is-3"}).html('How to use the library?'));
	doc.append($('<p>').html("To use the library simply do the following import in your code, then use the functions."))
	{
		var theCode="var oeel=require('users/OEEL/lib:loadAll')";
		var clipboardElement=$("<div>", {"class": "clipboard"}).html('<i class="fas fa-copy"></i>');
		clipboardElement.click(function () {navigator.clipboard.writeText(theCode)});
		doc.append($("<div>", {"class": "codeBlockWithCB"}).append($("<pre>")
			.append($("<code>", {id: "reference-code", "class": "language-javascript"})
				.html(theCode)))
			.append(clipboardElement));
	}
	doc.append($('<p>').html("it's as simple as that!"))

	doc.append($("<h4>", {id: "SFLoad ", "class": "title is-4"}).html('Single file load'));
	doc.append($('<p>').html("As the library continues to grow, the loading time also increases, especially without the Open Earth engine extension. This can become problematic in certain applications, such as Apps. To address this, we are now offering a quick loading version that utilizes minified data. However, it's important to note that this version should not be used for debugging purposes."))
	{
		var theCode="var oeel=require('users/OEEL/lib:loadAllSF')";
		var clipboardElement=$("<div>", {"class": "clipboard"}).html('<i class="fas fa-copy"></i>');
		clipboardElement.click(function () {navigator.clipboard.writeText(theCode)});
		doc.append($("<div>", {"class": "codeBlockWithCB"}).append($("<pre>")
			.append($("<code>", {id: "reference-sf-code", "class": "language-javascript"})
				.html(theCode)))
			.append(clipboardElement));
	}
	

	doc.append($("<h3>", {id: "refOeel ", "class": "title is-3"}).html('You need to know which function you used?'));
	doc.append($('<p>').html("Simply add at the following line at the end of your code, and you will get the list of all function used and other related information."))

	{
		var theCodeRef="print('List of functions used',oeel.refs())";
		var clipboardElement=$("<div>", {"class": "clipboard"}).html('<i class="fas fa-copy"></i>');
		clipboardElement.click(function () {navigator.clipboard.writeText(theCodeRef)});
		doc.append($("<div>", {"class": "codeBlockWithCB"}).append($("<pre>")
			.append($("<code>", {id: "reference-code", "class": "language-javascript"})
				.html(theCodeRef)))
			.append(clipboardElement));
	}

	doc.append($("<h3>", {id: "startPage ", "class": "title is-3"}).html('<img src="https://www.mgravey.com/assets/logo/Python.svg" style="max-height:2rem;"> How to use it from Python? <a href="https://gist.github.com/mgravey/4842fe18b38bd6be6635902f36844908"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>'));
	doc.append($('<p>').html('<i class="fas fa-flask" aria-hidden="true"></i> An experimental feature allow to install and use the library from Python'))

	doc.append($('<p>').html('To install:'))
	{
		var theCodeRef="pip install oeel";
		var clipboardElement=$("<div>", {"class": "clipboard"}).html('<i class="fas fa-copy"></i>');
		clipboardElement.click(function () {navigator.clipboard.writeText(theCodeRef)});
		doc.append($("<div>", {"class": "codeBlockWithCB"}).append($("<pre>")
			.append($("<code>", {id: "reference-code", "class": "language-python"})
				.html(theCodeRef)))
			.append(clipboardElement));
	}
	doc.append($('<p>').html('To use it, first import the package:'))
	{
		var theCodeRef="from oeel import oeel";
		var clipboardElement=$("<div>", {"class": "clipboard"}).html('<i class="fas fa-copy"></i>');
		clipboardElement.click(function () {navigator.clipboard.writeText(theCodeRef)});
		doc.append($("<div>", {"class": "codeBlockWithCB"}).append($("<pre>")
			.append($("<code>", {id: "reference-code", "class": "language-python"})
				.html(theCodeRef)))
			.append(clipboardElement));
	}
	doc.append($('<p>').html('then use it as in JavaScript.'))

	doc.append($('<p>').html('To use an external JavaScript lib (external to oeel):'))
	let c1=$('<div>',{"class": "column is-three-fifths"});
	let c2=$('<div>',{"class": "column is-two-fifths"});
	doc.append($('<div>',{"class": "columns"}).append(c1).append(c2))

	{
		var theCodeRef="externalLib=oeel.requireJS('./localPathToTheJSFile')\n\nexternalLib.simplePrint('Hello Earth!')\n # Hello Earth!";
		var clipboardElement=$("<div>", {"class": "clipboard"}).html('<i class="fas fa-copy"></i>');
		clipboardElement.click(function () {navigator.clipboard.writeText(theCodeRef)});
		c1.append($("<div>", {"class": "codeBlockWithCB"}).append($("<pre>")
			.append($("<code>", {id: "reference-code", "class": "language-python"})
				.html(theCodeRef)))
			.append(clipboardElement));
	}
	{
		var theCodeRef="// ./localPathToTheJSFile\nexports.simplePrint=function(val){\n\tprint(val)\n}";
		var clipboardElement=$("<div>", {"class": "clipboard"}).html('<i class="fas fa-copy"></i>');
		clipboardElement.click(function () {navigator.clipboard.writeText(theCodeRef)});
		c2.append($("<div>", {"class": "codeBlockWithCB"}).append($("<pre>",{"style":"overflow: hidden;"})
			.append($("<code>", {id: "reference-code", "class": "language-javascript"})
				.html(theCodeRef)))
			.append(clipboardElement));
	}
	doc.append($('<p>').html('It exists no guarantee that the external js lib can be loaded, and used in the interface. In particular, if the function interacts with the code editor Map.* or Export.*. But some Map feature are supported with'))
	{
		var theCodeRef="import geemap\nMap = geemap.Map(center=(0, 0), zoom=4)\noeel.setMap(Map)\nMap";
		var clipboardElement=$("<div>", {"class": "clipboard"}).html('<i class="fas fa-copy"></i>');
		clipboardElement.click(function () {navigator.clipboard.writeText(theCodeRef)});
		doc.append($("<div>", {"class": "codeBlockWithCB"}).append($("<pre>")
			.append($("<code>", {id: "reference-code", "class": "language-python"})
				.html(theCodeRef)))
			.append(clipboardElement));
	}

	doc.append($("<h3>", {id: "startPage ", "class": "title is-3"}).html('License?'));
	doc.append($('<p>').html("Each function has its own license so please refer to it directly.<br>The license of the library is LGPLv3 or later, but this is only including the library architecture (synchronization with GEE, documentation code…) it’s unrelated to the license of each function."+
		"<br>To obtain a comprehensive list of all the functions you utilize, along with relevant information like citation DOIs or licenses, you can utilize the following snippet at the end of your code").append($("<div>", {"class": "codeBlockWithCB"}).append($("<pre>")
			.append($("<code>", {id: "reference-code", "class": "language-python"})
				.html("print('List of functions used and their details',oeel.refs())")))))

	Prism.highlightAll();
}

function displayContributePage(){
	$('.documentation-menu').slideUp();
	var doc = $('#description');
	doc.empty();

	doc.append($("<h2>", {"class": "title is-2"}).html("You want to contribute to the OEEL?<br> You are at the right place!"));


	doc.append($("<h3>", {"class": "title is-3"}).html("Documentation"));
	doc.append($('<p>').html("You see a typo, an incomplete or unclear documentation:\
	The issue is with a function?\
	Simply open the related file on GitHub and propose an edit.\
	<br>On this website, you can edit this web page on the “gh-pages” branch on GitHub."));
	doc.append($("<h3>", {"class": "title is-3"}).html("Missing examples"));
	doc.append($('<p>').html("You can simply add examples on the <a href='https://github.com/open-geocomputing/OpenEEL_Examples' target=_blank>dedicated GitHub repository</a>"));
	doc.append($("<h3>", {"class": "title is-3"}).html("Bugs?"));
	doc.append($('<p>').html("You know how to fix it? Submit an edit with a justification of the issue (and possible an example). You don’t know? It’s not a problem, simply open an issue on GitHub. The community can probably help you."));
	doc.append($("<h3>", {"class": "title is-3"}).html("A new function?"));
	doc.append($('<p>').html("You have a new function to add? Already thanks for considering it.\
		Start with a look on the <a href='https://code.earthengine.google.com/?scriptPath=users%2FOEEL%2Flib%3ADarftNewFunction' target='_blank'>draft script</a>, that provides a baseline to write new functions.\
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
	doc.append($('<p>').html("The parameters are automatically read whether the function is informed as list or an object, and automatically generates an object (after checking the type), where each key refers to a name in the input list. "));

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
	$('.documentation-menu').slideUp();
	var doc = $('#description');
	doc.empty();
	
	doc.append($("<h3>", {"class": "title is-3"}).html("Aims and values"));
	doc.append($("<a>", {"target":"_blank", "href":'/'}).append($("<img>", {"src": "/images/digitalWorld.gif", style:"width: 140px; float: left; margin-right: 10px; filter: brightness(200%);"})));

	doc.append($('<p>').html("The Open Earth Engine Library (aka. OEEL) is part of the <a href='/' target='_blanck'>open-geocomputing initiative</a>.\
	 The goal is to provide Google Earth Engine (GEE) users with free and open algorithms. Some of the codes required many hours of design and debugging. It would be a waste not to share them with other users."))

	// doc.append($("<h3>", {"class": "title is-3"}).html("Who can contribute?"));
	// doc.append($('<p>').html("The library is open to everyone, from the development of the new algorithm to a simply fix of a typo. Even opening an issue on the GitHub when we detect a bug is a significant contribution to the community."))

	// doc.append($("<h3>", {"class": "title is-3"}).html("How to contribute:"));
	// doc.append($('<p>').html("To contribute please check the <a href='#How-to-contribute'>dedicated page</a>."))

	doc.append($("<h3>", {"class": "title is-3"}).html("The origin"));
	doc.append($("<a>", {"target":"_blank", "href":'https://unil.ch'}).append($("<img>", {"src": "https://www.unil.ch/modules/unil-core/img/unil-logo.svg", style:"width: 165px; float: left; margin-right: 10px;"})));
	doc.append($('<p>').html("The project finds its origin from a library developed by Mathieu Gravey for his personal usage and stores the algorithms developed during his PhD at the University of Lausanne. Starting with a simple git mapping between GitHub and Google Earth Engine. Finally, the project was enhanced with automatic documentation and examples, to allow easy integration of new codes. A particular thanks to Dr. Raphaël Nussbaumer who designed this web site."))

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
	var keys = Object.keys(data).sort();
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
request = new XMLHttpRequest;
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


// load data 
var requestExample = new XMLHttpRequest;
requestExample.open('GET', 'https://raw.githubusercontent.com/open-geocomputing/OpenEEL_Examples/master/doc/functionPerExample.json', true);

requestExample.onload = function () {
	if (requestExample.status >= 200 && requestExample.status < 400) {
		// Success!
		exampleData = JSON.parse(requestExample.responseText);
		delete exampleData.timeSinceEpoch;
	} else {
		// We reached our target server, but it returned an error

	}
	request.send();
};

requestExample.send();



