import json
import ee

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
						args[key]=json.dumps(ee.serializer.encode(args[key]));
					for x in range(len(argl)):
						argl[x]=json.dumps(ee.serializer.encode(argl[x]));
					self.nodeSocket.send_string(json.dumps({'type':'call','lib':self.nodeID,'functionName':functionName,'args':args,'argl':argl}))
					answer=json.loads(self.nodeSocket.recv())
					if 'payload' in answer:
						return ee.deserializer.fromJSON(answer['payload']);
					else:
						return
				return localFunc;
			else:
				self.nodeSocket.send_string(json.dumps({'type':'call','lib':self.nodeID,'functionName':functionName,'args':None}))
				answer=json.loads(self.nodeSocket.recv())
				if 'payload' in answer:
					return ee.deserializer.fromJSON(answer['payload']);
				else:
					return;

		__getattr__ = get

		def __dir__(self):
			return self.availability.keys();

		def __del__(self):
			self.libInterface=None;
			self.initialized=False;
			self.nodeSocket.send_string(json.dumps({'type':'unload','lib':self.nodeID}))
			self.nodeID=None;
			answer=json.loads(self.nodeSocket.recv())

	def __init__(self,soket,libPath):
		soket.send_string(json.dumps({'type':'load','lib':libPath}))
		answer=json.loads(soket.recv())
		if( not answer['sucess'] ):
			raise oeelInitFailed();
		self.libInterface=self.callArgument(answer,soket);
		self.initialized=True;


		
		