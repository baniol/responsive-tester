class Tester

	constructor: ->
		@orientation = "portrait"
		@iframe = $("#iframe")
		@form = $("#form-url")
		@inputUrl = $("#input-url")
		@body = $("#controls .body")
		@info = $("#tester-info")
		@ctrlHeader = $("#controls .header span")
		@url = ""
		@width = 480
		@height = 800
		@visible = localStorage.resp_tester_show
		@initResArray = JSON.stringify ['320x480','480x800','640x960','720x1280']
		@resArray = []
		@addResInputs = $("#add-res-inputs")

	init: ->
		if localStorage.resp_tester_width isnt undefined
			@width = localStorage.resp_tester_width
		else
			localStorage.setItem "resp_tester_width", @width

		if localStorage.resp_tester_height isnt undefined
			@height = localStorage.resp_tester_height
		else
			localStorage.setItem "resp_tester_height", @height

		if localStorage.resp_tester_orient isnt undefined
			@orientation = localStorage.resp_tester_orient
		else
			localStorage.setItem "resp_tester_orient", @orientation

		if localStorage.resp_tester_resarray isnt undefined
			@resArray = localStorage.resp_tester_resarray
		else
			localStorage.setItem "resp_tester_resarray", @initResArray
			@resArray = @initResArray

		@makeResButtons()

		@changeCanvas()

		# check orientation radio button
		$("##{@orientation}").attr "checked","checked"

		# toggle visibility
		if @visible is undefined or @visible is 'true'
			@body.show();
			localStorage.setItem 'resp_tester_show', 'true'
			@ctrlHeader.text("hide")
		else
			@body.hide()
			@ctrlHeader.text("show")

		@bindEvents()

		# read uri string
		@readUri()

	bindEvents: ->
		@form.on "submit", (e) =>
			e.preventDefault()
			@changeURL(e)

		# show form for adding a new resolution 
		$("#add-resolution").on "click", =>
			$("#res_x").val("")
			$("#res_y").val("")
			@addResInputs.show()

		# restore initial tester data
		$("#reset-tester").on "click", =>
			localStorage.clear()
			window.location.href = window.location.href

		# submit a new resolution
		$("#add-res-inputs button").on "click", =>
			rx = parseInt $("#res_x").val(), 10
			ry = parseInt $("#res_y").val(), 10
			if isNaN(rx) or isNaN(ry)
				alert "Insert number data"
				return false
			newR = rx+"x"+ry
			_resArr = JSON.parse @resArray
			_resArr.push(newR)
			@resArray = JSON.stringify _resArr
			localStorage.setItem "resp_tester_resarray", @resArray
			@addResInputs.hide()
			@makeResButtons()

		$("input[name=orientation]").on "change", (e) =>
			@orientationChange(e)

		@ctrlHeader.on "click", =>
			if @visible is "true"
				localStorage.setItem "resp_tester_show", "false"
				@visible = "false"
				@body.slideUp()
				@ctrlHeader.text("show")
			else
				localStorage.setItem "resp_tester_show", "true"
				@visible = "true"
				@body.slideDown()
				@ctrlHeader.text("hide")

	# populate resolution buttons
	makeResButtons: ->
		_self = this
		buttonsArray = []
		_resArr = JSON.parse @resArray
		for r in _resArr
			resPart = r.split('x')
			resPos = '<div class="res-row"><button class="res btn">'+resPart[0] + " x " + resPart[1]+'</button><i class="del icon-remove-sign"></i></div>'
			buttonsArray.push resPos
		$("#resolutions").html buttonsArray

		# add event listener to res buttons
		$(".res").off "click"
		$(".res").on "click", (e) =>
			@changeCanvas(e)

		# add event listener for deleting res buttons
		$("#resolutions .res-row .del").off "click"
		$("#resolutions .res-row .del").on "click", ->
			_row = $(this).parent()
			_self.removeResolution(_row.find('.res').text())
			_row.remove()

	removeResolution: (res) ->
		res = res.replace " ",""
		res = res.replace " ",""
		_resArray = JSON.parse @resArray
		_ress = _resArray.filter (x) -> x isnt res
		localStorage.setItem "resp_tester_resarray", JSON.stringify _ress
		@resArray = JSON.stringify _ress

	clearURL: ->
		@inputUrl.val ""
		localStorage.removeItem 'responsive_tester_url'

	changeCanvas: (e) ->
		if e isnt undefined
			el = $(e.target)
			p = el.text().split(" x ")
			@width = if @orientation is "portrait" then p[0] else p[1]
			@height = if @orientation is "landscape" then p[0] else p[1]
			localStorage.setItem "resp_tester_width", @width
			localStorage.setItem "resp_tester_height", @height

		@url = @getUrl()
		@inputUrl.val(@url)
		if @url is "" or @url is null
			@iframe.src = "";
			return false

		protocol = @url.match /(http|https):\/\//
		if protocol isnt null 
			address = @url
		else
			address = "http://" + @url


		# set iframe parameters (url, dimensions)
		@iframe.attr "src", address
		@iframe.attr "width", @width
		@iframe.attr "height", @height

		# set dimensions string in the header
		text = @width + " x " + @height
		@info.text text

		$(window).scrollTop 0

	changeURL: () ->
		@url = @inputUrl.val();
		localStorage.setItem "resp_tester_url", @url
		@changeCanvas()
				
	getUrl: ->
		u = localStorage.getItem "resp_tester_url"
		if u isnt ""
			@inputUrl.value = u
		u

	orientationChange: (e) ->
		orientation = e.target.value

		# if no change do nothing
		if @orientation is orientation
			return false

		if orientation is "landscape"
			w = @iframe.width()
			h = @iframe.height()
			@orientation = "landscape"
		else if orientation is "portrait"
			h = @iframe.height()
			w = @iframe.width()
			@orientation = "portrait"

		localStorage.setItem "resp_tester_orient", @orientation

		@width = h
		@height = w
		localStorage.setItem "resp_tester_height", w
		localStorage.setItem "resp_tester_width", h

		@changeCanvas();

	readUri: ->
		url = @getUriParam("url")
		res = @getUriParam("res")
		if url isnt ""
			@inputUrl.val(url)
			if res isnt ""
				p = res.split "x"
				@width = p[0]
				@height = p[1]

			@changeURL()

	getUriParam: (param) ->
		param = param.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]")
		regexS = "[\\?&]" + param + "=([^&#]*)"
		regex = new RegExp(regexS)
		results = regex.exec(window.location.search)
		if results is null then "" else decodeURIComponent(results[1].replace(/\+/g, " "))

test = new Tester
test.init()