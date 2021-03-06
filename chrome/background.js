// make icon available only if user on show video page
let rule1 = {
	conditions: [new chrome.declarativeContent.PageStateMatcher({
		pageUrl: {hostEquals: 'www.cbs.com'},
		css: ["span[id='series_title']"]
	})
	],
	actions: [new chrome.declarativeContent.ShowPageAction()]
};

let rule2 = {
	conditions: [new chrome.declarativeContent.PageStateMatcher({
		pageUrl: {hostEquals: 'local.cbs.com'},
		css: ["span[id='series_title']"]
	})
	],
	actions: [new chrome.declarativeContent.ShowPageAction()]
};

chrome.runtime.onInstalled.addListener(function() {
  console.log('CBS Companion is installed');

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
	  chrome.declarativeContent.onPageChanged.addRules([rule1]);
	  chrome.declarativeContent.onPageChanged.addRules([rule2]);
  });

  // show notification when user on show video page
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status === 'loading') {
      console.log(tab.url)

      let patt = /(www.cbs.com\/shows\/)[a-zA-Z\d_-]+(\/video\/)/i;

      if(patt.test(tab.url)) {
        chrome.notifications.create(null, {
          type: "basic",
          iconUrl: "images/Icon-48.png",
          title: "CBS Companion",
          message: "Interesting articles about your show are available!"
        });
      }

    }
  });

});