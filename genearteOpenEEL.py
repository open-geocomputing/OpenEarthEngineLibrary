import json
import os
from datetime import datetime

repo=os.environ['GEE_REPO_ADDRESS'];

def generateDictionary(requirePath,path,dirList):
	val={};
	for toExplore in dirList:
		if(toExplore[0]=='_'):
				continue;
		if(os.path.isdir(os.path.join(path, toExplore))):
			val[toExplore]=generateDictionary(requirePath+toExplore+'/',path+'/'+toExplore,os.listdir(path+'/'+toExplore));
		else:
			val[toExplore]='require(\''+requirePath+toExplore+'\')';
	return val;

val=generateDictionary(repo+':/','.',
	[ name for name in os.listdir('.') if os.path.isdir(os.path.join('.', name)) and name[0]!='.' ]+['internal']);

libString='var libs='+json.dumps(val).replace('"','')+\
				'\n\n//generated automatically the '+str(datetime.utcnow())+\
				'UTC \n\n'+'exports=libs.internal.setupLibrary(libs);\n\n'+\
				'exports.type="Open Earth Engine Library\\nRelease date: '+datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')+'\\nPlease refer to the online documentation:\\nhttps://www.open-geocomputing.org/OEEL"';

text_file = open("loadAll", "w")
text_file.write(libString)
text_file.close()

val=generateDictionary('./','.',
	[ name for name in os.listdir('.') if os.path.isdir(os.path.join('.', name)) and name[0]!='.' ]+['internal']);

libString='var libs='+json.dumps(val).replace('"','')+\
				'\n\n//generated automatically the '+str(datetime.utcnow())+\
				'UTC \n\n'+'exports.all=libs.internal.setupLibrary(libs);';

text_file = open("loadAll4py", "w")
text_file.write(libString)
text_file.close()

from jsmin import jsmin
import re
pattern = r"description:'((?:\\.|[^'])*)'"

def generateDictionaryInline(path,dirList):
	val={};
	for toExplore in dirList:
		if(toExplore[0]=='_' or toExplore[0]=='.'):
				continue;
		if(os.path.isdir(os.path.join(path, toExplore))):
			val[toExplore]=generateDictionaryInline(path+'/'+toExplore,os.listdir(path+'/'+toExplore));
		else:
			print(path+'/'+toExplore)
			with open(path+'/'+toExplore, "r") as file:
				content = file.read()
				content=re.sub(pattern, "description:'minified'", content)
				val[toExplore]='eval("(function(){var exports={};'+ json.dumps(jsmin(content, quote_chars="'\"`"))[1:-1] +';return exports})()")';
	return val;

val=generateDictionaryInline('.',
	[ name for name in os.listdir('.') if os.path.isdir(os.path.join('.', name)) and name[0]!='.' ]+['internal']);



def create_js_object(py_dict):
    js_object_str = "{"

    for k, v in py_dict.items():
        if isinstance(v, str):
            js_object_str += f'\n{k}: {v}, '
        else:
            js_object_str += f'{k}: {create_js_object(v)}, '

    js_object_str = js_object_str.rstrip(', ')
    js_object_str += "}"
    return js_object_str

libString='var libs='+create_js_object(val)+\
				'\n\n//generated automatically the '+str(datetime.utcnow())+\
				'UTC \n\n'+'exports=libs.internal.setupLibrary(libs);\n\n'+\
				'exports.type="Open Earth Engine Library\\nRelease date: '+datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')+'\\nPlease refer to the online documentation:\\nhttps://www.open-geocomputing.org/OEEL"';

text_file = open("loadAllSF", "w")
text_file.write(libString)
text_file.close()
