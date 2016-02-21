//background.js

chrome.browserAction.onClicked.addListener(function(tab)){
	chrome.tabs.query({active: true, currentWindow: true},){
		var activeTab = tabs[0];
		chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});	
	});
});