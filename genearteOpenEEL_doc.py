import json
import os
from datetime import datetime

repo='./';

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

val=generateDictionary(repo,'.',
	[ name for name in os.listdir('.') if os.path.isdir(os.path.join('.', name)) and name[0]!='.' ]+['internal']);

libString="var ee=require('./ee.js');"

libString+='var oeel='+json.dumps(val).replace('"','')+\
				'\n\n//generated automatically the '+str(datetime.utcnow())+\
				'UTC \n\n'+"var doc=oeel.internal.getDoc(oeel,'');\n\
\n\
doc.timeSinceEpoch=Date.now();\
\n\
var fs = require('fs');\n\
var outputFilename = 'doc.json';\n\
\n\
fs.writeFile(outputFilename, JSON.stringify(doc, null, 4), function(err) {\n\
    if(err) {\n\
      console.log(err);\n\
    } else {\n\
      console.log('JSON saved to ' + outputFilename);\n\
    }\n\
}); "

text_file = open("openEEL_doc", "w")
text_file.write(libString)
text_file.close()