# Checkvisibility

Basically **CheckVisibility** allows to detect vertical positioning of an element in the viewport.
It takes only one param: the DOM elem, you want to track.

Such as:
```
var checkVisibility = new CheckVisibility(elem);
```

## Methods available in the object

 - `checkVisibility.inView(y)`: y is a value between 0 and 1. the method return true if at least "y x 100" (refers to y value) of the element is visible in the viewport.
 - `checkVisibility.fromBottom()`: return the distance of element from the
   bottom of the viewport.
 - `checkVisibility.fromTop()`: return the distance of element from the top
   of the viewport.
 - `checkVisibility.viewportTop()`: return `window.scrollTop()`
 - `checkVisibility.viewportBottom()`: return `window.scrollTop() - this.height()`
 - `checkVisibility.percentageScrolled()`: return the percentage of the page that has been scrolled
 - `checkVisibility.updatePosition()`: useful to call this in order to refresh calculation after a change that impact our element positioning): `window.addEventListener('resize', function(){checkVisibility.updatePosition();});`
 - `checkVisibility.measure()`: to calcul delta and bounds

This lib can be used to creates modles such as: sticky elem, parallax effect or anything that rely on detecting positions.
Check the demo for a sticky elem

Nothing is bind in the function, so it's totally free to use with scroll, resize…

```
var checkElem = new CheckVisibility(document.querySelector('.my-elem'));

window.addEventListener('scroll', function(){
    console.log(checkElem.inView());
});
```




