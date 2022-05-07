bd.menu.MenufRed = function() {
	this.init.apply(this, arguments);
};

bd.menu.MenufRed.prototype = {
	isReady: false,
	
	init: function() {
		this.isReady = true;
	},
	
	render: function( elem ) {
		var color = '#da9693';
		var el = jQuery(elem),
			menu = el.parents('.menu-motion');
		
		menu.parent().addClass('motion-f motion-red');
		menu.css('visibility', 'visible');
		jQuery(menu).find('.li2>span').css('background-color', color);
		
		// refresh
		bd.util.bdRefresh();
		Bindfooter.set();
		
	}
};