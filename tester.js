(function(){
	// variables declaration
	var orientGlobal = 'portrait';
	var iframe = document.getElementById('iframe');
	var form = document.getElementById('form-url');
	var inputUrl= document.getElementById('input-url');
	var clearButton = document.getElementById('clear-url');
	var url;

	// init
	form.addEventListener('submit',changeURL,false);
	clearButton.addEventListener('click',clearUrl,false);
	var buttons = document.getElementById('controls').childNodes;
	for(var i in buttons){
		var inp = buttons[i];
		if(inp.nodeName == 'A'){
			inp.addEventListener('click',hidePanel,false);
		}
		if(inp.nodeName == 'BUTTON'){
			inp.addEventListener('click',changeCanvas,false);
		}
		if(inp.nodeName == 'INPUT'){
			inp.addEventListener('click',orientationChange,false);
		}
	}
	changeCanvas();

	// functions
	function changeURL(e){
		e.preventDefault();
		url = inputUrl.value;
		localStorage.setItem('responsive_tester_url',url);
		changeCanvas();
	}

	function hidePanel(e){
		e.preventDefault();
		document.querySelector('#controls').style.display = 'none';
	}

	// change site orientation
	function orientationChange(e){
		var orientation = e.target.value;
		// if no change do nothing
		if(orientGlobal == orientation)
			return false;
		if(orientation == 'landscape'){
			var h = iframe.height;
			var w = iframe.width;
			orientGlobal = 'landscape';
		}
		else if(orientation == 'portrait'){
			var h = iframe.height;
			var w = iframe.width;
			orientGlobal = 'portrait';
		}
		iframe.height = w;
		iframe.width = h;
		changeCanvas();
	}
	
	// changes dimensions and orientation of site canvas
	function changeCanvas(e){
		if(e !== undefined){
			var el = e.target;
			if(el.id == 'refresh-canvas'){

			}else{
				var p = el.innerHTML.split(' x ');
				var w = orientGlobal == 'portrait' ? p[0] : p[1];
				var h = orientGlobal == 'landscape' ? p[0] : p[1];
				iframe.width = w;
				iframe.height = h;
			}
		}
		url = getUrl();
		if(url === false || url == ''){
			iframe.src = '';
			return false;
		}
		// dla ats_mobile
		// iframe.src = 'http://'+url;
		iframe.src = 'http://baniowski.local';
		// iframe.src = 'http://jquerymobile.com/test/docs/toolbars/docs-bars.html';
		// iframe.src = 'https://dev.atsys.pl/mobile/index.html';
		return false;
	}

	function getUrl(){
		// check local storage
		var u = localStorage.getItem('responsive_tester_url');
		if(u !== ''){
			inputUrl.value = u;
		}
		return u;
	}

	function clearUrl(){
		inputUrl.value = '';
		localStorage.removeItem('responsive_tester_url');
	}

})();