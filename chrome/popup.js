$(document).ready(() => {
  chrome.tabs.getSelected(null, function(tab) {
    $.get("http://localhost:3000", {
      url: tab.url
    })
      .done(function( data ) {
        if(data.length <= 0) {
          return
        }

        let msg = `You're watching "${data}"`;
        $('#message').text(msg)
      });
  });
});