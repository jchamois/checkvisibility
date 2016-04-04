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
		var rect;
		var elemHeight;
		var elemWidth;
		var docHeight;
		var bounds = {};
		var deltas = {};
		var scrollY;
		var scrollX;
		var offsetTop;

		self.elem = elem;
		//self.x = x || 0;
		self.y = y || 0;

		function _getAttr(elem){

			elemHeight =  self.elem.offsetHeight;
			elemWidth =  self.elem.offsetWidth;
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
			//rect = self.elem.getBoundingClientRect();

			//  Here it is, i calculate the same vaue with already retrieve val
			rectTop = elemOffsetTop - scrollY


			bounds = {
				top :  rectTop + scrollY - docClientTop
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

			deltas = {
				top : Math.min( 1, (  bounds.bottom - viewport.top ) / elemHeight),
				bottom : Math.min(1, ( viewport.bottom -  bounds.top ) / elemHeight),
				//left : Math.min(1, (  bounds.right - viewport.left ) / elemWidth),
				//right : Math.min(1, ( viewport.right -  bounds.left ) / elemWidth)
			};

		}

		this.inView = function(){

			self.is(self.elem, self.y)
			//return (deltas.left * deltas.right) > self.x && (deltas.top * deltas.bottom) > self.y
			return (deltas.top * deltas.bottom) > self.y
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

/* INIT with request animation frame */

var reqAnimFr = window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.msRequestAnimationFrame ||
window.oRequestAnimationFrame;


window.addEventListener('load', function(){

	var elems = document.querySelectorAll('.js-check-visibility');

	[].forEach.call(elems, function(elem) {
		// attach instance au node
	 	elem.checkVisibility = new APP.checkVisibility(elem,0,0)
	});

	if(reqAnimFr){
		loop()
	}

	var lastScrollTop = window.scrollY;

	function loop() { // 48fps

		var scrollTop = window.scrollY;

		if (lastScrollTop === scrollTop) {

			reqAnimFr(loop);

			return;

		} else {
			console.log("ELSE=", scrollTop)
			lastScrollTop = scrollTop;


			[].forEach.call(elems, function(elem) {

				var hasInviewClass = elem.classList.contains('in-view')
				var elemInview = elem.checkVisibility.inView()

				if(elemInview && !hasInviewClass){
					elem.classList.add( 'in-view' );
				}

				if(!elemInview && hasInviewClass){
					elem.classList.remove( 'in-view' );
				}
			});

			reqAnimFr(loop);
		}
	}
})





// hasClass = function( elem, c ) {
//     return elem.classList.contains( c );
//   };
//   addClass = function( elem, c ) {
//     elem.classList.add( c );
//   };
//   removeClass = function( elem, c ) {
//     elem.classList.remove( c );
//   };
