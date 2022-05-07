bd.menu.Menuh = function() {
	this.init.apply(this, arguments);
};

bd.menu.Menuh.prototype = {
	isReady: false,
	
	init: function() {
		this.isReady = true;
	},
	
	render: function( elem ) {
		var el = jQuery(elem),
			menu = el.parents('.menu-motion');
		
		menu.parent().addClass('motion-h');
		
		slide(el, 25, 15, 150, .8);
		
		menu.css('visibility', 'visible');
		
		// refresh
		bd.util.bdRefresh();
		Bindfooter.set();
		
	}
};

function slide(navigation_id, pad_out, pad_in, time, multiplier)
{
	// creates the target paths
	var list_elements = navigation_id.find('>li');
	var link_elements = list_elements.find('>a');
	
	// initiates the timer used for the sliding animation
	var timer = 0;
	
	// creates the slide animation for all list elements 
	jQuery(list_elements).each(function(i)
	{
		var _t = jQuery(this);
		// margin left = - ([width of element] + [total vertical padding of element])
		_t.css("margin-left","-180px");
		// updates timer
		timer = (timer*multiplier + time);
		_t.animate({ marginLeft: "0" }, timer);
		_t.animate({ marginLeft: "15px" }, timer);
		_t.animate({ marginLeft: "0" }, timer);
	});

	// creates the hover-slide effect for all link elements 		
	jQuery(link_elements).each(function(i)
	{
		var _t = jQuery(this);
		_t.hover(
		function()
		{
			_t.animate({ paddingLeft: pad_out }, 150);
		},		
		function()
		{
			_t.animate({ paddingLeft: pad_in }, 150);
		});
	});
}