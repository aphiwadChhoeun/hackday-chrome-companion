
// title sent in request to server
let title = '';

// add listener to grab html and find the series_title
chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.action === "getSource") {

		// set the title
		let h = $.parseHTML( request.source );
		title = $(h).find('#series_title').html();
		
		// original code inside (old) document.ready
		
		let adsMap = [
			{
				img: './images/ads1.jpg',
				href: 'https://www.blackoakcasino.com/'
			},
			{
				img: './images/ads2.jpg',
				href: 'https://www.ikea.com/us/en/'
			},
			{
				img: './images/ads3.jpg',
				href: 'https://www.blackoakcasino.com/'
			}
		];
		
		let articleBox = $('#article');
		let videoBox = $('#video');
		let template = "<ul>{items}</ul>";
		
		let itemTemplate = `
			<li data-href='{href}'>
				<h2>{title}</h2>
				<div>
					<img class="thumb" src='{thumb}'>
					{body}
					<span class='isVideo-{isVideo}'>Video</span>
				</div>
			</li>
		`;
		
		let loader = `
			<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">
				<path opacity="0.2" fill="#fff" d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
				s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
				c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z">
				</path>
				<path fill="#fff" d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0    C22.32,8.481,24.301,9.057,26.013,10.047z" transform="rotate(131.98 20 20)">
					<animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 20 20" to="360 20 20" dur="0.8s" repeatCount="indefinite"></animateTransform>
				</path>
			</svg>
		`;
		
		articleBox.append('<div class="loader">' + loader + '</div>');
		
		chrome.tabs.getSelected(null, function (tab) {
			
			let localKey = tab.title;
			
			chrome.storage.local.get([localKey], function(result) {
				
				if(typeof result[localKey] === 'undefined') {
					
					let prodHost = 'https://cbs-companion-server.herokuapp.com';
					let devHost = 'http://localhost:3000';
					let apiHost = tab.url.indexOf('www.cbs.com') !== -1 ? prodHost : devHost;
					
					let data = {
						title: title,
							url: tab.url,
							provider: 'cbsnews'
					};
					
					$.ajax({
						url: apiHost,
						type: 'POST',
						data: data
					}).done(function(data){
						
						chrome.storage.local.set({
							[localKey]: data
						}, function() {
							renderResult(data);
						});
						
					});
					
				} else {
					renderResult(result[localKey]);
				}
				
			});
			
			// REMOVE THIS LATER PLZZZZ
			$('#btnPurge').click(function() {
				chrome.storage.local.clear();
			});
			
			// tabs switching
			$('.tabs li a').click(function() {
				$('.content').hide();
				$('.tabs li').removeClass('active');
				$(this).parent('li').addClass('active');
				$('#' + $(this).data('target')).fadeIn('fast');
			});
			
		});
		
		let getAds = function() {
			let rnd = Math.floor(Math.random() * 3);
			return adsMap[rnd];
		}
		
		let renderAds = function() {
			let ad = getAds();
			
			return `
			<li data-href="${ad.href}">
				<div class="ads">
					<img src="${ad.img}"/>
				</div>
			</li>
		`;
		}
		
		let renderArticles = function(articles) {
			
			let itemsHtml = '';
			let tpl = template;
			
			articles.forEach((item, idx) => {
				
				let li = itemTemplate;
				li = li.replace(/{href}/g, item.href);
				li = li.replace(/{title}/g, item.title);
				li = li.replace(/{thumb}/g, item.thumb);
				li = li.replace(/{body}/g, item.body);
				li = li.replace(/{isVideo}/g, item.isVideo);
				
				itemsHtml += li;
				
				if((idx+1) % 3 === 0) {
					itemsHtml += renderAds();
				}
				
			});
			
			tpl = tpl.replace(/{items}/g, itemsHtml);
			
			articleBox.html(tpl);
			
			articleBox.find('li').click(function(){
				window.open($(this).data('href'));
			});
		};
		
		let renderVideos = function(videos) {
			
			let itemsHtml = '';
			let tpl = template;
			
			videos.forEach((item, idx) => {
				
				let li = itemTemplate;
				li = li.replace(/{href}/g, item.href);
				li = li.replace(/{title}/g, item.title);
				li = li.replace(/{thumb}/g, item.thumb);
				li = li.replace(/{body}/g, item.body);
				li = li.replace(/{isVideo}/g, item.isVideo);
				
				itemsHtml += li;
				
				if((idx+1) % 3 === 0) {
					itemsHtml += renderAds();
				}
				
			});
			
			tpl = tpl.replace(/{items}/g, itemsHtml);
			
			videoBox.html(tpl);
			
			videoBox.find('li').click(function(){
				window.open($(this).data('href'));
			});
		};
		
		let renderResult = function(data) {
			renderArticles(data.articles);
			renderVideos(data.videos);
		};

	}
});

// window onload function to help grab the tab's html
function onWindowLoad() {
	chrome.tabs.executeScript(null, {
		file: "getPagesSource.js"
	}, function() {
		// If you try and inject into an extensions page or the webstore/NTP you'll get an error
		// if (chrome.runtime.lastError) {
			// message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
		// }
	});
}

// popup.html ready, go do shit
window.onload = onWindowLoad;