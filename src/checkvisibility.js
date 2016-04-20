var APP = APP || {}

APP.checkVisibility = (function(window){

	function checkVisibility(elem,y){

		var self = this;
		var deltas = {};
		var bounds = {};

		var win = window;
		var doc = document.documentElement;
		var docBody = document.body;

		var winHeight;
		var winWidth;
		var rect;
		var elemHeight;
		var elemWidth;
		var docHeight;
		var bounds = {};
		var deltas = {};
		var scrollY;
		var scrollX;
		var rectTop;
		var offsetTop;
		var elemOffsetTop
		//var docClientTop

		self.elem = elem;
		self.y = y || 0;

		this.initSizes= function(){

			elemHeight = self.elem.offsetHeight + parseFloat(window.getComputedStyle(self.elem)["margin-top"]) + parseFloat(window.getComputedStyle(self.elem)["margin-bottom"]);
			elemWidth = self.elem.offsetWidth;
			elemOffsetTop = self.elem.offsetTop

			docHeight = Math.max(docBody.offsetHeight, doc.scrollHeight);
			winHeight = Math.max(win.innerHeight, doc.clientHeight)
			winWidth = Math.max(win.innerWidth, doc.clientWidth)
			//docClientTop = doc.clientTop;
		}

		this.is = function(){

			scrollY = win.scrollY;
			scrollX = win.scrollX;

			// getBoundingClientRect CAUSES MAJOR REPAINT == fallback needed

			rect = self.elem.getBoundingClientRect();

			var viewport = {
				top : scrollY,
				//left : scrollX
			};

			//viewport.right = viewport.left + winWidth;
			viewport.bottom = viewport.top + winHeight;

			bounds = {
				top :  rect.top + scrollY
				//left :  rect.left + scrollX
			}

			//bounds.right = bounds.left + elemWidth;
			bounds.bottom = bounds.top + elemHeight;

			deltas = {
				top : Math.min( 1, (  bounds.bottom - viewport.top ) / elemHeight),
				bottom : Math.min(1, ( viewport.bottom -  bounds.top ) / elemHeight),
			};
		}

		this.inView = function(){
			self.is(self.elem, self.y)
			return deltas.top * deltas.bottom >= self.y
		}

		this.fromBottom = function(){
			self.is(self.elem, self.y)
			return viewport.bottom - bounds.bottom
		}

		this.fromTop = function(){
			self.is(self.elem, self.y)
			return viewport.top - bounds.top
		}

		this.viewportTop = function(){
			self.is(self.elem, self.y)
			return viewport.top
		}

		this.viewportBottom = function(){
			self.is(self.elem, self.y)
			return viewport.bottom
		}

		this.bottomOfWindow = function(){
			self.is(self.elem, self.y)
			return (viewport.top + winHeight) >= (docHeight)
		}

		function _init(){self.initSizes()}

		_init()
	}

	return checkVisibility

})(window)

/* INIT with request animation frame */

var reqAnimFr = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame;

	var elems = document.querySelectorAll('.js-check-visibility ');

	[].forEach.call(elems, function(elem) {

		// attach instance au node
		elem.checkVisibility = new APP.checkVisibility(elem,0.8)


		window.addEventListener('resize', function(){
			// Improve this
			// recalculate height and position
			elem.checkVisibility.initSizes()
		})
	});

	if(reqAnimFr){
		loop()
	}

	var lastScrollTop = window.scrollY;

	function loop() {

		var scrollTop = window.scrollY;

		if (lastScrollTop === scrollTop) {

			reqAnimFr(loop);

			return;

		} else {

			lastScrollTop = scrollTop;

			[].forEach.call(elems, function(elem) {

				if(elem.checkVisibility.inView()){
					if(!elem.classList.contains('in-view')){
						elem.classList.add('in-view')
					}

				}else{
					if(elem.classList.contains('in-view')){
						elem.classList.remove('in-view')
					}

				}
			});

			reqAnimFr(loop);
		}
	}


