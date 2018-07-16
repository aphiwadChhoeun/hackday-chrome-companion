$(document).ready(() => {
  chrome.tabs.getSelected(null, function(tab) {
    $.get("http://localhost:3000", {
      url: tab.url
    })
      .done(function( data ) {
        let msg = `You're watching "${data}"`;
        $('#message').text(msg)
      });
  });
});