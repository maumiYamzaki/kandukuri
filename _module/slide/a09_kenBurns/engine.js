bd.slide.A09_kenBurns = function() {
	this.init.apply(this, arguments);
};

bd.slide.A09_kenBurns.prototype = {
	isReady: false,
	
	init: function() {
		head.load([
			bindobj.moduleroot + '/slide/_common/slideshowify/slideshowify.css',
			bindobj.moduleroot + '/slide/_common/slideshowify/jquery.transit.min.js',
			bindobj.moduleroot + '/slide/_common/slideshowify/jquery.slideshowify.bd.js'
		], jQuery.fnbind(this, this.callback));
	},
	
	callback: function() {
		this.isReady = true;
	},
	
	render: function( elem, autost, loop ) {
		var el = jQuery(elem);
		var h  = el.height();
		var w = el.width();
		
		var interval = parseInt(el.attr('data-interval'), 10);
		if(isNaN(interval) || (interval <= 0)){
			interval = 9000;
		}
		var duration = parseInt(el.attr('data-duration'), 10);
		if(isNaN(duration) || (duration <= 0)){
			duration = 1500;
		}
		
		var slide = jQuery('<div class="box_slideshowify">').css({
			width: w,
			height: h,
			visibility: 'hidden',
			display: 'inline-block',
			position: 'relative',
			'text-align': 'left'
		});
		
		var total = 0;
		var imgs = [];
		jQuery('span', el).each(function(i, e) {
			var els = e.childNodes;
			var img = null;
			var anc = null;
			var ttl = '';
			for (var i=0; i < els.length; i++) {
				var e = els[ i ];
				if (e.nodeType == 1) {
					if (e.tagName == 'IMG') {
						img = e;
						total++;
						if (anc != null) anc.append(img);
					} else if (e.tagName == 'A') {
						anc = e;
						total++;
					} else if (e.tagName == 'SPAN') {
						ttl = jQuery(e).text();
					}
				}
			}
			
			var imgObj = null;
			var ancHtml = null;
			
			if(anc){
				var ancObj = jQuery(anc);
				imgObj = ancObj.find('img');
				ancHtml = ancObj.clone().empty().wrap('<p>').parent().html();
			}else if(img){
				imgObj = jQuery(img);
			}
			
			if((imgObj != null) && (imgObj.length != 0)){
				imgs[imgs.length] = {
					src: imgObj.attr('src')
					,h: imgObj.height()
					,w: imgObj.width()
					,anc: ancHtml
					,title: ttl
				};
			}
		});
		
		slide.insertBefore(elem);
		el.remove();
		
		if(bd.util.onEditBlock()){
			// stop anime
			loop = false;
		}
		
		slide.slideshowify({
			parentEl: slide
			,randomize: true
			,imgs: imgs
			,loop: loop
			,auto: autost
			,fadeInSpeed : duration
			,fadeOutSpeed: duration
			,aniSpeedMin: interval
			,aniSpeedMax: interval * 1.3
			,billboard: true
		});
		
		slide.css({'visibility': 'visible', 'opacity': 0}).animate({ opacity: 1 }, {
			complete:function() {
				bd.util.bdRefresh();
				Bindfooter.set();
			}
		});
	}
};
