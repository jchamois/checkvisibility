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
		var docClientTop

		self.elem = elem;

		self.y = y || 0;

		function _getAttr(elem){

			elemHeight = self.elem.offsetHeight;
			elemWidth = self.elem.offsetWidth;
			elemOffsetTop = self.elem.offsetTop

			docHeight = Math.max(docBody.offsetHeight, doc.scrollHeight);
			winHeight = Math.max(win.innerHeight, doc.clientHeight)
			winWidth = Math.max(win.innerWidth, doc.clientWidth)
			docClientTop = doc.clientTop;
		}

		this.is = function(){

			scrollY = win.scrollY;
			scrollX = win.scrollX;
			// getBoundingClientRect CAUSES MAJOR REPAINT == fallback needed
			rect = self.elem.getBoundingClientRect();

			bounds = {
				top :  rect.top + scrollY - docClientTop
				//left :  rect.left + scrollX - doc.clientLeft
			}

			//bounds.right = bounds.left + elemWidth;
			bounds.bottom = bounds.top + elemHeight;

			var viewport = {
				top : scrollY,
				//left : scrollX
			};

			//viewport.right = viewport.left + winWidth;
			viewport.bottom = viewport.top + winHeight;
			console.log(bounds.bottom, viewport.top, elemHeight)

			deltas = {
				top : Math.min( 1, (  bounds.bottom - viewport.top ) / elemHeight),
				bottom : Math.min(1, ( viewport.bottom -  bounds.top ) / elemHeight),
			};

		}

		this.inView = function(){
			self.is(self.elem, self.y)
			
			return deltas.top * deltas.bottom > self.y
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

		function _init(){
			_getAttr()
		}

		_init()
	}

	return checkVisibility

})(window)
