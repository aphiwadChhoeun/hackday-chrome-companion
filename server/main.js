const express = require('express')
const rp = require('request-promise')
const cheerio = require('cheerio')
const app = express()

app.get('/', (req, res) => {
  
  const options = {
    uri: req.query.url,
    transform: function (body) {
      return cheerio.load(body);
    }
  }

  rp(options)
    .then(($) => {
      const title = $('span#series_title').html()

      const opt = {
        uri: 'https://www.cbsnews.com/search/?q=' + encodeURI(title),
        transform: function (body) {
          return cheerio.load(body);
        }
      }

      rp(opt)
        .then(($) => {
          const resultArr = $('.result-list ul.items li');
          const items = [];

          resultArr.each(function() {
            
            let temp = {
              title: $(this).find('a h3.title').text(),
              href: 'https://www.cbsnews.com' + $(this).find('a').attr('href'),
              thumb: $(this).find('a figure.media-figure img').attr('src'),
              body: $(this).find('div.media-body p.dek ').html(),
              isVideo: $(this).find('.play-video').length > 0
            }

            items.push(temp)
          })

          res.send(JSON.stringify(items))
        })
        .catch((err) => {
          console.log(err)
        })
    })
    .catch((err) => {
      console.log(err);
    });
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('app is running on port 3000');
})