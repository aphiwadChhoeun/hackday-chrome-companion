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
      console.log(title)
      res.send(title)
    })
    .catch((err) => {
      console.log(err);
    });
})

const listener = app.listen(3000, () => {
  console.log('app is running on port 3000')
})