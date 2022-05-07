bd.menu.Menui = function() {
	this.init.apply(this, arguments);
};

bd.menu.Menui.prototype = {
	isReady: false,
	
	init: function() {
		this.isReady = true;
	},
	
	render: function( elem ) {
		var el = jQuery(elem),
			menu = el.parents('.menu-motion');
		
		menu.parent().addClass('motion-i');
		menu.css('visibility', 'visible');
		
		// refresh
		bd.util.bdRefresh();
		Bindfooter.set();
		
	}
};
