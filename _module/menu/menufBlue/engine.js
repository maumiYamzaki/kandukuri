bd.menu.MenufBlue = function() {
	this.init.apply(this, arguments);
};

bd.menu.MenufBlue.prototype = {
	isReady: false,
	
	init: function() {
		this.isReady = true;
	},
	
	render: function( elem ) {
		var color = '#7ccbcb';
		var el = jQuery(elem),
			menu = el.parents('.menu-motion');
		
		menu.parent().addClass('motion-f motion-blue');
		menu.css('visibility', 'visible');
		jQuery(menu).find('.li2>span').css('background-color', color);
		
		// refresh
		bd.util.bdRefresh();
		Bindfooter.set();
		
	}
};