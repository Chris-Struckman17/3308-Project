//background.js
chrome.contextMenus.create({
	title: "Queue Song",
	contexts:["link"],
	onclick: myFunction

});

function myFunction() {
	alert("Added song to Queue!");
}