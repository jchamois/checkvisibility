(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node, CommonJS-like
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {

	return (function(window, document, exportName) {

		var doc = document.documentElement;
		var docBody = document.body;

		var scrollY;
		var scrollX;

		var winHeight;
		var winWidth;

		var docHeight;

		var viewport = {};

		var trackLength;

		/** @constructor
		 *
	     * @param {element} elem - DOM element.
	     */
		var CheckVisibility  = function (elem) {
			this.elem = elem;

			this.bounds = {};
			this.deltas = {};

			// init
			this.updatePosition();
		};

		/** @function
		 * Measure position of viewport
		 */
		CheckVisibility.prototype.updatePosition = function updatePosition() {
			docHeight = Math.max(docBody.offsetHeight, doc.scrollHeight);
			winHeight = Math.max(window.innerHeight, doc.clientHeight);
			winWidth = Math.max(window.innerWidth, doc.clientWidth);
		};

		/** @function
		 * Measure bounds and delta of element
		 *
		 * @param {Number} y - >0 and <1
		 */
		CheckVisibility.prototype.measure = function measure(y) {
			var elemHeight = this.elem.offsetHeight;
			var elemWidth = this.elem.offsetWidth;
			var rect = this.elem.getBoundingClientRect(); // getBoundingClientRect CAUSES MAJOR REPAINT == fallback needed but no solution yet

			scrollY = window.pageYOffset; // IE 10 + purpose
			//scrollX = window.pageXOffset;

			viewport = {};

			viewport.top = scrollY;

			//viewport.right = viewport.left + winWidth;
			viewport.bottom = viewport.top + winHeight;

			this.bounds = {
				top :  rect.top + scrollY
				//left :  rect.left + scrollX
			};

			//bounds.right = bounds.left + elemWidth;
			this.bounds.bottom = this.bounds.top + elemHeight;

			if (y !== undefined) {
				this.deltas = {
					top : Math.min(1, (this.bounds.bottom - viewport.top) / elemHeight),
					bottom : Math.min(1, (viewport.bottom -  this.bounds.top) / elemHeight)
				};
			}
		};

		CheckVisibility.prototype.percentageScrolled = function percentageScrolled() {
			trackLength = docHeight - winHeight;

			return Math.floor(window.scrollY / trackLength * 100);
		};

		/** @function
		 * check if element is inView
		 *
		 * @param {Number} y - >0 and <1
		 * @return {Boolean}
		 */
		CheckVisibility.prototype.inView = function inView(y) {
			y = y || 0;

			this.measure(y);

			return (this.deltas.top * this.deltas.bottom) >= y; // true if elem is y x 100 % visible
		};

		/** @function
		 *
		 * @return {Number}
		 */
		CheckVisibility.prototype.fromBottom = function fromBottom() {
			this.measure();

			return viewport.bottom - this.bounds.bottom; // distance from bottom window
		};

		/** @function
		 *
		 * @return {Number}
		 */
		CheckVisibility.prototype.fromTop = function fromTop() {
			this.measure();

			return viewport.top - this.bounds.top; // distance from top window
		};

		/** @function
		 *
		 * @return {Number}
		 */
		CheckVisibility.prototype.viewportTop = function viewportTop() {
			this.measure();

			return viewport.top; // Same as scrollY
		};

		/** @function
		 *
		 * @return {Number}
		 */
		CheckVisibility.prototype.viewportBottom = function viewportBottom() {
			this.measure();

			return viewport.bottom; // distance from bottom scroll
		};

		/** @function
		 *
		 * @return {Boolean}
		 */
		CheckVisibility.prototype.bottomOfWindow = function bottomOfWindow() {
			this.measure();

			return (viewport.top + winHeight) >= (docHeight); // return true if window scrolled to bottom
		};

		return CheckVisibility;

	})(window, document, 'CheckVisibility');

}));
