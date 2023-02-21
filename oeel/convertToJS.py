import json
import ee
import inspect
import requests

class exportEEjs():
	generatedFile='function readInputs(e,r){var n={};if(1==e.length&&"object"==typeof e[0]&&(r.filter(function(r){return -1!=Object.keys(e[0]).indexOf(r)}).length>0||0===Object.keys(e[0]).length))n=e[0];else for(var t=0;t<e.length;t++)n[r[t]]=e[t];var i=r.filter(function(e){return -1==Object.keys(n).indexOf(e)});if(i.length>0)throw"the following inpus are missing: "+i.map(function(e){return\'"\'+e+\'"\'}).join(", ");return n}function applyInputs(e,r){var n=JSON.parse(r),t=Object.keys(e);for(var i in t){if((e[t[i]] instanceof ee.ComputedObject) && !ee.Serializer.encode(e[t[i]],false).value){return null} var a=JSON.parse(ee.Serializer.toCloudApiJSON(e[t[i]]).replace(RegExp(\'"valueReference":"\',"g"),\'"valueReference":"\'+t[i])),l=Object.keys(a.values);for(var u in l)n.values[t[i]+l[u]]=a.values[l[u]]}return ee.Deserializer.decode(n)}';
	withSource=True

	def decodeFunctions(self,function):
		jsCode="";
		if self.withSource:
			jsCode+="/*\n"+inspect.getsource(function)+"\n*/"
		param=inspect.signature(function);
		resultCall=function(**dict(map(lambda x:(x,ee.ComputedObject(None,None,x+str(0))),param.parameters)));
		stringJson=ee.serializer.toJSON(resultCall)
		stringJson=stringJson.replace('argumentReference','valueReference');
		jsCode+='\nexports.'+function.__name__+'=function(){var inputDictionary=readInputs(Array.prototype.slice.call(arguments,0),'+json.dumps(list(param.parameters.keys()))+');'\
		+"var json='"+stringJson+"'; return applyInputs(inputDictionary,json);};"
		return jsCode;

	def __init__(self,functions):
		if( not isinstance(functions, list)):
			functions=[functions];
		self.generatedFile+="\n".join(map(self.decodeFunctions,functions));

	def exportTo(self,path="./pythonExported.js"):
		if(path):
			text_file = open(path, "w")
			text_file.write(self.generatedFile)
			text_file.close()
		else:# sumbit to a public repository 
			url = 'https://oeel-share-js-code.open-geocomputing.org:18614'
			reponseDic = requests.post(url, json = {'code': self.generatedFile}).json()
			reponseDic["jsImport"]="var pythonLib=require(\""+reponseDic["path"]+"\")";

			return reponseDic
