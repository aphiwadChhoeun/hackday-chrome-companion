const express = require('express')
const rp = require('request-promise')
const cheerio = require('cheerio')
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('*', (req, res) => {
  
  let scrubHost = 'https://www.cbsnews.com/search/?q=' + encodeURI(req.body.title);
  
  if(req.body.provider === 'cbsnews'){
  
  }
  
  let options = {
    uri: scrubHost,
      transform: function(body){
        return cheerio.load(body);
      }
  };
  
  rp(options).then( ($) => {
   
	  const resultArr = $('.result-list ul.items li');
	  
	  const resp = {
	  	articles: [],
	  	videos: []
	  };
	
	  resultArr.each(function() {
		
		  let isVideo = $(this).find('.play-video').length > 0;
	  	
		  let temp = {
			  title: $(this).find('a h3.title').text(),
			  href: 'https://www.cbsnews.com' + $(this).find('a').attr('href'),
			  thumb: $(this).find('a figure.media-figure img').attr('src'),
			  body: $(this).find('div.media-body p.dek ').html(),
			  isVideo: isVideo
		  };
		
		  if(isVideo){
		  	resp.videos.push(temp);
		  }else{
		  	resp.articles.push(temp);
		  }
		  
	  });
	  
	  res.json(resp);
	  
  }).catch((err) => {
  	
  	res.json({
		error: err
	});
  
  });

});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('app is running on port 3000');
});