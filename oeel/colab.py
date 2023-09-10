import ee
import IPython
from google.colab import output
import google.auth.credentials
import threading
import time

class OEE_ExtensionError(Exception):
	def __init__(self, message):
		self.message = message
		super().__init__(self.message)

def AuthAndInitilize(extensionID="dhkobehdekjgdahfldleahkekjffibhg"):
	jsCode='''
		window.authToken = "";

		function sendAuthMessage() {
			chrome.runtime.sendMessage("''' + extensionID + '''", "getAuthTocken",
				function(response) {
					if(response && response.type=='authToken'){
						window.authToken = response.message;
					}else{
						window.authToken='error';
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

	def fetch_auth_token():
		return output.eval_js('authToken')
	token=fetch_auth_token()
	cpt=0
	while token=='' and cpt<1000:
		token = fetch_auth_token()	
		time.sleep(0.01)
		cpt+=cpt+1
	if(token=='error'):
		raise OEE_ExtensionError("The token could not be retrieved from the extension.");
	if(token!=''):
		credential=google.oauth2.credentials.Credentials(token)
		ee.Initialize(credential)
	else:
		raise OEE_ExtensionError("Unexpected error during retrieval from the extension.")

	def monitor_auth_token():
		while True:
			time.sleep(5 * 60)
			token = fetch_auth_token()
			credential=google.oauth2.credentials.Credentials(token)
			ee.data._credentials=credential;

	# Create a thread to monitor the authToken
	monitor_thread = threading.Thread(target=monitor_auth_token)

	# Start the thread
	monitor_thread.start()
