import ee
import IPython
from google.colab import output
from google.oauth2.credentials import Credentials
from datetime import datetime, timedelta
import time

class OEE_ExtensionError(Exception):
	def __init__(self, message):
		self.message = message
		super().__init__(self.message)

class OEE_Credentials(Credentials):
	def __init__(self, extensionID, *args, **kwargs):
		super().__init__("",*args, **kwargs)
		self.startJsSectionToRecoverTokens(extensionID);
		self.setNewToken(True);
		

	def startJsSectionToRecoverTokens(self,extensionID):
		jsCode='''
			window.authToken = "";

			function sendAuthMessage() {
				chrome.runtime.sendMessage("''' + extensionID + '''", "getAuthTocken",
					function(response) {
						if(response && response.type=='authToken'){
							window.authToken = response.message;
				console.log(window.authToken)
				localStorage.setItem("EEauthToken",response.message)
						}else{
							window.authToken='error';
				localStorage.setItem("EEauthToken",'error')
						}
					}
				);
			}

			// Call the function once immediately
			sendAuthMessage();
			// Then call it every 14 minutes
			setInterval(sendAuthMessage, 14 * 60 * 1000);
		'''
		IPython.display.display(IPython.display.Javascript(jsCode))

	def getToken(self):
		for _ in range(10):
			tk=output.eval_js('localStorage.getItem("EEauthToken")',False,1);
			if tk is not None:
				return tk
		return None

	def setNewToken(self,initialize=False):
		token=self.getToken()
		if(initialize):
			cpt=0
			while token=='' and cpt<1000:
				token=self.getToken()	
				time.sleep(0.01)
				cpt+=cpt+1
			if(token=='error'):
				raise OEE_ExtensionError("The token could not be retrieved from the extension.");
		self.token = token;
		self.expiry = datetime.utcnow() + timedelta(minutes=30)  # Token valid for 1 hour but let's refresh each 30 min

	def refresh(self, request):
		if self.expired:
			self.setNewToken();


def AuthAndInitilize(extensionID="dhkobehdekjgdahfldleahkekjffibhg"):
	ee.Initialize(OEE_Credentials(extensionID))
