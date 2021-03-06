(function($) {
	$.fn.rotateImageMenu = function(autostart){
		
		//our 4 items	
		var $listItems 		= this.find('.rm_container > ul > li'),
			totalItems		= $listItems.length,
			
			//the controls
			$rm_next		= this.find('.rm_next'),
			$rm_prev		= this.find('.rm_prev'),
			$rm_play		= this.find('.rm_play'),
			$rm_pause		= this.find('.rm_pause'),
			
			//the masks and corners of the slider
			$rm_mask_left	= this.find('.rm_mask_left'),
			$rm_mask_right	= this.find('.rm_mask_right'),
			$rm_corner_left	= this.find('.rm_corner_left'),
			$rm_corner_right= this.find('.rm_corner_right'),
			
			//check if the browser is <= IE8
			ieLte8			= !Modernizr.csstransforms,
//			ieLte8			= ($.browser.msie && parseInt($.browser.version) <= 8),
			
			RotateImageMenu	= (function() {
					//difference of animation time between the items
				var	timeDiff			= 300,
					//time between each image animation (slideshow)
					//slideshowTime		= 3000, default
					slideshowTime		= 10000,
					slideshowInterval,	
					//checks if the images are rotating
					isRotating			= false,
					//how many images completed each slideshow iteration
					completed			= 0,
					/*
					all our images have 310 of width and 465 of height.
					this could / should be dynamically calculated 
					if we would have different image sizes.
					
					we will set the rotation origin at 
					x = width/2 and y = height*2
					*/
					origin				= ['155px', '930px'],
					init				= function() {
						configure();
						initEventsHandler();
					},
					//initialize some events
					initEventsHandler	= function() {
						/*
						next and previous arrows:
						we will stop the slideshow if active,
						and rotate each items images.
						1 	rotate right
						-1 	rotate left
						*/
						$rm_next.bind('click', function(e) {
							stopSlideshow();
							rotateImages(1);
							return false;
						});
						$rm_prev.bind('click', function(e) {
							stopSlideshow();
							rotateImages(-1);
							return false;
						});
						/*
						start and stop the slideshow
						*/
						$rm_play.bind('click', function(e) {
							startSlideshow();
							return false;
						});
						$rm_pause.bind('click', function(e) {
							stopSlideshow();
							return false;
						});
						/*
						auto start slideshow (add 2014/03/27)
						*/
						if (autostart) {
							setTimeout(function() {startSlideshow();}, 5000);
						}
						/*
						adds events to the mouse and left / right keys
						*/
	//					$(document).bind('mousewheel', function(e, delta) {
	//						if(delta > 0) {
	//							stopSlideshow();
	//							rotateImages(0);
	//						}	
	//						else {
	//							stopSlideshow();
	//							rotateImages(1);
	//						}	
	//						return false;
	//					}).keydown(function(e){
	//						switch(e.which){
	//							case 37:
	//								stopSlideshow();
	//								rotateImages(0);
	//								break;
	//							case 39:
	//								stopSlideshow();
	//								rotateImages(1);
	//								break;
	//						}
	//					});
					},
					/*
					rotates each items images.
					we set a delay between each item animation
					*/
					rotateImages		= function(dir) {
						//if the animation is in progress return
						if(isRotating) return false;
						
						isRotating = true;
						
						$listItems.each(function(i) {
							var $item 				= $(this),
								/*
								the delay calculation.
								if rotation is to the right, 
								then the first item to rotate is the first one,
								otherwise the last one
								*/
								interval			= (dir === 1) ? i * timeDiff : (totalItems - 1 - i) * timeDiff;
							
							setTimeout(function() {
									//the images associated to this item
								var	$otherImages		= $('#' + $item.data('images')).children('img'),
									totalOtherImages	= $otherImages.length;
									
									//the current one
									$img				= $item.children('img:last'),
									//keep track of each items current image
									current				= $item.data('current');
									//out of bounds 
									if(current > totalOtherImages - 1)
										current = 0;
									else if(current < 0)
										current = totalOtherImages - 1;
									
									//the next image to show and its initial rotation (depends on dir)
									var otherRotation	= (dir === 1) ? -30 : 30,
										$other			= $otherImages.eq(current).clone();
									
									// sp.
									if($item.width() < 100){
										otherRotation	= (dir === 1) ? -10 : 10;
									}
									
									//for IE <= 8 we will not rotate, but fade out / fade in ... 
									//better than nothing :)	
									if(!ieLte8)
										$other.rotate({
											angle: otherRotation
											,center: origin
										});
									
									(dir === 1) ? ++current : --current;
									
									//prepend the next image to the <li>
									$item.data('current', current).prepend($other);
									
									//the final rotation for the current image 
									var rotateTo		= (dir === 1) ? 80 : -80;
									
									// sp.
									if($item.width() < 100){
										rotateTo		= (dir === 1) ? 55 : -55;
									}
									
									if(!ieLte8) {
										$img.rotate({
											animateTo	: rotateTo
											,duration   : 1200
											// easeInSine
											,easing: function(x, t, b, c, d) { return -c * Math.cos(t/d * (Math.PI/2)) + c + b; }
											,callback   : function(){
												$(this).remove();
												++completed;
												if(completed === 4) {
													completed = 0;
													isRotating = false;
												}
											}
										});
										var otherDuration = 600;
										// sp.
										if($item.width() < 100){
											otherDuration = 400;
										}
										
										$other.rotate({
											animateTo	: 0
											// easeInSine
											,easing: function(x, t, b, c, d) { return -c * Math.cos(t/d * (Math.PI/2)) + c + b; }
											,duration   : otherDuration
										});
									}
									else {
										$img.fadeOut(1200, function(){
											$(this).remove();
											++completed;
											if(completed === 4) {
												completed = 0;
												isRotating = false;
											}
										});
									}
									
							}, interval );	
						});
						
					},
					//set initial rotations
					configure			= function() {
						if($.browser.msie && !ieLte8)
							rotateMaskCorners();
						else if(ieLte8)
							hideMaskCorners();
							
						$listItems.each(function(i) {
							//the initial current is 1 
							//since we already showing the first image
							var $item = $(this).data('current', 1);
							
							if(!ieLte8){
								$item.rotate(parseInt($item.data('rotation'), 10));
								$item.find('img').rotate({
									center: origin
								});
							}
						});
					},
					//rotates the masks and corners
					rotateMaskCorners	= function() {
						$rm_mask_left.rotate(-3);
						$rm_mask_right.rotate(3);
						$rm_corner_left.rotate(45);
						$rm_corner_right.rotate(-45);
					},
					//hides the masks and corners
					hideMaskCorners		= function() {
						$rm_mask_left.hide();
						$rm_mask_right.hide();
						$rm_corner_left.hide();
						$rm_corner_right.hide();
					},
					startSlideshow		= function() {
						clearInterval(slideshowInterval);
						rotateImages(1);
						slideshowInterval	= setInterval(function() {
							rotateImages(1);
						}, slideshowTime);
						//show the pause button and hide the play button
						$rm_play.hide();
						$rm_pause.show();
					},
					stopSlideshow		= function() {
						clearInterval(slideshowInterval);
						//show the play button and hide the pause button
						$rm_pause.hide();
						$rm_play.show();
					};
				
				return {init : init};
			})();
			
		RotateImageMenu.init();
		return this;
	};
}(jQuery));