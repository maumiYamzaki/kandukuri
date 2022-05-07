bd.menu.MenugGreen = function() {
	this.init.apply(this, arguments);
};

bd.menu.MenugGreen.prototype = {
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
		
		el.lavaLamp({
			fx: "easeOutBack",
			speed: 700
		});
		
		menu.parent().addClass('motion-g motion-green');
		
		var h = el.find('li').height();
		
		el.find('li.back').css({
			height: h + 'px',
			position: 'absolute'
		});
		
		menu.css('visibility', 'visible');
		
		// refresh
		bd.util.bdRefresh();
		Bindfooter.set();
	}
};
