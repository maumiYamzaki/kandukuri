bd.menu.MenufPurple = function() {
	this.init.apply(this, arguments);
};

bd.menu.MenufPurple.prototype = {
	isReady: false,
	
	init: function() {
		this.isReady = true;
	},
	
	render: function( elem ) {
		var color = '#ae96be';
		var el = jQuery(elem),
			menu = el.parents('.menu-motion');
		
		menu.parent().addClass('motion-f motion-purple');
		menu.css('visibility', 'visible');
		jQuery(menu).find('.li2>span').css('background-color', color);
		
		// refresh
		bd.util.bdRefresh();
		Bindfooter.set();
		
	}
};