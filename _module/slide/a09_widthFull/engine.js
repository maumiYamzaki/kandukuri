bd.slide.A09_widthFull = function() {
	this.init.apply(this, arguments);
};

bd.slide.A09_widthFull.prototype = {
	isReady: false,
	
	init: function() {
		bd.util.addCss(bindobj.moduleroot + '/slide/_common/bdWidthFull/widthFull.css');
		head.load(bindobj.moduleroot + '/slide/_common/bdWidthFull/widthFull.js', jQuery.fnbind(this, this.callback));
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
			interval = 4000;
		}
		var duration = parseInt(el.attr('data-duration'), 10);
		if(isNaN(duration) || (duration <= 0)){
			duration = 800;
		}
		
		var time = new Date().getTime();
		var containerId = 'box_widthFull-container-' + time;
		
		var container = jQuery('<div class="box_widthFull">').css({
			visibility: 'hidden',
			display: 'inline-block',
			position: 'relative',
			'text-align': 'left',
			height: h
		}).attr('id', containerId);
		
		var storeClass = 'cs-store';
		var listClass = 'cs-list';
		
		var store = jQuery('<ul class="' + storeClass + '">');
		container.append(store);
		
		container.append([
			'<ul class="' + listClass + '">'
				,'<li><a href="javascript:;"></a></li>'
				,'<li><a href="javascript:;"></a></li>'
				,'<li><a href="javascript:;"></a></li>'
			,'</ul>'
		].join(''));
		
		// When has 2 items, clone more 2 items.
		var spans = jQuery('>span', el);
		if (spans.length == 2) {
			el.append(jQuery(spans[0]).clone());
			el.append(jQuery(spans[1]).clone());
		}
		
		var total = 0;
		var params ={
			items: []
		};
		jQuery('>span', el).each(function(i, e) {
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
			var link = {
				url: 'javascript:;'
				,target: null
				,onclick: null
				,styleClass: null
			};
			
			if(anc){
				var ancObj = jQuery(anc);
				imgObj = ancObj.find('img');
				link.url = ancObj.attr('href')
				link.target = ancObj.attr('target')
				link.onclick = ancObj.attr('onclick')
				link.styleClass = ancObj.attr('class')
			}else if(img){
				imgObj = jQuery(img);
			}
			
			if((imgObj != null) && (imgObj.length != 0)){
				store.append([
					'<li>'
						,'<img src="' + imgObj.attr('src') + '">'
					,'</li>'
				].join(''));
				
				params.items[params.items.length] = {
					link : link
					,title: ttl
				};
			}
		});
		
		
		for(var count = store.find('li').length; count < 3; count++){
			store.append(jQuery(store.find('li')[0]).clone());
			params.items[params.items.length] = {
				link : params.items[0].link
				,title: params.items[0].title
			};
		}
		
		container.insertBefore(elem);
		el.remove();
		
		if(bd.util.onEditBlock()){
			// stop anime
			loop = false;
			autost = false;
		}
		
		params.height = h;
		params.width = w;
		params.loop = loop;
		params.auto = autost;
		params.interval = interval;
		params.duration = duration;
		
		container.widthFull(params);
		
		container.css({'visibility': 'visible', 'opacity': 0}).animate({ opacity: 1 }, {
			complete:function() {
				bd.util.bdRefresh();
				Bindfooter.set();
			}
		});
	}
};
