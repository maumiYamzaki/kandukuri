bd.slide.A59_galleriffic = function() {
	this.init.apply(this, arguments);
};

bd.slide.A59_galleriffic.prototype = {
	isReady: false,
	
	init: function() {
		bd.util.addCss(bindobj.moduleroot + '/slide/_common/galleriffic/galleriffic.css');
		head.load([
			bindobj.moduleroot + '/slide/_common/galleriffic/jquery.galleriffic.js',
			bindobj.moduleroot + '/slide/_common/galleriffic/jquery.opacityrollover.js'
		], jQuery.fnbind(this, this.callback));
	},
	
	callback: function() {
		this.isReady = true;
	},
	
	render: function( elem, autost, loop ) {
		var el = jQuery(elem);
		var h  = el.height();
		var w = el.width();
		var imgs = el.find('img'),
			imgW = imgs.attr('width'),
			imgH = imgs.attr('height');
		
		var interval = parseInt(el.attr('data-interval'), 10);
		if(isNaN(interval) || (interval <= 0)){
			interval = 5000;
		}
		var duration = parseInt(el.attr('data-duration'), 10);
		if(isNaN(duration) || (duration <= 0)){
			duration = 900;
		}
		
		var time = new Date().getTime();
		var containerId = 'galleriffic-container-' + time;
		var thumsId = 'galleriffic-thums-' + time;
		var galleryId = 'galleriffic-gallery-' + time;
		var controlsId = 'galleriffic-controls-' + time;
		var loadingId = 'galleriffic-loading-' + time;
		var slideshowId = 'galleriffic-slideshow-' + time;
		var captionId = 'galleriffic-caption-' + time;
		var thumsWidth = 64;
		
		var container = jQuery('<div class="box_galleriffic sp">').css({
			width: w,
			height: h,
			visibility: 'hidden',
			display: 'inline-block',
			position: 'relative',
			'text-align': 'left'
		}).attr('id', containerId);
		
		// thumbnails area.
		var thums = jQuery('<div class="thums">').css({
			width: thumsWidth
		}).attr('id', thumsId);
		var thumList = jQuery('<ul class="thumbs noscript">');
		
		// gallery area.
		var gallery = jQuery('<div class="gallery">').css({
			width: w - thumsWidth
		}).attr('id', galleryId);
		gallery.append('<div id="' + controlsId + '" class="controls"></div>')
			   .append([
					'<div class="slideshow-container" style="height: ' + h + 'px;">'
						,'<div id="' + loadingId + '" class="loader" style="width: ' + w + 'px; height: ' + h + 'px;"></div>'
						,'<div id="' + slideshowId + '" class="slideshow"></div>'
						,'<div class="slideLink"></div>'
						,'<div id="' + captionId + '" class="caption-container"></div>'
					,'</div>'
			   ].join(''));
		
		container.append(gallery).append(thums.append(thumList));
		
		var total = 0;
		var imgs = [];
		var links = [];
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
			
			if(anc){
				var ancObj = jQuery(anc);
				imgObj = ancObj.find('img');
				links[links.length] = ancObj.clone().empty().wrap('<p>').parent().html();
			}else if(img){
				imgObj = jQuery(img);
				links[links.length] = '';
			}
			
			if((imgObj != null) && (imgObj.length != 0)){
				if (ttl != '') {
					thumList.append([
						'<li>'
							,'<a class="thumb" href="' + imgObj.attr('src') + '"><img src="' + imgObj.attr('src') + '" width="60" alt="" /></a>'
							,'<p class="caption">'
								,ttl
							,'</p>'
						,'</li>'
					].join(''));
				} else {
					thumList.append([
						'<li>'
							,'<a class="thumb" href="' + imgObj.attr('src') + '"><img src="' + imgObj.attr('src') + '" width="60" alt="" /></a>'
						,'</li>'
					].join(''));
				}
			}
		});
		
		container.insertBefore(elem);
		
		el.remove();
		
		var slideContainer = gallery.find('.slideshow-container'),
			galleryW = gallery.width(),
			galleryH = parseInt( galleryW * (imgH / imgW) );
		slideContainer.css('height', galleryH + 'px');
		var captionBottom = (galleryH > h) ? galleryH - h : 0;
		slideContainer.find('.caption-container').css('bottom', captionBottom + 'px');
		
		if(bd.util.onEditBlock()){
			// stop anime
			loop = false;
			autost = false;
		}
		
		// opacityrollover setting.
		var onMouseOutOpacity = 0.67;
		jQuery('#' + thumsId + ' > ul > li').opacityrollover({
			mouseOutOpacity:   onMouseOutOpacity,
			mouseOverOpacity:  1.0,
			fadeSpeed:		 'fast',
			exemptionSelector: '.selected'
		});
		
		// サムネイル数を計算
		var thumNum = thumList.children('li').length;
		var thumCnt = Math.floor(h / 40);
		if(thumCnt < thumNum){
			// ナビがはみ出すなら補正
			if(h < (thumCnt * 40 + 17)){
				thumCnt -= 1;
			}
		}
		
		// Galleriffic setting.
		var gallery = jQuery('#' + thumsId).galleriffic({
			delay: interval,
			numThumbs: thumCnt,
			preloadAhead: 10,
			enableTopPager: false,
			enableBottomPager: true,
			pagerAllowOnly: true,
			maxPagesToShow: 10,
			imageContainerSel: '#' + slideshowId,
			controlsContainerSel: '#' + controlsId,
			captionContainerSel: '#' + captionId,
			loadingContainerSel: '#' + loadingId,
			renderSSControls: false,
			renderNavControls: false,
			/*playLinkText: 'Slideshowを再生する',
			pauseLinkText: 'Slideshowを停止する',
			prevLinkText: '&lsaquo; 前の画像',
			nextLinkText: '次の画像 &rsaquo;',*/
			nextPageLinkText: '&rsaquo;',
			prevPageLinkText: '&lsaquo;',
			enableHistory: false,
			autoStart: autost,
			loop: loop,
			syncTransitions: true,
			defaultTransitionDuration: duration,
			onTransitionIn: function(newSlide, newCaption, isSync){
				newSlide.css({opacity: '1', display: 'none'}).fadeIn(this.getDefaultTransitionDuration(isSync), 'easeInQuad');
				if (newCaption) {
					if (newCaption.html().length > 0) {
						newCaption.css({opacity: 0}).animate({opacity: 0.6}, this.getDefaultTransitionDuration(isSync), 'easeInQuad');
					} else {
						newCaption.hide();
					}
				}
			},
			onTransitionOut: function(previousSlide, previousCaption, isSync, transitionOutCallback){
				previousSlide.fadeOut(this.getDefaultTransitionDuration(isSync), 'easeOutQuad', transitionOutCallback);
				if (previousCaption)
					previousCaption.hide();
			},
			onSlideChange: function(prevIndex, nextIndex) {
				// 'this' refers to the gallery, which is an extension of $('#thumbs')
				this.find('ul').children()
				.eq(prevIndex).animate({opacity: onMouseOutOpacity}, 'fast', 'easeOutQuad').end()
				.eq(nextIndex).animate({opacity: 1.0}, 'fast', 'easeInQuad');
				
				// change link.
				this.parent().find('.slideLink').empty().append(links[nextIndex]);
			},
			onPageTransitionOut: function(callback) {
				this.fadeOut('fast', 'easeOutQuad', callback);
			},
			onPageTransitionIn: function() {
				this.fadeIn('fast', 'easeInQuad');
			}
		});
		
		container.css({'visibility': 'visible', 'opacity': 0}).animate({ opacity: 1 }, {
			complete:function() {
				bd.util.bdRefresh();
				Bindfooter.set();
			}
		});
	}
};
