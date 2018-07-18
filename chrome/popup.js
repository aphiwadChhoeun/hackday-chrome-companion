$(document).ready(() => {
	
	let message = $('#message');
	let template = "<ul>{items}</ul>";

	let itemTemplate = `
		<li data-href='{href}'>
			<h2>{title}</h2>
			<div>
				<img src='{thumb}'>
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
	
	message.append('<div class="loader">' + loader + '</div>');

	chrome.tabs.getSelected(null, function (tab) {
	
		let localKey = tab.url;
		let tabTitle = tab.title;
		let titleStart = 6;
		let titleEnd = tabTitle.indexOf('Season');
		let title = tabTitle.substring(titleStart,titleEnd);

		chrome.storage.local.get([localKey], function(result) {

			if(typeof result[localKey] === 'undefined') {
				
				//
				// http://localhost:3000
				let prodHost = 'https://cbs-companion-server.herokuapp.com';
				let devHost = 'http://localhost:3000';
				let apiHost = document.location.href.indexOf('www.cbs.com') !== -1 ? prodHost : devHost;
				
				$.ajax({
					url: apiHost,
					type: 'POST',
					data: {
						title: title,
						url: tab.url,
						provider: 'cbsnews'
					}
				}).done(function(data){
					renderResult(data);
				});
				
			} else {
				renderResult(result[localKey]);
			}
			
		});
		
		$('#btnPurge').click(function() {
			chrome.storage.local.clear();
		});
		
	});

	let renderResult = function(data) {
		let itemsHtml = '';
		let tpl = template;
		let items = data;
		
		items.forEach((item, idx) => {
			
			let li = itemTemplate;
			li = li.replace(/{href}/g, item.href);
			li = li.replace(/{title}/g, item.title);
			li = li.replace(/{thumb}/g, item.thumb);
			li = li.replace(/{body}/g, item.body);
			li = li.replace(/{isVideo}/g, item.isVideo);
		
			itemsHtml += li;
		
		});
		
		tpl = tpl.replace(/{items}/g, itemsHtml);
		
		message.html(tpl)
			.css('display', 'none')
			.fadeIn('fast');
	
		message.find('li').click(function(){
			window.open($(this).data('href'));
		});
	}

});