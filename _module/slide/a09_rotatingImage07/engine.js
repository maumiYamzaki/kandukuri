bd.slide.A09_rotatingImage07 = function() {
	this.init.apply(this, arguments);
};

bd.slide.A09_rotatingImage07.prototype = {
	isReady: false,
	
	init: function() {
		head.load([
			bindobj.moduleroot + '/slide/_common/RotatingImageSlider/RotatingImageSlider.css',
			bindobj.moduleroot + '/slide/a09_rotatingImage07/style.css',
			bindobj.moduleroot + '/slide/_common/modernizr.custom.81752.js',
			bindobj.moduleroot + '/slide/_common/RotatingImageSlider/jQueryRotate.js',
			bindobj.moduleroot + '/slide/_common/RotatingImageSlider/jquery.RotateImageMenu.bd.js'
		], jQuery.fnbind(this, this.callback));
	},
	
	callback: function() {
		this.isReady = true;
	},
	
	render: function( elem, autost, loop ) {
		var el = jQuery(elem);
		var h  = el.height();
		//var w = el.width();
		var w = el.width() - (53 * 2);	// minus nav width.
		
		var interval = parseInt(el.attr('data-interval'), 10);
		if(isNaN(interval) || (interval <= 0)){
			interval = 6500;
		}
		var duration = parseInt(el.attr('data-duration'), 10);
		if(isNaN(duration) || (duration <= 0)){
			duration = 200;
		}
		
		var time = new Date().getTime();
		var containerId = 'box_rotatingImage-container-' + time;
		
		var container = jQuery('<div class="box_rotatingImage a09_rotatingImage07">').css({
			visibility: 'hidden',
			display: 'inline-block',
			position: 'relative',
			'text-align': 'left'
		}).attr('id', containerId);
		
		var rm = jQuery('<div class="rm_container">').css({
			'height': h + 'px'
		});
		
		var listBase = w * 0.025;
		var listStyle = [
			'width: ' + ((w /4) + listBase) + 'px;'
			,'height: ' + h + 'px;'
			,'margin-left: -' + (listBase * 2.7) + 'px;'
			,'border-width: ' + (listBase * 1.6) + 'px ' + listBase + 'px 0px ' + listBase + 'px;'
		].join('');
		if (!bindobj.ie80) var marginTop = 'margin-top: -' + listBase + 'px;'
		rm.append([
			'<ul>'
				,'<li data-images="rm_container_1_' + time + '" data-rotation="-15" style="' + listStyle + '"></li>'
				,'<li data-images="rm_container_2_' + time + '" data-rotation="-5" style="' + listStyle + marginTop + '"></li>'
				,'<li data-images="rm_container_3_' + time + '" data-rotation="5" style="' + listStyle + '"></li>'
				,'<li data-images="rm_container_4_' + time + '" data-rotation="15" style="' + listStyle + '"></li>'
			,'</ul>'
		].join(''));
		
		var maskLeft = (w / 2) * 0.94,
			maskRight = (w /2) * 1.09;
		rm.append([
			'<div class="rm_mask_left" style="width: ' + maskLeft + 'px;"></div>'
			,'<div class="rm_mask_right" style="width: ' + maskRight + 'px;"></div>'
			,'<div class="rm_corner_left"></div>'
			,'<div class="rm_corner_right"></div>'
		].join(''));
		
		rm.append([
			'<div id="rm_container_num_' + time + '" style="display:none;">'
				,'<div id="rm_container_1_' + time + '"></div>'
				,'<div id="rm_container_2_' + time + '"></div>'
				,'<div id="rm_container_3_' + time + '"></div>'
				,'<div id="rm_container_4_' + time + '"></div>'
			,'</div>'
		].join(''));
		
		
		container.append(rm).append([
			'<div class="rm_nav">'
				,'<a href="#" class="rm_next" style="top: ' + (h/2 - 87/2) + 'px;"></a>'
				,'<a href="#" class="rm_prev" style="top: ' + (h/2 - 87/2) + 'px;"></a>'
			,'</div>'
			/*,'<div class="rm_controls">'
				,'<a href="#" class="rm_play">Play</a>'
				,'<a href="#" class="rm_pause">Pause</a>'
			,'</div>'*/
		].join(''));
		
		var total = 0;
		var countImg = 0;
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
			var ancHtml = '';
			
			if(anc){
				if(ttl == ''){
					ttl = 'リンク';
				}
				
				var ancObj = jQuery(anc);
				imgObj = ancObj.find('img');
				ancHtml = ancObj.clone().empty().html(ttl).wrap('<p>').parent().html();
			}else if(img){
				imgObj = jQuery(img);
				ancHtml = ttl;
			}
			
			if((imgObj != null) && (imgObj.length != 0)){
				if(countImg < 4){
					jQuery(rm.find('li')[countImg]).append('<img src="' + imgObj.attr('src') + '"/>');
				}
				
				var indexImg = countImg % 4;
				jQuery(rm.find('#rm_container_num_' + time + ' div')[indexImg]).append('<img src="' + imgObj.attr('src') + '"/>');
				
				countImg++;
			}
		});
		
		if(countImg < 4){
			container.find('.rm_nav').hide();
			container.find('.rm_controls').hide();
		}
		
		container.find('.rm_container').css({width: w});
		
		container.insertBefore(elem);
		el.remove();
		
		if(bd.util.onEditBlock()){
			// stop anime
			loop = false;
			autost = false;
		}
		
		container.rotateImageMenu(autost);
		
		container.css({'visibility': 'visible', 'opacity': 0}).animate({ opacity: 1 }, {
			complete:function() {
				bd.util.bdRefresh();
				Bindfooter.set();
			}
		});
	}
};
