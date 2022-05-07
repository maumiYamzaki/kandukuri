bd.slide.PzKenBurns = function() {
	this.init.apply(this, arguments);
};

bd.slide.PzKenBurns.prototype = {
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
		
		var self = this;
		jQuery(window).resize(function(){
			self.resize();
		});
	},
	
	render: function( elem, autost, loop ) {
		elem.style.width = '0px';
		elem.style.height = '0px';
		loop = true;
		
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
		
		var size = this.getPageSize();
		var slide = jQuery('<div class="box_slideshowify">').css({
			position: 'absolute',
			top: 0,
			left: 0,
			width: size.w,
			height: size.h,
			visibility: 'hidden',
			display: 'block',
			'text-align': 'left',
			'z-index': '-1',
			overflow: 'hidden'
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
					,anc: null
					,title: ttl
				};
			}
		});
		
		slide.appendTo(document.body);
		el.remove();
		jQuery('.thunder-bg').css('background', 'none');
		jQuery('.wind-bg').css('background', 'none');
		
		if(bd.util.onEditBlock()){
			// stop anime
			loop = false;
		}
		
		slide.slideshowify({
			parentEl: slide
			,randomize: true
			,imgs: imgs
			,loop: loop
			,auto: true
			,fadeInSpeed : duration
			,fadeOutSpeed: duration
			,aniSpeedMin: interval
			,aniSpeedMax: interval * 1.3
			,billboard: false
		});
		
		slide.css({'visibility': 'visible', 'opacity': 1});
		
		this.container = slide;
	},
	
	getPageSize: function() {
		var pg = jQuery('#page');
		return {h: pg.height(), w: pg.width()};
	},
	
	resize: function() {
		var size = this.getPageSize();
		this.container.width(size.w).height(size.h);
	}
};
