// REQUIRE CLOSEST POLYFILL JAVASCRIPT

// matches polyfill
this.Element && function(ElementPrototype) {
    ElementPrototype.matches = ElementPrototype.matches ||
    ElementPrototype.matchesSelector ||
    ElementPrototype.webkitMatchesSelector ||
    ElementPrototype.msMatchesSelector ||
    function(selector) {
        var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
        while (nodes[++i] && nodes[i] != node);
        return !!nodes[i];
    }
}(Element.prototype);

// closest polyfill
this.Element && function(ElementPrototype) {
    ElementPrototype.closest = ElementPrototype.closest ||
    function(selector) {
        var el = this;
        while (el.matches && !el.matches(selector)) el = el.parentNode;
        return el.matches ? el : null;
    }
}(Element.prototype);



// MEDIA QUERU DEFINITION

APP.mediaQuery = {};
APP.mediaQuery.lg = window.matchMedia('(min-width: 1024px)');


// LET'S DO A STICKY 

APP.sticky = (function () {

	function sticky(el, cssStickClass, cssStuckClass, stickyLimit) {

		var self = this;
		
		self.el = el;
		self.cssStickClass = cssStickClass;
		self.cssStuckClass = cssStuckClass;
		self.parent = self.el.parentNode;

		self.stickyLimit = self.el.closest('.sticky-container')

		self.stickyLimitHeight = self.stickyLimit.offsetHeight;
		self.el.height = self.el.offsetHeight

		var stuckLimit = (self.stickyLimit.offsetHeight - self.el.offsetHeight);

		var isSticked;
		var isStucked;
		var parentFromTop;
		
		var lastScrollY = 0;

    	self.ticking = false;
    	self.raf;

    	self.onScroll = function(){
			lastScrollY = window.scrollY;

		    self.requestTick();
		}

		self.requestTick = function(){

			if(!self.ticking) {

				self.raf = window.requestAnimationFrame(self.scrollHandler);
				self.ticking = true;
			}
		}
		
		this.disable = function(){
			
			window.removeEventListener('scroll',self.onScroll);
			
			self.el.classList.remove(self.cssStickClass);
			self.el.classList.remove(self.cssStuckClass);

		}

		this.enable = function(){
			_init()
		}

		this.updateLimit = function(){
			stuckLimit = (self.stickyLimit.offsetHeight - self.el.offsetHeight);
		}

		this.scrollHandler = function() {

			//console.log('scrollHandler is fired');


			isSticked = self.el.classList.contains(self.cssStickClass);
			isStucked = self.el.classList.contains(self.cssStuckClass);



			parentFromTop = parseInt(self.parent.checkVisibility.fromTop());
			
				// ON STICK

				if(parentFromTop > 0 && parentFromTop < stuckLimit && !isSticked ) {
				
					self.el.classList.add(self.cssStickClass);
				}	

				// ON DESTICK

				if(parentFromTop <= 0 && isSticked ) {
					
					self.el.classList.remove(self.cssStickClass);
				}

				// ON STUCK
			
				if(parentFromTop >= stuckLimit && !isStucked) {
				
					self.el.classList.add(self.cssStuckClass);
				}

				// ON DESTUCK

				if(parentFromTop < stuckLimit && isStucked) {
				
					self.el.classList.remove(self.cssStuckClass);
				}
				
			self.ticking = false;
		}	

		function _init() {
			
			// init visibility detection on parent
			
			if(self.stickyLimit.offsetHeight > self.el.offsetHeight){

				self.parent.checkVisibility = new APP.checkVisibility(self.parent);

				var toto = new APP.checkVisibility(document.querySelector('#test-visible'));
				
				// init handler on ready
				
				self.onScroll();

				window.addEventListener('scroll', self.onScroll);

				window.addEventListener('resize', function() {

					// refresh position

					self.parent.checkVisibility.initSizes()
					
					stuckLimit = (self.stickyLimit.offsetHeight - self.el.offsetHeight);
				})
			}
		}
	
		_init();
	}

	return sticky;

})();


APP.stickyElem = document.querySelector('.js-stickable');
APP.stickyElem.promArr = [];
APP.stickyElem.images = APP.stickyElem.querySelectorAll('img')

// PROMISE API

APP.imgPromise = function(img) {
    return new Promise(function(resolve, reject) {
        img.addEventListener("load", function(e) {
        	// we can do more but keep it simple for the sake of the demo
            resolve(img);
        }, false);
    });
}

// Create array of promises
Array.prototype.forEach.call(APP.stickyElem.images, function(img, i){
	APP.stickyElem.promArr.push(APP.imgPromise(img))
})

// Wait for all promise to be resolved

Promise.all(APP.stickyElem.promArr).then(function(response){
	
	if(APP.mediaQuery.lg.matches && !APP.stickyElem.sticky) {
		// a l'init on instancie sticky si il est null et qu on est dans la bonne MQ
		APP.stickyElem.sticky = new APP.sticky(APP.stickyElem, 'js-sticked', 'js-stuck');
	}

	APP.mediaQuery.lg.addListener(function(e){
		if(e.matches){
			if(!APP.stickyElem.sticky){

				console.log('Match la MQ et sticky non instancié => on init');
				APP.stickyElem.sticky = new APP.sticky(APP.stickyElem, 'js-sticked', 'js-stuck');

			}else {
				console.log("Match la MQ et sticky DEJA instancié => on l'enable");
				APP.stickyElem.sticky.enable();
			}	
		}else{
			console.log("Ne Match pas la MQ et est instancié donc on disable");
			APP.stickyElem.sticky.disable();
		}  
	})
})


// LET'S DO A PERCENTAGE BASED DISPLAY

APP.backToTop = (function () {

	function backToTop(elem, treshold) {

		var self = this;
		var isActive;
		var lastScrollY = 0;
		self.ticking = false;
		self.elem = elem;
		
		self.onScroll = function(){
			lastScrollY = window.scrollY;
			self.requestTick();
		}

		self.requestTick = function(){
			if(!self.ticking) {
				window.requestAnimationFrame(self.toggleDisplay);
				self.ticking = true;
			}
		}

		self.toggleDisplay = function(){
			
			isActive = self.elem.classList.contains('js-back-to-top-active');

			var percentageScrolled = self.elem.checkVisibility.percentageScrolled();

			if(percentageScrolled > treshold && !isActive){
				self.elem.classList.add('js-back-to-top-active')
			}

			if(percentageScrolled < treshold && isActive){
				self.elem.classList.remove('js-back-to-top-active')
			}	

			self.ticking = false;		
		}

		function init() {
			
			self.elem.checkVisibility = new APP.checkVisibility(self.elem);
			
			self.goToTop();
			
			window.addEventListener('scroll', self.onScroll);
		}

		self.goToTop = function() {

			self.elem.addEventListener('click',function() {
				window.scrollTo(0,0);
			});
		}

		init();	
	}
	return backToTop;
})();

// EVENT BINDING

APP.backElem = document.querySelector('.js-back-to-top');

if(APP.backElem){
	//APP.backElem .backToTop = new APP.backToTop(APP.backElem, 50);
}




