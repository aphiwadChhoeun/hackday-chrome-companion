$(document).ready(() => {
  chrome.tabs.getSelected(null, function(tab) {

    $('#message').append('<span class="loader">retrieving content...</span>');

    $.get("http://localhost:3000", {
      url: tab.url
    })
      .done(function( data ) {
        if(data.length <= 0) {
          return
        }

        let items = JSON.parse(data)

        let ul = $('<ul>');
        ul.addClass('result');

        for(let i=0; i<items.length; i++) {
          let li = $('<li>');

          let header = $('<a>');
          header.addClass('header');
          header.attr('href', items[i].href);
          header.attr('target', '_blank');
          header.text(items[i].title);

          let thumb = $('<div>')
          thumb.addClass('thumb');
          if(items[i].thumb) {
            thumb.append(`<img src="${items[i].thumb}">`);
          }

          let body = $('<div>');
          body.addClass('desc');
          body.html(items[i].body)

          li.append(header);
          li.append(thumb);
          li.append(body);

          ul.append(li);
        }

        $('#message').html('').append(ul);
      });
  });
});