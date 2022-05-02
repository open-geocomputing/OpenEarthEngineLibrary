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
				'UTC \n\n'+'exports=libs.internal.setupLibrary(libs);';

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
