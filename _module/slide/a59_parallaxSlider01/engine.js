bd.slide.A59_parallaxSlider01 = function() {
	this.init.apply(this, arguments);
};

bd.slide.A59_parallaxSlider01.prototype = {
	isReady: false,
	
	init: function() {
		bd.util.addCss(bindobj.moduleroot + '/slide/_common/ParallaxSlider/style.css');
		bd.util.addCss(bindobj.moduleroot + '/slide/a59_parallaxSlider01/style.css');
		head.load(bindobj.moduleroot + '/slide/_common/ParallaxSlider/jquery.ParallaxSlider.js', jQuery.fnbind(this, this.callback));
	},
	
	callback: function() {
		this.isReady = true;
	},
	
	render: function( elem, autost, loop ) {
		var el = jQuery(elem);
		var h  = el.height();
		var w = el.parent().width();
		
		var interval = parseInt(el.attr('data-interval'), 10);
		if(isNaN(interval) || (interval <= 0)){
			interval = 6500;
		}
		var duration = parseInt(el.attr('data-duration'), 10);
		if(isNaN(duration) || (duration <= 0)){
			duration = 1000;
		}
		
		var slide = jQuery('<div class="pxs_container a59_parallaxSlider01">').css({
			width: w,
			height: h,
			display: 'inline-block',
			visibility: 'hidden'
		});
		var bg = jQuery('<div class="pxs_bg"></div>').appendTo(slide);
		jQuery('<div class="pxs_bg1"></div>').appendTo(bg);
		jQuery('<div class="pxs_bg2"></div>').appendTo(bg);
		jQuery('<div class="pxs_bg3"></div>').appendTo(bg);
		jQuery('<div class="pxs_loading">Loading images...</div>').appendTo(slide);
		var wrapper = jQuery('<div class="pxs_slider_wrapper"></div>').appendTo(slide);
		var ulslide = jQuery('<ul class="pxs_slider"></ul>').appendTo(wrapper);
		var navi = jQuery('<div class="pxs_navigation"></div>').appendTo(wrapper);
		var navinext = jQuery('<span class="pxs_next"></span>').appendTo(navi);
		var naviprev = jQuery('<span class="pxs_prev"></span>').appendTo(navi);
		var ulthumb = jQuery('<ul class="pxs_thumbnails"></ul>').appendTo(wrapper);
		ulthumb.css('top',(h-40) + 'px');
		navinext.width(20);
		navinext.height(40);
		naviprev.width(20);
		naviprev.height(40);
		navinext.css('top',(h-50)/2-10 + 'px');
		naviprev.css('top',(h-50)/2-10 + 'px');
		
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
				var lislide = jQuery('<li></li>').appendTo(ulslide);
				var lithumb = jQuery('<li></li>').appendTo(ulthumb);
				if (ancHtml) {
					lislide = jQuery(ancHtml).appendTo(lislide);
				}
				lislide.css('list-style-type','none');
				lithumb.css('list-style-type','none');
				
				var imgwidth = imgObj.width();
				var imgheight = imgObj.height();
				if (imgwidth>w-20) {
					imgwidth = w - 20;
					imgheight = imgwidth * imgObj.height()/imgObj.width();
				}
				if (imgheight>h-40) {
					imgheight = h - 40;
					imgwidth = imgheight * imgObj.width()/imgObj.height()
				}
				//imgheight = imgwidth * imgObj.height()/imgObj.width();
				jQuery('<img/>')
					.attr('src',imgObj.attr('src'))
					.width(imgwidth)
					.height(imgheight)
					.css('border','4px solid transparent')
					.css('margin','10px auto 0px auto')
					.attr('alt',imgObj.attr('alt')).appendTo(lislide);
				imgwidth = imgObj.width();
				imgheight = imgObj.height();
				jQuery('<img/>')
					.attr('src',imgObj.attr('src'))
					.width(48)
					.height((48)*(imgheight/imgwidth))
					.css('border','2px solid #FFFFFF')
					.attr('alt',imgObj.attr('alt')).appendTo(lithumb);
			}
		});
		
		slide.insertBefore(elem);
		el.remove();
		
		if(bd.util.onEditBlock()){
			autost = false;
			loop = false;
		}
		
		slide.parallaxSlider({
			width			: w,
			height			: h,
			auto			: (autost?interval:0),	//how many seconds to periodically slide the content.
										//If set to 0 then autoplay is turned off.
			speed			: duration,	//speed of each slide animation
			easing			: 'jswing',	//easing effect for the slide animation
			easingBg		: 'jswing',	//easing effect for the background animation
			circular		: loop,		//circular slider
			thumbRotation	: true		//the thumbs will be randomly rotated
		}, function(){
			wrapper.show();
			slide.css({'visibility': 'visible', 'opacity': 0}).animate({ opacity: 1 }, {
				complete:function() {
					wrapper.show();
					bd.util.bdRefresh();
					Bindfooter.set();
				}
			});
		});
		
		//resize
		var wFlg = false
		if (jQuery('#area-contents').width() == jQuery(window).width()) wFlg = true;
		jQuery(window).resize(function(){
			var w = jQuery('.a59_parallaxSlider01').parent().width();
			if (wFlg) w = jQuery(window).width();
			jQuery('.a59_parallaxSlider01').css('width', w + 'px');
		});
	}
};