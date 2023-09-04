import ee
import IPython
from google.colab import output
import google.auth.credentials

class OEE_ExtensionError(Exception):
	def __init__(self, message):
		self.message = message
		super().__init__(self.message)

def oeelInitilize(response):
	if(response["type"]=="authToken"):
		credential=google.oauth2.credentials.Credentials(response["message"])
		ee.Initialize(credential)
	else:
		raise OEEL_ExtensionError("The token could not be retrieved from the extension.")

output.register_callback('notebook.oeelInitilize', oeelInitilize)

def AuthAndInitilize(extensionID="dhkobehdekjgdahfldleahkekjffibhg"):
	jsCode='''chrome.runtime.sendMessage("'''+extensionID+'''", "getAuthTocken",
		function(response) {
		  console.log(response)
			google.colab.kernel.invokeFunction("notebook.oeelInitilize", [response], {});
		}
	);'''
	IPython.display.display(IPython.display.Javascript(jsCode))

