# sort - jQuery plugin
---

Generic sorter for jQuery collections

## Options

 * ```sortSelector``` -> Selector to pick the elements that will be sorted - default ```'> *'``` (first level childs) 
 * ```compareSelector``` -> Selector to pick the sub-element that contains the comparable value (if empty, points to the own element) - default: ```''``` (an empty string)
 * ```mirrorElement``` -> Selector to pick some element that needs to receive the same attributes than the holder element - default: ```''```
 * ```includeNaturalOrder``` -> The first click organizes elements in ascendant direction, the second click inverts to descendant order. If ```includeNaturalOrder``` is ```true```, the third click returns the collection to it's natural order - default: ```false```
 * ```compareFunction``` -> Function to be sent to Array.sort as compare function - default: ```$.sort.orderingFunction```
 * ```filterValue``` -> Function to manipulate the comparison value, extracted from DOM element - default: ```null```
 * ```filterCollection``` -> Function to filter the collection after it is sorted - default: ```null```

## Sample code
In this example we have two links to sort the ```LI``` elements inside the list (```UL```). The first sorts it based on text in elements. 

The second will sort based on content of ```SPAN``` tags (that contains the first name), because we sent the option ```compareSelector``` in configuration object.

The ```mirrorElement``` is used only to allow CSS to change the links appearence (arrows up / down)

Javascript
```javascript
$(function(){
	$('.names .sort').click(function(e) {
		$('.names ul').sort({mirrorElement: '.names'});
	});
	$('.names .sort-by-first-name').click(function(e) {
		$('.names ul').sort({mirrorElement: '.names', compareSelector: 'span'});
	});
});
```

CSS
```css
  .names[data-sort-selector=""][data-sort-order="desc"] a:nth-child(2),
  .names[data-sort-selector="span"][data-sort-order="desc"] a:nth-child(3) {
    background-image: url(img/bg-down.png);
  }
  
  .names[data-sort-selector=""][data-sort-order="asc"] a:nth-child(2),
  .names[data-sort-selector="span"][data-sort-order="asc"] a:nth-child(3) {
    background-image: url(img/bg-up.png);
  }
```
HTML
```html
<div class="names">
	<ul>
		<li>Page, <span>Jimmy</span></li>
		<li>Plant, <span>Robert</span></li>
		<li>Jones, <span>John Paul</span></li>
		<li>Bonham, <span>John</span></li>
	</ul>
	<a href="javascript://" class="sort">sort</a> |
	<a href="javascript://" class="sort-by-first-name">sort by first name</a>
</div>
```

