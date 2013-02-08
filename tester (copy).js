$(document).ready(function(){

	var tester = {

		orientation: 'portrait',
		iframe: $('#iframe'),
		form: $('#form-url'),
		inputUrl: $('#input-url'),
		clearButton: $('#clear-url'),
		body: $('#controls .body'),
		info: $('#tester-info'),
		url:null,
		width:480,
		height:800,
		visible: localStorage.resp_tester_show,

		init:function(){
			tester.bindEvents();
			if(localStorage.resp_tester_width !== undefined){
				tester.width = localStorage.resp_tester_width;
			}
			if(localStorage.resp_tester_height !== undefined){
				tester.height = localStorage.resp_tester_height;
			}
			tester.changeCanvas();

			// toggle visibility
			if(tester.visible === undefined || tester.visible == 'true'){
				tester.body.show();
				localStorage.setItem('resp_tester_show','true');
			}else{
				tester.body.hide();
			}
		},

		bindEvents: function(){
			tester.form.on('submit',function(e){
				tester.changeURL(e);
			});
			tester.clearButton.on('click',function(){
				tester.clearURL();
			});
			$('.res').on('click',function(e){
				tester.changeCanvas(e);
			});
			$('input[name=orientation]').on('change',function(){
				tester.orientationChange();
			});
			$('#controls .header').on('click',function(){
				if(tester.visible == 'true'){
					localStorage.setItem('resp_tester_show','false');
					tester.visible = 'false';
					tester.body.slideUp();
				}else{
					localStorage.setItem('resp_tester_show','true');
					tester.visible = 'true';
					tester.body.slideDown();
				}
			});
		},

		changeURL: function(e){
			e.preventDefault();
			tester.url = tester.inputUrl.val();
			localStorage.setItem('resp_tester_url',tester.url);
			tester.changeCanvas();
		},

		clearURL: function(){

		},

		changeCanvas: function(e){
			if(e !== undefined){
				var el = $(e.target);
				var p = el.text().split(' x ');
				tester.width = tester.orientation == 'portrait' ? p[0] : p[1];
				tester.height = tester.orientation == 'landscape' ? p[0] : p[1];
				localStorage.setItem('resp_tester_width',tester.width);
				localStorage.setItem('resp_tester_height',tester.height);
				$('#controls button').removeClass('active');
				el.addClass('active');
			}
			tester.url = tester.getUrl();
			if(tester.url === false || tester.url == ''){
				tester.iframe.src = '';
				return false;
			}
			tester.iframe.attr('src','http://'+tester.url);
			tester.iframe.attr('width',tester.width);
			tester.iframe.attr('height',tester.height);
			var text = tester.width + " x " + tester.height;
			tester.info.text(text);
			$(window).scrollTop(0);
			// localStorage.setItem('resp_tester_res',text);
			// return false;
		},

		getUrl: function(){
			var u = localStorage.getItem('resp_tester_url');
			if(u !== ''){
				tester.inputUrl.value = u;
			}
			return u;
		},

		clearUrl: function(){
			tester.inputUrl.val('');
			localStorage.removeItem('responsive_tester_url');
		},

		orientationChange: function(e){
			var orientation = e.target.value;
			// if no change do nothing
			if(tester.orientation == orientation)
				return false;
			if(orientation == 'landscape'){
				var h = iframe.height;
				var w = iframe.width;
				orientGlobal = 'landscape';
			}
			else if(orientation == 'portrait'){
				var h = iframe.height;
				var w = iframe.width;
				tester.orientation = 'portrait';
			}
			tester.iframe.height(w);
			tester.iframe.width(h);
			tester.changeCanvas();
		}

	};

	tester.init();

});