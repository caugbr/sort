/**
 * jQuery.sort 
 * -----------
 * Generic sorter for jQuery collections
 * -----------
 * Cau Guanabara
 * 08/2012
 * -----------
 * update 05/2014
 */

/*
	Configuration object parameters
	-------------------------------
		sortSelector:        Selector to pick the elements that will be sorted - default '> *' (first level childs)
		compareSelector:     Selector to pick the sub-element that contains the comparable value (if empty, points to the own element) - default: ''
		mirrorElement:       Selector to pick the element that will receive the same attributes than the holder element - default: ''
		includeNaturalOrder: The first click organizes elements in ascendant direction, the second click inverts to descendant order.
		                     If includeNaturalOrder is TRUE, the third click returns the collection to it's natural order - default: FALSE
		compareFunction:     Function to be sent to Array.sort as compare function - default: NULL
		filterValue:         Function to manipulate the comparison value, extracted from DOM element - default: NULL
		filterCollection:    Function to filter the collection after it is sorted - default: NULL

	
	Filtering the extracted values
	--------------------------------------
	  The native function that catches the comparison value in DOM element can return one of the following, respecting the precedence order below:
			1. the 'data-sort-value' attribute, if exists
			2. the innerHTML of the element as text, if there are non-numeric characters, or as a number, if there are only numeric characters - maybe preceeded of '#' 
			3. the 'title' attribute, if there are no text content
			4. the 'title' attribute of an image, if there are no text content
			5. the 'alt' attribute of an image, if there are no text content in element nor 'title' attribute in this image
			6. an empty string
		This value is sent to filterValue function in the first param and the element can be accessed through the 'this' variable, as a jQuery instance.
		Your comparison function must return a value as string or number
*/
  
(function($) {
  
  $.sort = {};
	
  $.fn.sort = function(o) {
    $.sort.options = $.extend({
      sortSelector: '> *',
      compareSelector: '',
			mirrorElement: '',
			includeNaturalOrder: false,
			compareFunction: null,
			filterValue: null,
			filterCollection: null,
			filterElement: null
    }, o || {});
		
		$.sort.getValue = function(e) {
			var elem = $.sort.options.compareSelector ? $(e).find($.sort.options.compareSelector).eq(0) : $(e), 
			    text = $.trim(elem.attr('data-sort-value') || elem.text()), 
					ret = text;
			
			if(/^#?(\-?[\.\d]+)$/.test(text)) ret = Number(RegExp.$1);
			if(/^\s*$/.test(text)) {
				var title = elem.attr('title');
				if(title) {
					ret = title;
				} else if(elem.has('img') === true) {
					var img = elem.find('img').get(0);
					ret = img.title || img.alt || '';
				}
			}

			if(typeof $.sort.options.filterValue == 'function') {
				return $.sort.options.filterValue.call(e, ret);
			}
			return ret; 
		};
		
		$.sort.orderingFunction = function(a, b) {
			var va = $.sort.getValue(a), vb = $.sort.getValue(b);
			if(typeof(va) == 'number' && typeof(vb) == 'number') return va - vb;
			return String(va).localeCompare(String(vb));
		};
    
    var els = $.makeArray($(this).find($.sort.options.sortSelector)),
        sorted = $(this).attr('data-sort-selector'),
				order = $(this).attr('data-sort-order') || 'natural';

		if($.sort.options.includeNaturalOrder) {
			if($(els[0]).attr('data-index') === undefined) {
				$.each(els, function(index, element) {
					$(element).attr('data-index', index);
				});
			}
			
			$.sort.naturalOrderingFunction = function(a, b) {
				return Number($(a).attr('data-index')) - Number($(b).attr('data-index'));
			};
		}
		
    if(sorted == $.sort.options.compareSelector) {
			switch(order) {
				case 'asc':
					els = els.reverse();
					order = 'desc';
					break;
				case 'desc':
					if($.sort.options.includeNaturalOrder) {
						els = els.sort($.sort.naturalOrderingFunction);
						order = 'natural';
						break;
					}
				default:
					els = els.sort(typeof $.sort.options.compareFunction == 'function' ? $.sort.options.compareFunction : $.sort.orderingFunction);
					order = 'asc';
			}
		} else {
			els = els.sort(typeof $.sort.options.compareFunction == 'function' ? $.sort.options.compareFunction : $.sort.orderingFunction);
			order = 'asc';
		}
		
		var cfg = {'data-sort-selector': $.sort.options.compareSelector, 'data-sort-order': order};
    $(this).attr(cfg);
		if($.sort.options.mirrorElement) {
			$($.sort.options.mirrorElement).attr(cfg);
		}
		
		if(typeof $.sort.options.filterCollection == 'function') {
			var ret = $.sort.options.filterCollection.call(this, els);
			if(ret) els = ret;
		}
		
    for(var i = 0; i < els.length; i++) {
			var element = els[i];
			if(typeof $.sort.options.filterElement == 'function') {
				element = $.sort.options.filterElement.call(els[i], this);
			}
			$(this).append(element);
		}
		
		return this;
  };

})(jQuery);
