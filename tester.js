(function(){
	// variables declaration
	var orientGlobal = 'portrait';
	var iframe = document.getElementById('iframe');
	var form = document.getElementById('form-url');
	var inputUrl= document.getElementById('input-url');
	var clearButton = document.getElementById('clear-url');
	var url;

	// init
	form.addEventListener('submit',submitUrl,false);
	clearButton.addEventListener('click',clearUrl,false);
	var buttons = document.getElementById('controls').childNodes;
	for(var i in buttons){
		var inp = buttons[i];
		if(inp.nodeName == 'BUTTON'){
			inp.addEventListener('click',changeCanvas,false);
		}
		if(inp.nodeName == 'INPUT'){
			inp.addEventListener('click',orientationChange,false);
		}
	}
	changeCanvas();

	// functions
	function submitUrl(e){
		e.preventDefault();
		url = inputUrl.value;
		localStorage.setItem('responsive_tester_url',url);
		changeCanvas();
	}

	function orientationChange(e){
		var orientation = e.target.value;
		// if no change do nothing
		if(orientGlobal == orientation)
			return false;
		if(orientation == 'landscape'){
			var h = iframe.height;
			var w = iframe.width;
			iframe.height = w;
			iframe.width = h;
			orientGlobal = 'landscape';
		}
		else if(orientation == 'portrait'){
			var h = iframe.height;
			var w = iframe.width;
			iframe.height = w;
			iframe.width = h;
			orientGlobal = 'portrait';
		}
		changeCanvas();
	}
	
	function changeCanvas(e){
		if(e !== undefined){
			var el = e.target;
			if(el.id == 'refresh-canvas'){

			}else{
				var p = el.innerHTML.split(' x ');
				iframe.width = p[0];
				iframe.height = p[1];
			}
		}
		url = getUrl();
		if(url === false)
			return false;
		iframe.src = 'http://'+url;
		return false;
	}

	function getUrl(){
		if(url === undefined){
			// check local storage
			var urlLS = localStorage.getItem('responsive_tester_url');
			if(urlLS === null){
				return false
			}
			else{
				inputUrl.value = urlLS;
				return urlLS;
			}
				
		}else{
			return url;
		}
	}

	function clearUrl(){
		inputUrl.value = '';
		localStorage.removeItem('responsive_tester_url');
	}

})();