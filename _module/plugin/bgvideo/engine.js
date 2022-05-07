bd.plugin.bgvideo = function() {
	this.init.apply(this, arguments);
};

bd.plugin.bgvideo.prototype = {
	isReady: false,
	brothers: [],

	// 初期化
	init: function() {
		bd.util.addCss(bindobj.moduleroot + '/plugin/bgvideo/style.css');
		head.load([
			bindobj.moduleroot + '/plugin/bgvideo/jquery.mb.YTPlayer.js'
		], jQuery.fnbind(this, this.callback));
	}
	
	,callback: function() {
		this.isReady = true;
	}

	,render: function( aElem ) {

		// sound button.
		if(aElem.className.indexOf('bgvideo-sound-') != -1){
			this.renderSound(aElem);
			return;
		}

		// get id
        var el = jQuery(aElem);
        var id = el.attr('id');
		if(!id) {
			return;
		}

		// get target class
		var targetClass = "";
		var classes = aElem.className.split(" ");
		for(var i = 0; i < classes.length; i++) {
			if(classes[i].indexOf('bgvideo-') == 0) {
				targetClass = classes[i];
				break;
			}
		}
		if(targetClass == "") {
			return;
		}

		// parse class (0000 + videoID11keta)
		var prms = targetClass.substring(8);
		if(prms.length < 15) {
			return;
		}

		// default
		var muteFlg = 'true';
		var loopFlg = 'true';
		// overwrite param
		var videoId = prms.substring(4);
		if(prms.substring(1,2) == '0') {
			muteFlg = 'false';
		}
		if(prms.substring(2,3) == '0') {
			loopFlg = 'false';
		}

		var muteCookie = this.cookie.getItem('bgvideo-sound');
		if(muteCookie == 0){
			muteFlg = 'false';
		}else if(muteCookie == 1){
			muteFlg = 'true';
		}
		
		var contain = '#' + id;
		if(id == 'page') {
			// page background
			contain = '#page';
		}
		// create playerTag and append
		var playerTag = document.createElement("div");
		playerTag.setAttribute("class", "player-" + id);

		playerTag.setAttribute("data-property", "{" +
			"videoURL:'" + PRTCL + "//www.youtube.com/watch?v=" + videoId + "'," +
			"containment:'" + contain + "'," +
			"autoPlay:true," +
			"showControls:false," +
			"mute:" + muteFlg + "," +
			"loop:" + loopFlg + "," +
			"startAt:0, opacity:1}");
		document.getElementById("page").appendChild(playerTag);
		// play
		jQuery(".player-" + id).mb_YTPlayer();
	}

	,renderSound: function(aElem){

		if (bindobj.isJQueryMobile || bindobj.isMobileOS || (bindobj.ie70 || bindobj.ie80)) {
			return;
		}

		var isMuted = true;
		jQuery(['#page'
			,'#area-header'
			,'#area-billboard'
			,'#area-contents'
			,'#area-main'
			,'#area-side-b'
			,'#area-side-a'
			,'#area-footer'].join(',')).each(function(){

			var targetClass = "";
			var classes = this.className.split(" ");
			for(var i = 0; i < classes.length; i++) {
				if(classes[i].indexOf('bgvideo-') == 0) {
					targetClass = classes[i];
					break;
				}
			}
			if(targetClass == "") {
				return;
			}

			// parse class (0000 + videoID11keta)
			var prms = targetClass.substring(8);
			if(prms.length < 15) {
				return;
			}

			if(prms.substring(1,2) == '0') {
				isMuted = false;
				return false;
			}
		});

		var muteSetting = this.cookie.getItem('bgvideo-sound');
		if(muteSetting == 0){
			isMuted = false;
		}else if(muteSetting == 1){
			isMuted = true;
		}
		
		this.brothers.push(aElem);
		var soundBtnPlugin = this;
		var setItem = this.cookie.setItem;

        var el = jQuery(aElem).click(function(){

        	var button = jQuery(this);

        	if(button.hasClass('mute')){
        		jQuery('.mb_YTPlayer').each(function(){
        			jQuery(this).unmuteYTP();
        		});
        		jQuery(soundBtnPlugin.brothers).removeClass('mute').addClass('speak');
        		setItem('bgvideo-sound', 0);
        	}else{
        		jQuery('.mb_YTPlayer').each(function(){
        			jQuery(this).muteYTP();
        		});
        		jQuery(soundBtnPlugin.brothers).removeClass('speak').addClass('mute');
        		setItem('bgvideo-sound', 1);
        	}
        });

        if(el.parents('.block > div > .type-2').length != 0){
        	el.addClass('black');
        }

        if(isMuted){
        	el.addClass('mute');
        }else{
        	el.addClass('speak');
        }

		el.css({
			'visibility': 'visible'
			,'opacity': 0
		}).animate({ opacity: 1 }, {
			complete:function() {
				bd.util.bdRefresh();
				Bindfooter.set();
			}
		});

	}

	,cookie: {
	  getItem: function (sKey) {
	    if (!sKey || !this.hasItem(sKey)) { return null; }
	    return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
	  },
	  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
	    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return; }
	    var sExpires = "";
	    if (vEnd) {
	      switch (vEnd.constructor) {
	        case Number:
	          sExpires = vEnd === Infinity ? "; expires=Tue, 19 Jan 2038 03:14:07 GMT" : "; max-age=" + vEnd;
	          break;
	        case String:
	          sExpires = "; expires=" + vEnd;
	          break;
	        case Date:
	          sExpires = "; expires=" + vEnd.toGMTString();
	          break;
	      }
	    }
	    document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
	  },
	  removeItem: function (sKey, sPath) {
	    if (!sKey || !this.hasItem(sKey)) { return; }
	    document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sPath ? "; path=" + sPath : "");
	  },
	  hasItem: function (sKey) {
	    return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	  },
	  keys: /* optional method: you can safely remove it! */ function () {
	    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
	    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = unescape(aKeys[nIdx]); }
	    return aKeys;
	  }
	}
}

