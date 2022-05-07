bd.plugin.bgstretch = function() {
	this.init.apply(this, arguments);
};

bd.plugin.bgstretch.prototype = {
	isReady: false,

	// 初期化
	init: function() {

		head.load([
			bindobj.moduleroot + '/plugin/bgstretch/jquery.backstretch.min.js'
		], jQuery.fnbind(this, this.callback));
	}
	
	,callback: function() {
		this.isReady = true;
	}

	,render: function( aElem ) {

		var el = jQuery(aElem);
		var url = el.data('background-url');

		// fail safe.
		if(url == null){
			return;
		}

		if(el.hasClass('wind-bg')){
			jQuery.backstretch(url);
		}else if(!el.hasClass('thunder-bg')){
			el.backstretch(url);
		}else if(el.hasClass('thunder-bg') && (aElem.className.indexOf('bgvideo-') != -1)){
			jQuery.backstretch(url);
		}
	}
}