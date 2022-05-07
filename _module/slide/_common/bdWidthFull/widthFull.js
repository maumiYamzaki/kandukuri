(function($) {
	$.fn.widthFull = function(aParams){
		
		var app = {
			id: this.attr('id')
			,list: null
			,items: aParams.items
			,slideIndex: 1
			,images: []
			,resizeTimer: null
			,slideTimer: null
			,width: aParams.width
			,height: aParams.height
			,loop: aParams.loop
			,auto: aParams.auto
			,interval: aParams.interval
			,duration: aParams.duration
			,easing: 'easeInOutCubic'
			,get: function(){
				return $('#' + app.id);
			}
		};
		
		var func = {
			
			setList: function(){
				app.list = app.get().children('.cs-list').find('li');
			}
			
			,onResize: function(){
				
				var width = app.get().width();
				var size = func.doResizeImage();
				app.get().css('height', size.height);
				func.setPosition((width - size.width) / 2);
				func.doReset();
				func.setLink();
			}
			
			,setPosition: function(aPos){
				app.get().children('.cs-list').css('left', aPos);
			}
			
			,doResizeImage: function(){
				
				// MEMO: fix rate.
				var rate = 1;
				//var rate = app.get().width() / app.width;
				
				var ret = {
					width: Math.round(app.width * rate)
					,height: Math.round(app.height * rate)
				};
				
				for(var i = 0; i < app.images.length; i++){
					app.images[i].css({
						width: ret.width
						,height: ret.height
					});
				}
				
				return ret;
			}
			
			,setLink: function(){
				
				var width = app.get().width();
				if(width <= app.width){
					if (app.list.eq(1).find('map').length == 0) {
						app.list.eq(1).find('a').attr('href', app.items[app.slideIndex].link.url)
												.attr('target', app.items[app.slideIndex].link.target)
												.attr('onclick', app.items[app.slideIndex].link.onclick)
												.attr('class', app.items[app.slideIndex].link.styleClass);

						var time = new Date().getTime(),
							h = app.height,
							w4 = width / 4,
							ps = (app.width - width) / 2,
							pe = ps + w4,
							ns = ps + (w4 * 3),
							ne = ps + width;
						app.list.eq(1).find('img').attr('usemap', '#link-'+time);
						app.list.eq(1).append('<map style="cursor:pointer;" name="link-'+time+'"></map>');
						app.list.eq(1).find('map').append('<area class="cs-prev" shape="rect" coords="'+ps+',0,'+pe+','+h+'">');
						app.list.eq(1).find('map').append('<area class="cs-next" shape="rect" coords="'+ns+',0,'+ne+','+h+'">');
					}
				} else {
					app.list.eq(0).find('a').addClass('cs-prev');
					app.list.eq(1).find('a').attr('href', app.items[app.slideIndex].link.url)
											.attr('target', app.items[app.slideIndex].link.target)
											.attr('onclick', app.items[app.slideIndex].link.onclick)
											.attr('class', app.items[app.slideIndex].link.styleClass);
					app.list.eq(2).find('a').addClass('cs-next');
				}
				
				for(var i = 0; i < 3; i++){
					
					app.list.eq(i).find('a')
						.off('mouseover').on('mouseover', function(){
							
							$(this).stop().animate({'opacity': 0.7}, {duration: 250});
						})
						.off('mouseout').on('mouseout', function(){
							
							$(this).stop().animate({'opacity': 1}, {duration: 250});
						});
				}
				
				app.get().find('.cs-prev').off('click').on('click', function(){
					
					if( !app.loop && (app.slideIndex == 1)){
						return;
					}
					
					clearTimeout(app.slideTimer);
					app.slideTimer = null;
					
					func.doReset();
					func.doBack();
					
					return false;
				})
				
				app.get().find('.cs-next').off('click').on('click', function(){
					
					if( !app.loop && (app.slideIndex == 0)){
						return;
					}
					
					clearTimeout(app.slideTimer);
					app.slideTimer = null;
					
					func.doReset();
					func.doGo();
					
					return false;
				});
			}
			
			,doReset: function(){
				
				app.get().find('.cs-prev').off('click');
				app.get().find('.cs-next').off('click');
				app.get().find('map').remove();
				app.list.eq(1).find('img').attr('usemap', null);
				
				app.list.eq(0).find('a').removeClass('cs-prev');
				app.list.eq(1).find('a').attr('href', 'javascript:;').attr('target', null).attr('onclick', null).attr('class', null);
				app.list.eq(2).find('a').removeClass('cs-next');
			}
			
			,setSlide: function(){
				
				if( !app.auto){
					return;
				}
				
				if( !app.loop && (app.slideIndex == 0)){
					return;
				}
				
				app.slideTimer = setTimeout(function(){
					
					func.doReset();
					func.doGo();
					
				}, app.interval);
			}
			
			,doGo: function(){
				
				app.slideIndex++;
				
				if(app.slideIndex >= app.images.length){
					app.slideIndex = 0;
				}
				
				var next = app.slideIndex + 1;
				if(next >= app.images.length){
					next = 0;
				}
				
				var item = $('<li/>').css({
					left: app.width * 2
					,width: app.width
				});
				item.append('<a href="javascript:;"></a>');
				item.find('a').append(app.images[next].clone());
				if (app.items[next].title != '') {
					item.append('<div><h3>' + app.items[next].title + '</h3></div>');
					if (app.items.mobile) {
						item.find('div').addClass('mb-title');
						item.find('h3').addClass('mb-title');
					}
				}
				app.get().children('.cs-list').append(item);
				
				app.list = app.get().children('.cs-list').find('li');
				app.list.eq(0).animate({'left': - app.width * 2},	{duration: app.duration, easing: app.easing});
				app.list.eq(1).animate({'left': - app.width},		{duration: app.duration, easing: app.easing});
				app.list.eq(2).animate({'left': 0},					{duration: app.duration, easing: app.easing});
				app.list.eq(3).animate({'left': app.width},			{duration: app.duration, easing: app.easing
					,complete:function(){
						app.list.eq(0).remove();
						func.setList();
						func.setLink();
						func.setSlide();
					}
				});
			}
			
			,doBack: function(){
				
				app.slideIndex--;
				
				if(app.slideIndex < 0){
					app.slideIndex = app.images.length - 1;
				}
				
				var prev = app.slideIndex - 1;
				if(prev < 0){
					prev = app.images.length - 1;
				}
				
				var item = $('<li/>');
				var item = $('<li/>').css({
					left: - app.width * 2
					,width: app.width
				});
				item.append('<a href="javascript:;"></a>');
				if (app.items[prev].title != '') {
					item.append('<div><h3>' + app.items[prev].title + '</h3></div>');
					if (app.items.mobile) {
						item.find('div').addClass('mb-title');
						item.find('h3').addClass('mb-title');
					}
				}
				item.find('a').append(app.images[prev]);
				app.get().children('.cs-list').prepend(item);
				
				app.list = app.get().children('.cs-list').find('li');
				app.list.eq(3).animate({'left': app.width * 2},	{duration: app.duration, easing: app.easing});
				app.list.eq(2).animate({'left': app.width},		{duration: app.duration, easing: app.easing});
				app.list.eq(1).animate({'left': 0},				{duration: app.duration, easing: app.easing});
				app.list.eq(0).animate({'left': - app.width},	{duration: app.duration, easing: app.easing
					,complete:function(){
						app.list.eq(3).remove();
						func.setList();
						func.setLink();
						func.setSlide();
					}
				});
			}
		}
		
		app.get().children('.cs-store').find('li').each(function(i){
			app.images[app.images.length] = $(this).find('img');
		});
		app.get().children('.cs-store').remove();
		
		func.setList();
		
		for(var i = 0; i < 3; i++){
			app.list.eq(i).find('a').append(app.images[i]);
			app.list.eq(i).css({
				left: (app.width * i) - app.width
				,width: app.width
			});
			if (app.items[i].title != '') {
				app.list.eq(i).append('<div><h3>' + app.items[i].title + '</h3></div>');
				if (app.items.mobile) {
					app.list.eq(i).find('div').addClass('mb-title');
					app.list.eq(i).find('h3').addClass('mb-title');
				}
			}
		}
		
		func.onResize();
		func.setLink();
		func.setSlide();
		
		// IE8 init layout bug.
		var initWidth = app.get().width();
		setTimeout(function(){
			if(initWidth != app.get().width()){
				func.onResize();
			}
		}, 500);
		
		$(window).resize(function(){
			
			if(app.resizeTimer != null){
				clearTimeout(app.resizeTimer);
			}
			app.resizeTimer = setTimeout(function(){
				func.onResize();
			}, 100);
		});
		
		return this;
	};
}(jQuery));
