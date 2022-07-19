import zmq
import socket
import subprocess
import atexit
import json
import requests
import ee
import os
import threading
import time
from shutil import which

from . import external
oeelLibPath=os.path.dirname(__file__)

class oeelMissingExternalCommand(Exception):
		pass

import sys
IN_COLAB = 'google.colab' in sys.modules

def initialize():
	if(os.path.exists(oeelLibPath+'/initialized')):
		return
	else:
		print('Start initilization of OEEL...')
	
		currentPath=os.getcwd();
		gitPath=which('git');
		nodePath=which('node');
		if(not gitPath and not nodePath):
			raise oeelMissingExternalCommand('git and node are required for this module please install them, and if needed add them to the path.')
		if(not gitPath):
			raise oeelMissingExternalCommand('git is required for this module please install it, and if needed add it to the path.')
		if(not nodePath):
			raise oeelMissingExternalCommand('node(NodeJS) is required for this module please install it, and if needed add it to the path.')
		if gitPath:
			os.chdir(oeelLibPath)
			if(not os.path.exists('OEEL')):
				subprocess.check_output("git clone https://github.com/open-geocomputing/OpenEarthEngineLibrary.git OEEL".split())
		if nodePath:
			if(which('npm')):
				try:
					subprocess.check_output("npm install @google/earthengine",shell=True)
				except Exception as e:
					print("Please install manually using : npm install @google/earthengine")
				try:
					subprocess.check_output("npm install zeromq@6.0.0-beta.6",shell=True)
				except Exception as e:
					print("Please install manually using : npm install zeromq@6.0.0-beta.6")
				try:
					subprocess.check_output("npm install request",shell=True)
				except Exception as e:
					print("Please install manually using : npm install request")
			else:
				raise oeelMissingExternalCommand('You have node, but not npm in the path you will need to fix this.')
			pass
		os.chdir(currentPath)
		open(oeelLibPath+'/initialized', 'a').close()
		print('Initilization of OEEL is finished')

initialize()

subprocess.Popen(['git', 'pull'], cwd=oeelLibPath+'/OEEL',stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

class dotdict(dict):
    """dot.notation access to dictionary attributes"""
    __getattr__ = dict.get
    __setattr__ = dict.__setitem__
    __delattr__ = dict.__delitem__
    __dir__		= dict.keys

class oeelClass():
	nodeSocket=None;
	oeelLibInterface=None;
	initialized=False;
	Map=None;

	def setMap(self, eemap):
		self.Map=eemap;

	class oeelMissingMendatoryArguments(Exception):
		pass
	class oeelExtraArguments(Exception):
		pass
	class oeelInitFailed(Exception):
		pass
	class oeelMissingRequireFile(Exception):
		pass

	def __init__(self):
		self.nodeSocket=None;
		self.loadOEELFunctions()
		self.init();

	def manageNodeRequest(self,message):
		if(message['function']=='print'):
			for x in message['payload'].keys():
				print(message['payload'][x])
		if(message['function'].startswith('Map.') and self.Map):
			if(message['function']=='Map.addLayer'):
				param=message['payload'];
				param['eeObject']=ee.deserializer.fromJSON(param['eeObject']);
				renaming={'eeObject':'ee_object', 'visParams':'vis_params', 'name':'name', 'shown':'shown', 'opacity':'opacity'}
				param = {renaming[k]:v for (k,v) in param.items()}
				self.Map.addLayer(**param)
				pass
			if(message['function']=='Map.setCenter'):
				param=message['payload'];
				renaming={'lon':'lon', 'lat':'lat', 'zoom':'zoom'}
				param = {renaming[k]:v for (k,v) in param.items()}
				self.Map.setCenter(**param)
				pass
			if(message['function']=='Map.setControlVisibility'):
				param=message['payload'];
				renaming={'eeObject':'ee_object', 'visParams':'vis_params', 'name':'name', 'shown':'shown', 'opacity':'opacity'}
				param = {renaming[k]:v for (k,v) in param.items()}
				self.Map.setControlVisibility()
				pass
			if(message['function']=='Map.setOptions'):
				param=message['payload'];
				renaming={'mapTypeId':'mapTypeId', 'styles':'styles', 'types':'types'}
				param = {renaming[k]:v for (k,v) in param.items()}
				self.Map.setOptions(**param)
				pass
			if(message['function']=='Map.setZoom'):
				param=message['payload'];
				self.Map.zoom=param['zoom'];
				pass
			if(message['function']=='Map.getCenter'):
				return {'sucess':True, 'payload':self.Map.center};
				pass
			if(message['function']=='Map.getScale'):
				return {'sucess':True, 'payload':self.Map.getScale()};
				pass
			if(message['function']=='Map.getZoom'):
				return {'sucess':True, 'payload':self.Map.zoom};
				pass
		
		return None;

	def nodeRequestD(self,port):
		context = zmq.Context()
		socket = context.socket(zmq.REP)
		socket.bind("tcp://*:%s" % port)
		while True:
			socket.send_string(json.dumps(self.manageNodeRequest(json.loads(socket.recv()))));

	def loadNodeJs(self,token):
		sock = socket.socket()
		sock.bind(('', 0))
		sock2 = socket.socket()
		sock2.bind(('', 0))
		freePort=sock.getsockname()[1];
		freePort2=sock2.getsockname()[1];

		del sock
		del sock2

		process =subprocess.Popen(["node", "./EE_node_server.js",str(freePort),str(freePort2),token], cwd=oeelLibPath)
		atexit.register(process.terminate)
		pid = process.pid

		context = zmq.Context()
		nodeJsSocket = context.socket(zmq.REQ)
		nodeJsSocket.connect("tcp://127.0.0.1:{}".format(freePort))

		th=threading.Thread( target=self.nodeRequestD, args=(freePort2,) ,daemon=True)
		th.start()

		return nodeJsSocket;

	def init(self,token=None):
		if(not self.initialized and not self.nodeSocket):
			if(not token):
				if ee.data._credentials and ee.data._credentials.token:
					token=ee.data._credentials.token;
				else:
					return;
			self.nodeSocket=self.loadNodeJs(token);
			self.nodeSocket.send_string(json.dumps({'type':'load','lib':'users/OEEL/lib:loadAll'}))
			if(not json.loads(self.nodeSocket.recv())['sucess']):
				raise self.oeelInitFailed();
			else:
				self.initialized=True;

	def constructCall(self,leaf):
		
		# print(leaf['fullPath'])
		def localFunc(*argl,**args):
			# check if mendatory input is present
			# print(leaf['inputs'])
			self.init()
			for x in range(len(argl)):
				args[leaf['inputs'][x]['name']]=argl[x];
			mendatoryInputs=set([inputInfo['name'] for inputInfo in leaf['inputs']  if (('optional' not in inputInfo.keys()) or (not inputInfo['optional'])) and ( 'defaultValue' not in inputInfo.keys()) and ( 'Return'!=inputInfo['name']) ]);
			allMendatoryPresent=mendatoryInputs.intersection(set(args.keys()))
			missing=mendatoryInputs-allMendatoryPresent;
			if(missing):
				# some mendatory argument are missing
				raise self.oeelMissingMendatoryArguments("oeel{} require absolutely the following arguments: {}".format(leaf['fullPath'],','.join(missing)))
			extraArgument=set(args.keys())-set([inputInfo['name'] for inputInfo in leaf['inputs']]);
			if(extraArgument):
				# some paranter are not supported
				raise self.oeelExtraArguments("oeel{} do not support the following arguments: {}".format(leaf['fullPath'],','.join(extraArgument)))
			for key in args.keys():
				args[key]=json.dumps(ee.serializer.encode(args[key]));
			# send request
			#print(json.dumps({'type':'call','functionName':leaf['fullPath'],'args':args}))
			self.nodeSocket.send_string(json.dumps({'type':'call','lib':'oeel','functionName':leaf['fullPath'],'args':args}))
			answer=json.loads(self.nodeSocket.recv())
			if 'payload' in answer:
				return ee.deserializer.fromJSON(answer['payload']);
			else:
				return
		return localFunc

	def applyCallInTree(self,substruct,parent):
		if('fullPath' in substruct):
			return self.constructCall(substruct)
		for key in substruct.keys():
			if(type(substruct[key]) is dict):
				substruct[key]=self.applyCallInTree(substruct[key],substruct);
		return dotdict(substruct);

	def loadOEELFunctions(self):
		
		r = requests.get('https://www.open-geocomputing.org/OpenEarthEngineLibrary/doc.json')
		oeelStruct=r.json();
		self.oeelLibInterface=self.applyCallInTree(oeelStruct,oeelStruct);
		
	def dotCall(self, argument):
		if(argument=='external'):
			return print
		else: # oeel call
			return print

	def requireJS(self,libPath):
		self.init();
		if(os.path.exists(os.getcwd()+'/'+libPath)):
			return external.externalEEjs(self.nodeSocket,os.getcwd()+'/'+libPath).libInterface;
		else:
			raise self.oeelMissingRequireFile('No file at :'+os.getcwd()+'/'+libPath);
	__getattr__ = dotCall


oeelManadger=oeelClass();
oeelManadger.oeelLibInterface.init=oeelManadger.init;
oeelManadger.oeelLibInterface.requireJS=oeelManadger.requireJS;
oeelManadger.oeelLibInterface.setMap=oeelManadger.setMap;
oeel=oeelManadger.oeelLibInterface