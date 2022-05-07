bd.menu.MenujOrange = function() {
	this.init.apply(this, arguments);
};

bd.menu.MenujOrange.prototype = {
	isReady: false,
	
	init: function() {
		head.load(bindobj.moduleroot + '/menu/_common/lavalamp/jquery.lavalamp.min.js', jQuery.fnbind(this, this.callback));
	},
	
	callback: function() {
		this.isReady = true;
	},
	
	render: function( elem ) {
		var el = jQuery(elem),
			menu = el.parents('.menu-motion');
		
		menu.parent().addClass('motion-j motion-orange');
		
		el.lavaLamp({
			fx: "easeOutBack",
			speed: 700
		});
		
		menu.css('visibility', 'visible');
		
		// refresh
		bd.util.bdRefresh();
		Bindfooter.set();
		
	}
};
