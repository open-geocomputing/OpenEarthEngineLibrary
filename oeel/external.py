import json
import ee
import types
import atexit

exiting = False

def set_exiting():
	global exiting
	exiting = True

atexit.register(set_exiting)

def encodeInput(inputVal):
	if(isinstance(inputVal, types.FunctionType)):
		return {'type':'function','value':id(inputVal)}
	if(isinstance(inputVal, ee.computedobject.ComputedObject)):
		return {'type':'ee','ee_type':inputVal.name(),'value':json.dumps(ee.serializer.encode(inputVal))};
	return {'type':'other','value':json.dumps(ee.serializer.encode(inputVal))};

def decodeInput(inputVal):
	if(inputVal['type']=='function'):
		raise NotImplementedError("This function has not been implemented yet due to the missing counterpart in JavaScript.");
	if(inputVal['type']=='ee'):
		return getattr(ee,inputVal['ee_type'])(ee.deserializer.fromJSON(inputVal["value"]));
	return ee.deserializer.fromJSON(inputVal["value"]);

class externalEEjs():
	libInterface=None;
	initialized=False;
	

	class callArgument():
		nodeID=None
		availability=None;
		nodeSocket=None;

		class oeelInexistantArguments(Exception):
			pass

		def __init__(self,answer,soket):
			self.nodeSocket=soket;
			self.availability=answer['availability'];
			self.nodeID=answer['id'];
		
		def get(self,functionName):
			if(functionName not in self.availability.keys()):
				raise self.oeelInexistantArguments();
			if(self.availability[functionName]=='function'):
				#function call
				def localFunc(*argl,**args):
					argl=list(argl);
					for key in args.keys():
						args[key]=encodeInput(args[key]);
					for x in range(len(argl)):
						argl[x]=encodeInput(argl[x]);
					self.nodeSocket.send_string(json.dumps({'type':'call','lib':self.nodeID,'functionName':functionName,'args':args,'argl':argl}))
					answer=json.loads(self.nodeSocket.recv())
					if 'payload' in answer:
						return decodeInput(answer['payload']);
					else:
						return
				return localFunc;
			else:
				self.nodeSocket.send_string(json.dumps({'type':'call','lib':self.nodeID,'functionName':functionName,'args':None}))
				answer=json.loads(self.nodeSocket.recv())
				if 'payload' in answer:
					return decodeInput(answer['payload']);
				else:
					return;

		__getattr__ = get

		def __dir__(self):
			return self.availability.keys();

		def __del__(self):
			pass
			self.libInterface=None;
			self.initialized=False;
			self.nodeSocket.send_string(json.dumps({'type':'unload','lib':self.nodeID}))
			self.nodeID=None;
			global exiting
			if not exiting:
				answer=json.loads(self.nodeSocket.recv())

	def __init__(self,soket,libPath):
		soket.send_string(json.dumps({'type':'load','lib':libPath}))
		answer=json.loads(soket.recv())
		if( not answer['sucess'] ):
			raise oeelInitFailed();
		self.libInterface=self.callArgument(answer,soket);
		self.initialized=True;
