bd.slide.A09_slicebox = function() {
	this.init.apply(this, arguments);
};

bd.slide.A09_slicebox.prototype = {
	isReady: false,
	
	init: function() {
		bd.util.addCss(bindobj.moduleroot + '/slide/_common/Slicebox/custom.css');
		bd.util.addCss(bindobj.moduleroot + '/slide/_common/Slicebox/slicebox.css');
		head.load([
			bindobj.moduleroot + '/slide/_common/modernizr.custom.81752.js',
			bindobj.moduleroot + '/slide/_common/Slicebox/jquery.slicebox.js'
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
			interval = 6500;
		}
		var duration = parseInt(el.attr('data-duration'), 10);
		if(isNaN(duration) || (duration <= 0)){
			duration = 1000;
		}
		
		var slidewrap = jQuery('<div class="sb-wrapper">').css({
			width: w,
			height: h+50,
			textAlign: 'center',
			display: 'inline-block',
			visibility: 'hidden'
		});
		
		var sbslider = jQuery('<ul class="sb-slider"></ul>').css({
			width: w+'px',
			height: h+'px',
			maxWidth: w+'px',
			listStyleType: 'none',
			textAlign: 'center',
			margin: '0px',
			zIndex: 1
		}).appendTo(slidewrap);
		
		var sbshadow = jQuery('<div class="sb-shadow1"></div>').appendTo(slidewrap);
		var sbarrows = jQuery('<div class="sb-nav-arrows"></div>').css({
			zIndex: 1
		}).appendTo(slidewrap);
		var sbNext = jQuery('<a href="javascript:void(0);">Next</a>').css({
			zIndex: 1
		}).appendTo(sbarrows);
		var sbPrev = jQuery('<a href="javascript:void(0);">Previous</a>').css({
			zIndex: 1
		}).appendTo(sbarrows);
		
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
				var imgwidth = imgObj.width();
				var imgheight = imgObj.height();
				var rate = imgObj.width()/imgObj.height();
				if (imgheight>h){
					imgwidth = h*(rate);
					imgheight = h;
				}
				if (imgwidth>w){
					imgheight = w/(rate);
					imgwidth = w;
				}
				
				var licntslide = jQuery('<li></li>')
					.css('list-style-type','none')
					.width(imgwidth)
					.height('auto')
					//.height(h)
					.css('vertical-align','bottom')
					.css('margin','0px').appendTo(sbslider);
				if (ancHtml) {
					lislide = jQuery(ancHtml).appendTo(licntslide);
				}else{
					lislide = licntslide;
				}
				
				jQuery('<img/>')
					.attr('src',imgObj.attr('src'))
					.width(imgwidth)
					.height(imgheight)
					.css('align','center')
					.css('vertical-align','bottom')
					.css('margin','0')
					.css('padding','0')
					.attr('alt',imgObj.attr('alt')).appendTo(lislide);
				if (ttl.length>0) {
					var sbdesc = jQuery('<div class="sb-description"></div>')
						.css('bottom','10px')
						.css('left','20px')
						.css('right','20px')
						.css('padding','20px').appendTo(licntslide);
					jQuery('<h3>'+ttl+'</h3>')
						.css('font-size','16px')
						.css('color','#fff').appendTo(sbdesc);
				}
			}
		});
		slidewrap.insertBefore(elem);
		el.remove();
		
		if(bd.util.onEditBlock()){
			autost = false;
			loop = false;
		}
		
		var Page = (function() {
			var $navArrows = jQuery( '.sb-nav-arrows', slidewrap ).hide(),
				$shadow = jQuery( '.sb-shadow1', slidewrap ).hide(),
				slicebox = sbslider.slicebox( {
					onReady : function() {
						$navArrows.show();
						$shadow.show();
					},
					orientation : 'r',
					disperseFactor : 30,
					autoplay : autost,
					interval: interval,
					speed : duration,
					fallbackFadeSpeed : duration,
					colorHiddenSides : (bindobj.ie?'transparent':'#222'),
					loop : loop,
					cuboidsRandom : true
				} ),
				init = function() {
					initEvents();
				}
				initEvents = function() {
					// add navigation events
					$navArrows.children( ':first' ).on( 'click', function() {
						slicebox.next();
						if (autost) {
							slicebox.play();
						}
						return false;
					} );
					$navArrows.children( ':last' ).on( 'click', function() {
						slicebox.previous();
						if (autost) {
							slicebox.play();
						}
						return false;
					} );
				};
				return { init : init };
		})();
		Page.init();
		
		slidewrap.css({'visibility': 'visible', 'opacity': 0}).animate({ opacity: 1 }, {
			complete:function() {
				bd.util.bdRefresh();
				Bindfooter.set();
			}
		});
	}
};
