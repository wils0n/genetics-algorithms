(function () {
if ( typeof unsafeWindow === "undefined") {
    unsafeWindow = ( function () {
        var dummyElem   = document.createElement('p');
        dummyElem.setAttribute ('onclick', 'return window;');
        return dummyElem.onclick ();
    } ) ();
}
function SB_setValue( cookieName, cookieValue, lifeTime ) {
	if( !cookieName ) { return; }
	if( lifeTime == "delete" ) { lifeTime = -10; } else { lifeTime = 31536000; }
	document.cookie = escape( cookieName ) + "=" + escape( getRecoverableString( cookieValue ) ) +
		";expires=" + ( new Date( ( new Date() ).getTime() + ( 1000 * lifeTime ) ) ).toGMTString() + ";path=/";
}
function SB_getValue( cookieName, oDefault ) {
	var cookieJar = document.cookie.split( "; " );
	for( var x = 0; x < cookieJar.length; x++ ) {
		var oneCookie = cookieJar[x].split( "=" );
		if( oneCookie[0] == escape( cookieName ) ) {
			try {
				eval('var footm = '+unescape( oneCookie[1] ));
			} catch(e) { return oDefault; }
			return footm;
		}
	}
	return oDefault;
}
function SB_xmlhttpRequest(details) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        var responseState = {
            responseXML:(xmlhttp.readyState==4 ? xmlhttp.responseXML : ''),
            responseText:(xmlhttp.readyState==4 ? xmlhttp.responseText : ''),
            readyState:xmlhttp.readyState,
            responseHeaders:(xmlhttp.readyState==4 ? xmlhttp.getAllResponseHeaders() : ''),
            status:(xmlhttp.readyState==4 ? xmlhttp.status : 0),
            statusText:(xmlhttp.readyState==4 ? xmlhttp.statusText : '')
        }
        if (details["onreadystatechange"]) {
            details["onreadystatechange"](responseState);
        }
        if (xmlhttp.readyState==4) {
            if (details["onload"] && xmlhttp.status>=200 && xmlhttp.status<300) {
                details["onload"](responseState);
            }
            if (details["onerror"] && (xmlhttp.status<200 || xmlhttp.status>=300)) {
                details["onerror"](responseState);
            }
        }
    }
    try {
      xmlhttp.open(details.method, details.url);
    } catch(e) {
      if( details["onerror"] ) {
        details["onerror"]({responseXML:'',responseText:'',readyState:4,responseHeaders:'',status:403,statusText:'Forbidden'});
      }
      return;
    }
    if (details.headers) {
        for (var prop in details.headers) {
            xmlhttp.setRequestHeader(prop, details.headers[prop]);
        }
    }
    xmlhttp.send((typeof(details.data)!='undefined')?details.data:null);
}
function SB_getResourceText(name) {
	for (var k in HTM_script.resources) {
		var r = HTM_script.resources[k];
		if (r.name == name) {
			return r.resText;
		}
	}
	return null;
};
function SB_addStyle(css) {
	var NSURI = 'http://www.w3.org/1999/xhtml';
	var hashead = document.getElementsByTagName('head')[0];
	var parentel = hashead || document.documentElement;
	var newElement = document.createElementNS(NSURI,'link');
	newElement.setAttributeNS(NSURI,'rel','stylesheet');
	newElement.setAttributeNS(NSURI,'type','text/css');
	newElement.setAttributeNS(NSURI,'href','data:text/css,'+encodeURIComponent(css));
	if( hashead ) {
		parentel.appendChild(newElement);
	} else {
		parentel.insertBefore(newElement,parentel.firstChild);
	}
}
function SB_getResourceURL(name) {
	for (var k in HTM_script.resources) {
		var r = HTM_script.resources[k];
		if (r.name == name) {
			return r.resURL;
		}
	}
	return null;
};

function getRecoverableString(oVar,notFirst) {
	var oType = typeof(oVar);
	if( ( oType == 'null' ) || ( oType == 'object' && !oVar ) ) {
		return 'null';
	}
	if( oType == 'undefined' ) { return 'window.uDfXZ0_d'; }
	if( oType == 'object' ) {
		if( oVar == window ) { return 'window'; }
		if( oVar == document ) { return 'document'; }
		if( oVar == document.body ) { return 'document.body'; }
		if( oVar == document.documentElement ) { return 'document.documentElement'; }
	}
	if( oVar.nodeType && ( oVar.childNodes || oVar.ownerElement ) ) { return '{error:\'DOM node\'}'; }
	if( !notFirst ) {
		Object.prototype.toRecoverableString = function (oBn) {
			if( this.tempLockIgnoreMe ) { return '{\'LoopBack\'}'; }
			this.tempLockIgnoreMe = true;
			var retVal = '{', sepChar = '', j;
			for( var i in this ) {
				if( i == 'toRecoverableString' || i == 'tempLockIgnoreMe' || i == 'prototype' || i == 'constructor' ) { continue; }
				if( oBn && ( i == 'index' || i == 'input' || i == 'length' || i == 'toRecoverableObString' ) ) { continue; }
				j = this[i];
				if( !i.match(basicObPropNameValStr) ) {
					for( var x = 0; x < cleanStrFromAr.length; x++ ) {
						i = i.replace(cleanStrFromAr[x],cleanStrToAr[x]);
					}
					i = '\''+i+'\'';
				} else if( window.ActiveXObject && navigator.userAgent.indexOf('Mac') + 1 && !navigator.__ice_version && window.ScriptEngine && ScriptEngine() == 'JScript' && i.match(/^\d+$/) ) {
					i = '\''+i+'\'';
				}
				retVal += sepChar+i+':'+getRecoverableString(j,true);
				sepChar = ',';
			}
			retVal += '}';
			this.tempLockIgnoreMe = false;
			return retVal;
		};
		Array.prototype.toRecoverableObString = Object.prototype.toRecoverableString;
		Array.prototype.toRecoverableString = function () {
			if( this.tempLock ) { return '[\'LoopBack\']'; }
			if( !this.length ) {
				var oCountProp = 0;
				for( var i in this ) { if( i != 'toRecoverableString' && i != 'toRecoverableObString' && i != 'tempLockIgnoreMe' && i != 'prototype' && i != 'constructor' && i != 'index' && i != 'input' && i != 'length' ) { oCountProp++; } }
				if( oCountProp ) { return this.toRecoverableObString(true); }
			}
			this.tempLock = true;
			var retVal = '[';
			for( var i = 0; i < this.length; i++ ) {
				retVal += (i?',':'')+getRecoverableString(this[i],true);
			}
			retVal += ']';
			delete this.tempLock;
			return retVal;
		};
		Boolean.prototype.toRecoverableString = function () {
			return ''+this+'';
		};
		Date.prototype.toRecoverableString = function () {
			return 'new Date('+this.getTime()+')';
		};
		Function.prototype.toRecoverableString = function () {
			return this.toString().replace(/^\s+|\s+$/g,'').replace(/^function\s*\w*\([^\)]*\)\s*\{\s*\[native\s+code\]\s*\}$/i,'function () {[\'native code\'];}');
		};
		Number.prototype.toRecoverableString = function () {
			if( isNaN(this) ) { return 'Number.NaN'; }
			if( this == Number.POSITIVE_INFINITY ) { return 'Number.POSITIVE_INFINITY'; }
			if( this == Number.NEGATIVE_INFINITY ) { return 'Number.NEGATIVE_INFINITY'; }
			return ''+this+'';
		};
		RegExp.prototype.toRecoverableString = function () {
			return '\/'+this.source+'\/'+(this.global?'g':'')+(this.ignoreCase?'i':'');
		};
		String.prototype.toRecoverableString = function () {
			var oTmp = escape(this);
			if( oTmp == this ) { return '\''+this+'\''; }
			return 'unescape(\''+oTmp+'\')';
		};
	}
	if( !oVar.toRecoverableString ) { return '{error:\'internal object\'}'; }
	var oTmp = oVar.toRecoverableString();
	if( !notFirst ) {
		delete Object.prototype.toRecoverableString;
		delete Array.prototype.toRecoverableObString;
		delete Array.prototype.toRecoverableString;
		delete Boolean.prototype.toRecoverableString;
		delete Date.prototype.toRecoverableString;
		delete Function.prototype.toRecoverableString;
		delete Number.prototype.toRecoverableString;
		delete RegExp.prototype.toRecoverableString;
		delete String.prototype.toRecoverableString;
	}
	return oTmp;
}
var _ = typeof module !== 'undefined' ? module.exports : {};
(function () {
  'use strict';
  function setupStack () {
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else if (!this.hasOwnProperty('stack')) {
      var stack = (new Error()).stack.split('\n').slice(2);
      var e = stack[0].match(/^.*@(.*):(\d*)$/);
      this.fileName = e[1];
      this.lineNumber = parseInt(e[2], 10);
      this.stack = stack.join('\n');
    }
  }
  function SafeBrowseError (message) {
    setupStack.call(this);
    this.message = message;
  }
  SafeBrowseError.prototype = Object.create(Error.prototype);
  SafeBrowseError.prototype.constructor = SafeBrowseError;
  SafeBrowseError.prototype.name = 'SafeBrowseError';
  SafeBrowseError.extend = function (protoProps, staticProps) {
    var parent = this, child = function () {
      setupStack.call(this);
      protoProps.constructor.apply(this, arguments);
    };
    extend(child, parent, staticProps);
    child.prototype = Object.create(parent.prototype);
    extend(child.prototype, protoProps);
    child.prototype.constructor = child;
    child.super = parent.prototype;
    return child;
  };
  SafeBrowseError.super = null;
  _.SafeBrowseError = SafeBrowseError;
  function any (c, fn) {
    if (c.some) {
      return c.some(fn);
    }
    if (typeof c.length === 'number') {
      return Array.prototype.some.call(c, fn);
    }
    return Object.keys(c).some(function (k) {
      return fn(c[k], k, c);
    });
  }
  function all (c, fn) {
    if (c.every) {
      return c.every(fn);
    }
    if (typeof c.length === 'number') {
      return Array.prototype.every.call(c, fn);
    }
    return Object.keys(c).every(function (k) {
      return fn(c[k], k, c);
    });
  }
  function each (c, fn) {
    if (c.forEach) {
      c.forEach(fn);
    } else if (typeof c.length === 'number') {
      Array.prototype.forEach.call(c, fn);
    } else {
      Object.keys(c).forEach(function (k) {
        fn(c[k], k, c);
      });
    }
  }
  function map (c, fn) {
    if (c.map) {
      return c.map(fn);
    }
    if (typeof c.length === 'number') {
      return Array.prototype.map.call(c, fn);
    }
    return Object.keys(c).map(function (k) {
      return fn(c[k], k, c);
    });
  }
  function extend(c) {
    Array.prototype.slice.call(arguments, 1).forEach(function (source) {
      if (!source) {
        return;
      }
      _.C(source).each(function (v, k) {
        c[k] = v;
      });
    });
    return c;
  }
  function CollectionProxy (collection) {
    this._c = collection;
  }
  CollectionProxy.prototype.size = function () {
    if (typeof this._c.length === 'number') {
      return this._c.length;
    }
    return Object.keys(c).length;
  };
  CollectionProxy.prototype.at = function (k) {
    return this._c[k];
  };
  CollectionProxy.prototype.each = function (fn) {
    each(this._c, fn);
    return this;
  };
  CollectionProxy.prototype.find = function (fn) {
    var result;
    any(this._c, function (value, index, self) {
      var tmp = fn(value, index, self);
      if (tmp !== _.nop) {
        result = {
          key: index,
          value: value,
          payload: tmp,
        };
        return true;
      }
      return false;
    });
    return result;
  };
  CollectionProxy.prototype.all = function (fn) {
    return all(this._c, fn);
  };
  CollectionProxy.prototype.map = function (fn) {
    return map(this._c, fn);
  };
  _.C = function (collection) {
    return new CollectionProxy(collection);
  };
  _.T = function (s) {
    if (typeof s === 'string') {
    } else if (s instanceof String) {
      s = s.toString();
    } else {
      throw new SafeBrowseError('el template debe ser un string');
    }
    var T = {
      '{{': '{',
      '}}': '}',
    };
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var kwargs = args[args.length-1];
      return s.replace(/\{\{|\}\}|\{([^\}]+)\}/g, function (m, key) {
        if (T.hasOwnProperty(m)) {
          return T[m];
        }
        if (args.hasOwnProperty(key)) {
          return args[key];
        }
        if (kwargs.hasOwnProperty(key)) {
          return kwargs[key];
        }
        return m;
      });
    };
  };
  _.P = function (fn) {
    if (typeof fn !== 'function') {
      throw new _.SafeBrowseError('se espera una funcion');
    }
    var slice = Array.prototype.slice;
    var args = slice.call(arguments, 1);
    return function () {
      return fn.apply(this, args.concat(slice.call(arguments)));
    };
  };
  _.nop = function () {
  };
  function log (method, args) {
    args = Array.prototype.slice.call(args);
    if (typeof args[0] === 'string' || args[0] instanceof String) {
      args[0] = 'SafeBrowse: ' + args[0];
    } else {
      args.unshift('SafeBrowse:');
    }
    var f = console[method];
    if (typeof f === 'function') {
      console[method].apply(console, args);
    }
  }
  _.info = function () {
    log('info', arguments);
  };
  _.warn = function () {
    log('warn', arguments);
  };
})();

var $;
(function () {
  'use strict';
  function bootstrap (context) {
    var _ = context._;
    var window = context.window;
    var unsafeWindow = context.unsafeWindow;
    var SB = context.SB;
    var document = window.document;
    var DomNotFoundError = _.SafeBrowseError.extend({
      name: 'DomNotFoundError',
      constructor: function (selector) {
        DomNotFoundError.super.constructor.call(this, _.T('`{0}` not found')(selector));
      },
    });
    var $ = function (selector, context) {
      if (!context || !context.querySelector) {
        context = document;
      }
      var n = context.querySelector(selector);
      if (!n) {
        throw new DomNotFoundError(selector);
      }
      return n;
    };
    $.$ = function (selector, context) {
      try {
        return $(selector, context);
      } catch (e) {
        _.info(e.message);
        return null;
      }
    };
    $.$$ = function (selector, context) {
      if (!context || !context.querySelectorAll) {
        context = document;
      }
      var ns = context.querySelectorAll(selector);
      return _.C(ns);
    };
    function deepJoin (prefix, object) {
      return _.C(object).map(function (v, k) {
        var key = _.T('{0}[{1}]')(prefix, k);
        if (typeof v === 'object') {
          return deepJoin(key, v);
        }
        return _.T('{0}={1}').apply(this, [key, v].map(encodeURIComponent));
      }).join('&');
    }
    function toQuery (data) {
      if (typeof data === 'string') {
        return data;
      }
      if (data instanceof String) {
        return data.toString();
      }
      return _.C(data).map(function (v, k) {
        if (typeof v === 'object') {
          return deepJoin(k, v);
        }
        return _.T('{0}={1}').apply(this, [k, v].map(encodeURIComponent));
      }).join('&');
    }
    function ajax (method, url, data, headers, callback) {
      var l = document.createElement('a');
      l.href = url;
      var reqHost = l.hostname;
      headers.Host = reqHost || window.location.host;
      headers.Origin = window.location.origin;
      headers.Referer = window.location.href;
      headers['X-Requested-With'] = 'XMLHttpRequest';
      var controller = SB.xmlhttpRequest({
        method: method,
        url: url,
        data: data,
        headers: headers,
        onload: function (response) {
          var headers = {
            get: function (key) {
              return this[key.toLowerCase()];
            },
          };
          response.responseHeaders.split(/[\r\n]+/g).filter(function (v) {
            return v.length !== 0;
          }).map(function (v) {
            return v.split(/:\s+/);
          }).forEach(function (v) {
            headers[v[0].toLowerCase()] = v[1];
          });
          callback(response.responseText, headers);
        },
      });
      return controller;
    }
    $.toDOM = function(rawHTML) {
      try {
        var parser = new DOMParser();
        var DOMHTML = parser.parseFromString(rawHTML, "text/html");
        return DOMHTML;
      } catch (e) {
        throw new _.SafeBrowseError('could not parse HTML to DOM');
      }
    };
    $.get = function (url, data, callback, headers) {
      data = toQuery(data);
      data = data!==''? '?' + data : '';
      headers = headers || {};
      return ajax('GET', url + data, '', headers, callback);
    };
    $.post = function (url, data, callback, headers) {
      data = toQuery(data);
      var h = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Content-Length': data.length,
      };
      if (headers) {
        _.C(headers).each(function (v, k) {
          h[k] = v;
        });
      }
      return ajax('POST', url, data, h, callback);
    };
    function go (path, params, method) {
      method = method || 'post';
      var form = document.createElement('form');
      form.method = method;
      form.action = path;
      _.C(params).each(function (value, key) {
          var input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    }
    $.openLinkByPost = function (url, data) {
      go(url, data, 'post');
    };
    $.openLink = function (to) {
      if (!to) {
        _.warn('URL falsa');
        return;
      }
      var from = window.location.toString();
      _.info(_.T('{0} -> {1}')(from, to));
      window.top.location.replace(to);
    };
    $.openLinkWithReferer = function (to) {
      if (!to) {
        _.warn('false URL');
        return;
      }
      var from = window.location.toString();
      _.info(_.T('{0} -> {1}')(from, to));
      window.location.href = to;
    };
    $.openImage = function (imgSrc) {
      if (config.redirectImage) {
        $.openLink(imgSrc);
      }
    };
    $.removeAllTimer = function () {
      var intervalID = window.setInterval(_.nop, 10);
      while (intervalID > 0) {
        window.clearInterval(intervalID--);
      }
    };
    $.enableScrolling = function () {
      var o = document.compatMode === 'CSS1Compat' ? document.documentElement : document.body;
      o.style.overflow = '';
    };
    function toggleShrinking () {
      this.classList.toggle('safebrowse-shrinked');
    }
    function checkScaling () {
      var nw = this.naturalWidth;
      var nh = this.naturalHeight;
      var cw = document.documentElement.clientWidth;
      var ch = document.documentElement.clientHeight;
      if ((nw > cw || nh > ch) && !this.classList.contains('safebrowse-resizable')) {
        this.classList.add('safebrowse-resizable');
        this.classList.add('safebrowse-shrinked');
        this.addEventListener('click', toggleShrinking);
      } else {
        this.removeEventListener('click', toggleShrinking);
        this.classList.remove('safebrowse-shrinked');
        this.classList.remove('safebrowse-resizable');
      }
    }
    function scaleImage (i) {
      //var style = SB.getResourceText('https://safebrowse.googlecode.com/svn/trunk/res/scale_image.css');
      SB.addStyle('#safebrowse-image.safebrowse-resizable{cursor:-webkit-zoom-out;cursor:-moz-zoom-out;cursor:zoom-out} #safebrowse-image.safebrowse-resizable.safebrowse-shrinked{max-width:100%;max-height:100%;cursor:-webkit-zoom-in;cursor:-moz-zoom-in;cursor:zoom-in}');
      if (i.naturalWidth && i.naturalHeight) {
        checkScaling.call(i);
      } else {
        i.addEventListener('load', checkScaling);
      }
      var h;
      window.addEventListener('resize', function () {
        window.clearTimeout(h);
        h = window.setTimeout(checkScaling.bind(i), 100);
      });
    }
    function changeBackground () {
      //var bgImage = SB.getResourceURL('https://safebrowse.googlecode.com/svn/trunk/res/grid.png');
      document.body.style.backgroundColor = '#222222';
      document.body.style.backgroundImage = _.T('url(\'{0}\')')('https://safebrowse.googlecode.com/svn/trunk/res/grid.png');
    }
    function alignCenter () {
      //var style = SB.getResourceText('https://safebrowse.googlecode.com/svn/trunk/res/align_center.css');
      SB.addStyle('html{height:100%}body{height:100%;margin:0} #safebrowse-wrapper{width:100%;height:100%;position:relative} #safebrowse-image{position:absolute;margin:auto;top:0;bottom:0;left:0;right:0}');
    }
    function injectStyle (d, i) {
      $.removeNodes('style, link[rel=stylesheet]');
      d.id = 'safebrowse-wrapper';
      i.id = 'safebrowse-image';
    }
    $.replace = function (imgSrc) {
      if (!config.redirectImage) {
        return;
      }
      if (!imgSrc) {
        _.warn('URL falsa');
        return;
      }
      _.info(_.T('reemplazando el body por `{0}` ...')(imgSrc));
      $.removeAllTimer();
      $.enableScrolling();
      document.body = document.createElement('body');
      var d = document.createElement('div');
      document.body.appendChild(d);
      var i = document.createElement('img');
      i.src = imgSrc;
      d.appendChild(i);
      if (config.alignCenter || config.scaleImage) {
        injectStyle(d, i);
      }
      if (config.alignCenter) {
        alignCenter();
      }
      if (config.changeBackground) {
        changeBackground();
      }
      if (config.scaleImage) {
        scaleImage(i);
      }
    };
    $.removeNodes = function (selector, context) {
      $.$$(selector, context).each(function (e) {
        e.parentNode.removeChild(e);
      });
    };
    function searchScriptsByRegExp (pattern, context) {
      var m = $.$$('script', context).find(function (s) {
        var m = s.innerHTML.match(pattern);
        if (!m) {
          return _.nop;
        }
        return m;
      });
      if (!m) {
        return null;
      }
      return m.payload;
    }
    function searchScriptsByString (pattern, context) {
      var m = $.$$('script', context).find(function (s) {
        var m = s.innerHTML.indexOf(pattern);
        if (m < 0) {
          return _.nop;
        }
        return m;
      });
      if (!m) {
        return null;
      }
      return m.value.innerHTML;
    }
    $.searchScripts = function (pattern, context) {
      if (pattern instanceof RegExp) {
        return searchScriptsByRegExp(pattern, context);
      } else if (typeof pattern === 'string') {
        return searchScriptsByString(pattern, context);
      } else {
        return null;
      }
    };
    $.setCookie = function (key, value) {
      var now = new Date();
      now.setTime(now.getTime() + 3600 * 1000);
      var tpl = _.T('{0}={1};path=/;');
      document.cookie = tpl(key, value, now.toUTCString());
    };
    $.getCookie = function (key) {
      var c = _.C(document.cookie.split(';')).find(function (v) {
        var k = v.replace(/^\s*(\w+)=.+$/, '$1');
        if (k !== key) {
          return _.nop;
        }
      });
      if (!c) {
        return null;
      }
      c = c.value.replace(/^\s*\w+=([^;]+).+$/, '$1');
      if (!c) {
        return null;
      }
      return c;
    };
    $.resetCookies = function () {
      var a = document.domain;
      var b = document.domain.replace(/^www\./, '');
      var c = document.domain.replace(/^(\w+\.)+?(\w+\.\w+)$/, '$2');
      var d = (new Date(1e3)).toUTCString();
      _.C(document.cookie.split(';')).each(function (v) {
        var k = v.replace(/^\s*(\w+)=.+$/, '$1');
        document.cookie = _.T('{0}=;expires={1};')(k, d);
        document.cookie = _.T('{0}=;path=/;expires={1};')(k, d);
        var e = _.T('{0}=;path=/;domain={1};expires={2};');
        document.cookie = e(k, a, d);
        document.cookie = e(k, b, d);
        document.cookie = e(k, c, d);
      });
    };
    $.captcha = function (imgSrc, cb) {
      if (!config.externalServerSupport) {
        return;
      }
      var a = document.createElement('canvas');
      var b = a.getContext('2d');
      var c = new Image();
      c.src = imgSrc;
      c.onload = function () {
        a.width = c.width;
        a.height = c.height;
        b.drawImage(c, 0, 0);
        var d = a.toDataURL();
        var e = d.substr(d.indexOf(',') + 1);
        $.post('http://www.wcpan.info/cgi-bin/captcha.cgi', {
          i: e,
        }, cb);
      };
    };
    var patterns = [];
    $.register = function (pattern) {
      patterns.push(pattern);
    };
    function load () {
      var tmp = {
        version: SB.getValue('version', 0),
        alignCenter: SB.getValue('align_center'),
        changeBackground: SB.getValue('change_background'),
        externalServerSupport: SB.getValue('external_server_support'),
        redirectImage: SB.getValue('redirect_image'),
        scaleImage: SB.getValue('scale_image'),
      };
      fixup(tmp);
      save(tmp);
      return tmp;
    }
    function save (c) {
      SB.setValue('version', c.version);
      SB.setValue('align_center', c.alignCenter);
      SB.setValue('change_background', c.changeBackground);
      SB.setValue('external_server_support', c.externalServerSupport);
      SB.setValue('redirect_image', c.redirectImage);
      SB.setValue('scale_image', c.scaleImage);
    }
    function fixup (c) {
      var patches = [
        function (c) {
          var ac = typeof c.alignCenter !== 'undefined';
          if (typeof c.changeBackground === 'undefined') {
            c.changeBackground = ac ? c.alignCenter : true;
          }
          if (typeof c.scaleImage === 'undefined') {
            c.scaleImage = ac ? c.alignCenter : true;
          }
          if (!ac) {
            c.alignCenter = true;
          }
          if (typeof c.redirectImage === 'undefined') {
            c.redirectImage = true;
          }
        },
        function (c) {
          if (typeof c.externalServerSupport === 'undefined') {
            c.externalServerSupport = false;
          }
        },
      ];
      while (c.version < patches.length) {
        patches[c.version](c);
        ++c.version;
      }
    }
    var config = null;
    $.register({
      rule: 'http://safebrowse.co/configure.html',
      ready: function () {
        unsafeWindow.commit = function (data) {
          data.version = config.version;
          _.C(data).each(function (v, k) {
            config[k] = v;
          });
          setTimeout(function () {
            save(data);
          }, 0);
        };
        unsafeWindow.render({
          version: config.version,
          options: {
            alignCenter: {
              type: 'checkbox',
              value: config.alignCenter,
              label: 'Align Center',
              help: 'Align image to the center if possible. (default: enabled)',
            },
            changeBackground: {
              type: 'checkbox',
              value: config.changeBackground,
              label: 'Change Background',
              help: 'Use Firefox-like image background if possible. (default: enabled)',
            },
            redirectImage: {
              type: 'checkbox',
              value: config.redirectImage,
              label: 'Redirect Image',
              help: [
                'Directly open image link if possible. (default: enabled)',
                'If disabled, redirection will only works on link shortener sites.',
              ].join('<br/>\n'),
            },
            scaleImage: {
              type: 'checkbox',
              value: config.scaleImage,
              label: 'Scale Image',
              help: 'When image loaded, scale it to fit window if possible. (default: enabled)',
            },
            externalServerSupport: {
              type: 'checkbox',
              value: config.externalServerSupport,
              label: 'External Server Support',
              help: [
                'Send URL information to external server to enhance features (e.g.: captcha resolving). (default: disabled)',
                'Affected sites:',
                'urlz.so (captcha)',
              ].join('<br/>\n'),
            },
          },
        });
      },
    });
    function dispatchByObject (rule, url_6) {
      var matched = {};
      var passed = _.C(rule).all(function (pattern, part) {
        if (pattern instanceof RegExp) {
          matched[part] = url_6[part].match(pattern);
        } else if (pattern instanceof Array) {
          var r = _.C(pattern).find(function (p) {
            var m = url_6[part].match(p);
            return m || _.nop;
          });
          matched[part] = r ? r.payload : null;
        }
        return !!matched[part];
      });
      return passed ? matched : null;
    }
    function dispatchByRegExp (rule, url_1) {
      return url_1.match(rule);
    }
    function dispatchByArray (rules, url_1, url_3, url_6) {
      var tmp = _.C(rules).find(function (rule) {
        var m = dispatch(rule, url_1, url_3, url_6);
        if (!m) {
          return _.nop;
        }
        return m;
      });
      return tmp ? tmp.payload : null;
    }
    function dispatchByString (rule, url_3) {
      var scheme = /\*|https?|file|ftp|chrome-extension/;
      var host = /\*|(\*\.)?([^\/*]+)/;
      var path = /\/.*/;
      var up = new RegExp(_.T('^({scheme})://({host})?({path})$')({
        scheme: scheme.source,
        host: host.source,
        path: path.source,
      }));
      var matched = rule.match(up);
      if (!matched) {
        return null;
      }
      scheme = matched[1];
      host = matched[2];
      var wc = matched[3];
      var sd = matched[4];
      path = matched[5];
      if (scheme === '*' && !/https?/.test(url_3.scheme)) {
        return null;
      } else if (scheme !== url_3.scheme) {
        return null;
      }
      if (scheme !== 'file' && host !== '*') {
        if (wc) {
          up = url_3.host.indexOf(sd);
          if (up < 0 || up + sd.length !== url_3.host.length) {
            return null;
          }
        } else if (host !== url_3.host) {
          return null;
        }
      }
      path = new RegExp(_.T('^{0}$')(path.replace(/[*.\[\]?+#]/g, function (c) {
        if (c === '*') {
          return '.*';
        }
        return '\\' + c;
      })));
      if (!path.test(url_3.path)) {
        return null;
      }
      return url_3;
    }
    function dispatchByFunction (rule, url_1, url_3, url_6) {
      return rule(url_1, url_3, url_6);
    }
    function dispatch (rule, url_1, url_3, url_6) {
      if (rule instanceof RegExp) {
        return dispatchByRegExp(rule, url_1);
      }
      if (rule instanceof Array) {
        return dispatchByArray(rule, url_1, url_3, url_6);
      }
      if (typeof rule === 'function') {
        return dispatchByFunction(rule, url_1, url_3, url_6);
      }
      if (typeof rule === 'string' || rule instanceof String) {
        return dispatchByString(rule, url_3);
      }
      return dispatchByObject(rule, url_6);
    }
    function findHandler () {
      var url_1 = window.location.toString();
      var url_3 = {
        scheme: window.location.protocol.slice(0, -1),
        host: window.location.host,
        path: window.location.pathname + window.location.search + window.location.hash,
      };
      var url_6 = {
        scheme: window.location.protocol,
        host: window.location.hostname,
        port: window.location.port,
        path: window.location.pathname,
        query: window.location.search,
        hash: window.location.hash,
      };
      var pattern = _.C(patterns).find(function (pattern) {
        var m = dispatch(pattern.rule, url_1, url_3, url_6);
        if (!m) {
          return _.nop;
        }
        return m;
      });
      if (!pattern) {
        return null;
      }
      var matched = pattern.payload;
      pattern = pattern.value;
      if (!pattern.start && !pattern.ready) {
        return null;
      }
      return {
        start: pattern.start ? _.P(pattern.start, matched) : _.nop,
        ready: pattern.ready ? _.P(pattern.ready, matched) : _.nop,
      };
    }
    function disableWindowOpen () {
      unsafeWindow.open = _.nop;
    }
    function disableLeavePrompt () {
      var seal = {
        set: function () {
          _.info('blocked onbeforeunload');
        },
      };
      _.C([unsafeWindow, unsafeWindow.document.body]).each(function (o) {
        if (!o) {
          return;
        }
        o.onbeforeunload = undefined;
        if (!/Safari/i.test(navigator.userAgent)) {
        	Object.defineProperty(o, 'onbeforeunload', seal);
		}
      });
    }
    $._main = function (isNodeJS) {
      delete $._main;
      if (isNodeJS) {
        config = load();
        return;
      }
      if (window.parent !== window.self) {
        return;
      }
      var handler = findHandler();
      if (!handler) {
        _.info('deshabilitado para `%s`', window.location.toString());
        return;
      }
      config = load();
      _.info('trabajando en\n%s \ncon\n%o', window.location.toString(), config);
      disableWindowOpen();
      handler.start();

      function addEvent(a, b, c) {
            if (a.addEventListener) {
                  return a.addEventListener(b, c, false);
            }
            return;
      }
      if (!/opera/i.test(navigator.userAgent)) {
            disableLeavePrompt();
            handler.ready();
      } else {
            addEvent(window, 'DOMContentLoaded', disableLeavePrompt);
            addEvent(window, 'DOMContentLoaded', ready);
      }

    };
    return $;
  }
  if (typeof module !== 'undefined') {
    module.exports = bootstrap;
  } else {
    $ = bootstrap({
      _: _,
      window: window,
      unsafeWindow: unsafeWindow,
      SB: {
        getValue: SB_getValue,
        setValue: SB_setValue,
        xmlhttpRequest: SB_xmlhttpRequest,
        getResourceText: SB_getResourceText,
        addStyle: SB_addStyle,
        getResourceURL: SB_getResourceURL,
      },
    });
  }
})();

$.register({
  rule: {
    host: /^01\.nl$/,
  },
  ready: function () {
    'use strict';
    var f = $('iframe#redirectframe');
    $.openLink(f.src);
  },
});

$.register({
  rule: {
    host: /^(www\.)?1be\.biz$/,
    path: /^\/s\.php$/,
    query: /^\?(.+)/,
  },
  start: function (m) {
    'use strict';
    $.openLink(m.query[1]);
  },
});

$.register({
  rule: {
    host: /^1pics\.ru$/,
  },
  ready: function () {
    'use strict';
    var img = $('img[alt="Бесплатный фотохостинг 1Pics.Ru"]');
    $.openImage(img.src);
  },
});

$.register({
  rule: {
    host: /^(www\.)?1tiny\.net$/,
    path: /\/\w+/
  },
  ready: function () {
    'use strict';
    var rUrl = /window\.location='([^']+)';/;
    var directUrl = $.$$('script').find(function (script) {
     var m = rUrl.exec(script.innerHTML);
      if (!m) {
       return _.nop;
      }
      return m[1];
    });
    if (!directUrl) {
      throw new _.SafeBrowseError('script content changed');
    }
    $.openLink(directUrl.payload);
  },
});

$.register({
  rule: {
    host: /^www\.(2i\.(sk|cz)|2imgs\.com)$/,
  },
  ready: function () {
    'use strict';
    var img = $('#wrap3 img');
    $.openImage(img.src);
  },
});

$.register({
  rule: {
    host: /^2ty\.cc$/,
    path: /^\/.+/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var a = $('#close');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /^(www\.)?3ra\.be$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var f = unsafeWindow.fc;
    if (!f) {
      throw new _.SafeBrowseError('window.fc is undefined');
    }
    f = f.toString();
    f = f.match(/href="([^"]*)/);
    if (!f) {
      throw new _.SafeBrowseError('url pattern outdated');
    }
    $.openLink(f[1]);
  },
});

$.register({
  rule: {
    host: /^(www\.)?4fun\.tw$/,
  },
  ready: function () {
    'use strict';
    var i = $('#original_url');
    $.openLink(i.value);
  },
});

$.register({
  rule: [
    'http://*.abload.de/image.php?img=*',
    'http://fastpic.ru/view/*.html',
    'http://www.imageup.ru/*/*/*.html',
    'http://itmages.ru/image/view/*/*',  // different layout same handler
  ],
  ready: function () {
    'use strict';
    var i = $('#image');
    $.openImage(i.src);
  },
});

(function () {
  'use strict';
  $.register({
    rule: {
      host: /^ad7.biz$/,
      path: /^\/\d+\/(.*)$/,
    },
    start: function (m) {
      $.removeNodes('iframe');
      var redirectLink = m.path[1];
      if (!redirectLink.match(/^https?:\/\//)) {
        redirectLink = "http://" + redirectLink;
      }
      $.openLink(redirectLink);
    },
  });
  $.register({
    rule: {
      host: /^ad7.biz$/,
      path: /^\/\w+$/,
    },
    ready: function () {
      $.removeNodes('iframe');
      var script = $.searchScripts('var r_url');
      var url = script.match(/&url=([^&]+)/);
      url = url[1];
      $.openLink(url);
    },
  });
})();

$.register({
  rule: {
    host: /^(www\.)?adb\.ug$/,
    path: /^(?!\/(?:privacy|terms|contact(\/.*)?|#.*)?$).*$/
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var m = $.searchScripts(/top\.location\.href="([^"]+)"/);
    if (m) {
      $.openLink(m[1]);
      return;
    }
    m = $.searchScripts(/\{_args.+\}\}/);
    if (!m) {
      throw new _.SafeBrowseError('script content changed');
    }
    m = eval('(' + m[0] + ')');
    var url = window.location.pathname + '/skip_timer';
    var i = setInterval(function () {
      $.post(url, m, function (text) {
        var jj = JSON.parse(text);
        if (!jj.errors && jj.messages) {
          clearInterval(i);
          $.openLink(jj.messages.url);
        }
      });
    }, 1000);
  },
});

(function () {
  'use strict';
  var hostRule = [
    /^(www\.)?adf\.(ly|acb\.im|sazlina\.com|animechiby\.com)$/,
    /^[jq]\.gs$/,
    /^go\.(phpnulledscripts|nicoblog-games)\.com$/,
    /^ay\.gy$/,
    /^(chathu|alien)\.apkmania\.co$/,
    /^ksn\.mx$/,
    /^goto\.adflytutor\.com$/,
    /^dl\.apkpro\.net$/,
	/^get\.apkhost\.com/,
    /^adf(ly\.itsrinaldo|\.tuhoctoan)\.net$/,
    /^.*\.gamecopyworld\.com$/,
    /^adv\.coder143\.com$/,
    /^(dl|david)\.nhachot\.info$/,
    /^file\.tamteo\.com$/,
    /^(n|u)\.shareme\.in$/,
    /^d?dl\.animesave\.(com|tk)$/,
  ];
  $.register({
    rule: {
      host: hostRule,
      path: /\/locked$/,
      query: /url=([^&]+)/,
    },
    start: function (m) {
      $.resetCookies();
      $.openLink('/' + m.query[1]);
    },
  });
  $.register({
    rule: {
      host: hostRule,
    },
    ready: function () {
      var h = $.$('#adfly_html'), b = $.$('#home');
      if (!h || !b || h.nodeName !== 'HTML' || b.nodeName !== 'BODY') {
        return;
      }
      $.removeNodes('iframe');
      h = unsafeWindow.eu;
      if (!h) {
        h = $('#adfly_bar');
        unsafeWindow.close_bar();
        return;
      }
      var a = h.indexOf('!HiTommy'), b = '';
      if (a >= 0) {
        h = h.substring(0, a);
      }
      a = '';
      for (var i = 0; i < h.length; ++i) {
        if (i % 2 === 0) {
          a = a + h.charAt(i);
        } else {
          b = h.charAt(i) + b;
        }
      }
      h = atob(a + b);
      h = h.substr(2);
      if (location.hash) {
        h += location.hash;
      }
      $.openLinkWithReferer(h);
    },
  });
})();
$.register({
  rule: 'http://adfoc.us/*',
  ready: function () {
    'use strict';
    var root = document.body;
    var observer = new MutationObserver(function (mutations) {
      var o = $.$('#showSkip');
      if (o) {
        observer.disconnect();
        o = o.querySelector('a');
        $.openLink(o.href);
      }
    });
    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  },
});

$.register({
  rule: {
    host: /^(www\.)?adjet\.biz$/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/href=(\S+)/);
    if (!m) {
      throw new _.SafeBrowseError('site changed');
    }
    $.openLink(m[1]);
  },
});

$.register({
  rule: {
    host: /^adlock\.org$/,
  },
  ready: function () {
    'use strict';
    var a = $.$('#xre a.xxr');
    if (a) {
      $.openLink(a.href);
      return;
    }
    a = unsafeWindow.fileLocation;
    if (a) {
      $.openLink(a);
    }
  },
});

$.register({
  rule: {
    host: /^(www\.)?adlot\.us$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var script = $.$$('script').find(function (v) {
      if (v.innerHTML.indexOf('form') < 0) {
        return _.nop;
      }
      return v.innerHTML;
    });
    var p = /name='([^']+)' value='([^']+)'/g;
    var opt = {
      image: ' ',
    };
    var tmp = null;
    while (tmp = p.exec(script.payload)) {
      opt[tmp[1]] = tmp[2];
    }
    $.openLinkByPost('', opt);
  },
});

$.register({
  rule: {
    host: /^(www\.)?ah-informatique\.com$/,
    path: /^\/ZipUrl/,
  },
  ready: function () {
    'use strict';
    var a = $('#zip3 a');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /^aka\.gr$/
  },
  ready: function () {
    'use strict';
    var l = $('iframe#yourls-frame');
    $.openLink(l.src);
  },
});

$.register({
  rule: {
    host: /alabout\.com$/,
  },
  ready: function () {
    'use strict';
    $.$$('a').each(function (a) {
      if (/http:\/\/(www\.)?alabout\.com\/j\.phtml\?url=/.test(a.href)) {
        a.href = a.textContent;
      }
    });
  },
});

$.register({
  rule: {
    host: /^freeimgup\.com$/,
    path: /^\/xxx/,
    query: /^\?v=([^&]+)/,
  },
  start: function (m) {
    'use strict';
    $.openImage('/xxx/images/' + m.query[1]);
  },
});
$.register({
  rule: {
    host: /^(b4he|freeimgup|fullimg)\.com|fastpics\.net|ifap\.co$/,
    query: /^\?v=([^&]+)/,
  },
  start: function (m) {
    'use strict';
    $.openImage('/images/' + m.query[1]);
  },
});

$.register({
  rule: {
    host: /^bayimg\.com$/,
  },
  ready: function () {
    'use strict';
    var i = $('#mainImage');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^gyazo\.com$/,
  },
  ready: function () {
    'use strict';
    var i = $('#gyazo_img');
    $.openImage(i.src);
  },
});

(function () {
  'use strict';
  $.register({
    rule: {
      host: /^bc\.vc$/,
      query: /^.+(https?:\/\/.+)/,
    },
    start: function (m) {
      $.openLink(m.query[1]);
    },
  });
  $.register({
    rule: {
      host: /^bc\.vc$/,
      path: /^.+(https?:\/\/.+)$/,
    },
    start: function (m) {
      $.openLink(m.path[1]);
    },
  });
  function decompress (script, unzip) {
    if (!unzip) {
      return script;
    }
    var matches = script.match(/eval(.*)/);
    matches = matches[1];
    script = eval(matches);
    return script;
  }
  function searchScript (unzip) {
    var content = $.$$('script').find(function (script) {
      if (script.innerHTML.indexOf('make_log') < 0) {
        return _.nop;
      }
      return script.innerHTML;
    });
    if (content) {
      return {
        direct: false,
        script: decompress(content.payload, unzip),
      };
    }
    content = $.$$('script').find(function (script) {
      if (script.innerHTML.indexOf('click_log') < 0) {
        return _.nop;
      }
      return script.innerHTML;
    });
    if (content) {
      return {
        direct: true,
        script: decompress(content.payload, unzip),
      };
    }
    throw _.SafeBrowseError('script changed');
  }
  function knockServer (script, dirtyFix) {
    var matches = script.match(/\$.post\('([^']*)'[^{]+(\{opt:'make_log'[^}]+\}\}),/i);
    var make_url = matches[1];
    var make_opts = eval('(' + matches[2] + ')');
    var i = setInterval(function () {
      $.post(make_url, make_opts, function (text) {
        if (dirtyFix) {
          text = text.match(/\{.+\}/)[0];
        }
        var jj = JSON.parse(text);
        if (jj.message) {
          clearInterval(i);
          $.openLink(jj.message.url);
        }
      });
    }, 1000);
  }
  function knockServer2 (script) {
    var post = unsafeWindow.$.post;
    unsafeWindow.$.post = function (a, b, c) {
      if (typeof c === 'function') {
        setTimeout(function () {
          var data = {
            error: false,
            message: {
              url: '#',
            },
          };
          c(JSON.stringify(data));
        }, 1000);
      }
    };
    var matches = script.match(/\$.post\('([^']*)'[^{]+(\{opt:'make_log'[^}]+\}\}),/i);
    var make_url = matches[1];
    var make_opts = eval('(' + matches[2] + ')');
    function makeLog () {
        make_opts.opt = 'make_log';
        post(make_url, make_opts, function (text) {
          var data = JSON.parse(text);
          _.info('make_log', data);
          if (!data.message) {
            checksLog();
            return;
          }
          $.openLink(data.message.url);
        });
    }
    function checkLog () {
      make_opts.opt = 'check_log';
      post(make_url, make_opts, function (text) {
        var data = JSON.parse(text);
        _.info('check_log', data);
        if (!data.message) {
          checkLog();
          return;
        }
        makeLog();
      });
    }
    function checksLog () {
      make_opts.opt = 'checks_log';
      post(make_url, make_opts, function () {
        _.info('checks_log');
        checkLog();
      });
    }
    checksLog();
  }
  $.register({
    rule: {
      host: /^bc\.vc$/,
      path: /^\/.+/,
    },
    ready: function () {
      $.removeNodes('iframe');
      var result = searchScript(false);
      if (!result.direct) {
        knockServer2(result.script);
      } else {
        result = result.script.match(/top\.location\.href = '([^']+)'/);
        if (!result) {
          throw new _.SafeBrowseError('script changed');
        }
        result = result[1];
        $.openLink(result);
      }
    },
  });
  function run (dirtyFix) {
    $.removeNodes('iframe');
    var result = searchScript(true);
    if (!result.direct) {
      knockServer(result.script,dirtyFix);
    } else {
      result = result.script.match(/top\.location\.href='([^']+)'/);
      if (!result) {
        throw new _.SafeBrowseError('script changed');
      }
      result = result[1];
      $.openLink(result);
    }
  }
  $.register({
    rule: {
      host: /^adcrun\.ch$/,
      path: /^\/\w+$/,
    },
    ready: function () {
      $.removeNodes('.user_content');
      var rSurveyLink = /http\.open\("GET", "api_ajax\.php\?sid=\d*&ip=[^&]*&longurl=([^"]+)" \+ first_time, (?:true|false)\);/;
      var l = $.searchScripts(rSurveyLink);
      if (l) {
        $.openLink(l[1]);
        return;
      }
      run(true);
    },
  });
  $.register({
    rule: {
      host: [
        /^gx\.si$/,
        /^adwat\.ch$/,
        /^(fly2url|urlwiz|xafox)\.com$/,
        /^(zpoz|ultry)\.net$/,
        /^(wwy|myam)\.me$/,
        /^ssl\.gs$/,
        /^link\.tl$/,
        /^hit\.us$/,
        /^shortit\.in$/,
        /^(adbla|tl7)\.us$/,
        /^www\.adjet\.eu$/,
        /^srk\.gs$/,
        /^cun\.bz$/,
        /^miniurl\.tk$/,
      ],
      path: /^\/.+/,
    },
    ready: run,
  });
  $.register({
    rule: {
      host: /^adtr\.im|ysear\.ch|xip\.ir$/,
      path: /^\/.+/,
    },
    ready: function () {
      var a = $.$('div.fly_head a.close');
      var f = $.$('iframe.fly_frame');
      if (a && f) {
        $.openLink(f.src);
      } else {
        run();
      }
    },
  });
  $.register({
    rule: {
      host: /^ad5\.eu$/,
      path: /^\/[^.]+$/,
    },
    ready: function() {
      $.removeNodes('iframe');
      var s = searchScript(true);
      var m = s.script.match(/(<form name="form1"method="post".*(?!<\\form>)<\/form>)/);
      if (!m) {return;}
      m = m[1];
      var tz = -(new Date().getTimezoneOffset()/60);
      m = m.replace("'+timezone+'",tz);
      var d = document.createElement('div');
      d.setAttribute('id','SafeBrowseFTW');
      d.setAttribute('style', 'display:none;');
      d.innerHTML = m;
      document.body.appendChild(d);
      $('#SafeBrowseFTW > form[name=form1]').submit();
    },
  });
  $.register({
    rule: {
      host: /^tr5\.in$/,
      path: /^\/.+/,
    },
    ready: function () {
      run(true);
    },
  });
})();

$.register({
  rule: {
    host: /^beeimg\.com$/,
  },
  ready: function () {
    'use strict';
    var img = $('img.img-responsive');
    $.openImage(img.src);
  },
});

$.register({
  rule: 'http://www.bild.me/bild.php?file=*',
  ready: function () {
    'use strict';
    var i = $('#Bild');
    $.openLink(i.src);
  },
});

$.register({
  rule: 'http://www.bilder-space.de/*.htm',
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var img = $('img.picture');
    $.openImage(img.src);
  },
});

$.register({
  rule: 'http://www.bilder-upload.eu/show.php?file=*',
  ready: function () {
    'use strict';
    var i = $('input[type=image]');
    $.openImage(i.src);
  },
});

$.register({
  rule: 'http://bildr.no/view/*',
  ready: function () {
    'use strict';
    var i = $('img.bilde');
    $.openLink(i.src);
  },
});

$.register({
  rule: 'http://blackcatpix.com/v.php?*',
  ready: function () {
    'use strict';
    var img = $('td center img');
    $.openImage(img.src);
  },
});

$.register({
  rule: {
    host: /^(www\.)?(buz|vzt)url\.com$/,
  },
  ready: function () {
    'use strict';
    var frame = $('frame[scrolling=yes]');
    $.openLink(frame.src);
  },
});

$.register({
  rule: {
    host: /^(cf|ex|xt)\d\.(me|co)$/,
  },
  ready: function (m) {
    'use strict';
    $.removeNodes('iframe');
    var a = $('#skip_button');
    $.openLink(a.href);
  },
});

$.register({
  rule: 'http://www.casimages.com/img.php?*',
  ready: function () {
    'use strict';
    var img = $('td a img');
    $.openImage(img.src);
  },
});

$.register({
  rule: {
    host: /^www\.x45x\.info|(imadul|mypixxx\.lonestarnaughtygirls)\.com|ghanaimages\.co|imgurban\.info|d69\.in|www\.images\.woh\.to$/,
    query: /\?p[mt]=(.+)/,
  },
  start: function (m) {
    'use strict';
    $.openImage('/?di=' + m.query[1]);
  },
});

$.register({
  rule: {
    host: /^cf\.ly$/,
    path: /^\/[^\/]+$/,
  },
  start: function (m) {
    'use strict';
    $.removeNodes('iframe');
    $.openLink('/skip' + m.path[0]);
  },
});

$.register({
  rule: 'http://javelite.tk/viewer.php?id=*',
  ready: function () {
    'use strict';
    var i = $('table img');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^imgchili\.(com|net)|www\.pixhost\.org$/,
    path: /^\/show\//,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe, #ad');
    try {
      $('#all').style.display = '';
    } catch (e) {
    }
    var o = $('#show_image');
    $.openImage(o.src);
  },
});

$.register({
  rule: {
    host: /^(www\.)?cli\.gs$/,
  },
  ready: function () {
    'use strict';
    var a = $('a.RedirectLink');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /^(www\.)?coin-ads\.com$/,
    path: /^\/.+/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/window\.location\.replace/);
    if (m) {
      return;
    }
    m = $.searchScripts(/countdownArea\.innerHTML = "([^"]+)"/);
    if (!m) {
      throw new _.SafeBrowseError('pattern changed');
    }
    m = m[1];
    var d = $.$('#area');
    if (d) {
      d.innerHTML = m;
      d = $('.skip', d);
      d.click();
      return;
    }
    d = $('#site');
    $.openLink(d.src);
  },
});

(function () {
  'use strict';
  $.register({
    rule: {
      host: /^(?:(\w+)\.)?(coinurl\.com|cur\.lv)$/,
      path: /^\/[-\w]+$/
    },
    ready: function (m) {
      $.removeNodes('iframe');
      if (m.host[1] == null) {
        var mainFrame = 'http://cur.lv/redirect_curlv.php?code=' + escape(window.location.pathname.substring(1));
      } else {
        var mainFrame = 'http://cur.lv/redirect_curlv.php?zone=' + m.host[1] + '&name=' + escape(window.location.pathname.substring(1));
      }
      $.get(mainFrame, {}, function(mainFrameContent) {
        try {
          var docMainFrame = $.toDOM(mainFrameContent);
        } catch (e) {
          throw new _.SafeBrowseError('main frame changed');
        }
        var rExtractLink = /onclick="open_url\('([^']+)',\s*'go'\)/;
        var innerFrames = $.$$('frameset > frame', docMainFrame).each(function (currFrame) {
          var currFrameAddr = window.location.origin + '/' + currFrame.getAttribute('src');
          $.get(currFrameAddr, {}, function(currFrameContent) {
            var aRealLink = rExtractLink.exec(currFrameContent);
            if (aRealLink == null || aRealLink[1] == null) {return;}
            var realLink = aRealLink[1];
            $.openLink(realLink);
          });
        });
      });
    },
  });
})();

$.register({
  rule: {
    host: /^comyonet\.com$/,
  },
  ready: function () {
    'use strict';
    var input = $('input[name="enter"]');
    input.click();
  },
});

$.register({
  rule: 'http://cubeupload.com/im/*',
  ready: function () {
    'use strict';
    var img = $('img.galleryBigImg');
    $.openImage(img.src);
  },
});

$.register({
  rule: {
    host: /^(www\.)?dapat\.in$/,
  },
  ready: function () {
    'use strict';
    var f = $('iframe[name=pagetext]');
    $.openLink(f.src);
  },
});

$.register({
  rule: {
    host: /^(www\.)?dd\.ma$/,
  },
  ready: function (m) {
    'use strict';
    var i = $.$('#mainframe');
    if (i) {
      $.openLink(i.src);
      return;
    }
    var a = $('#btn_open a');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /^(depic\.me|(www\.)?picamatic\.com)$/,
  },
  ready: function () {
    'use strict';
    var i = $('#pic');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^img(dino|tiger)\.com$/,
    path: /^\/viewer\.php$/,
    query: /^\?file=/,
  },
  ready: function () {
    'use strict';
    var o = $('#cursor_lupa');
    $.openImage(o.src);
  },
});

$.register({
  rule: 'http://*.directupload.net/file/*.htm',
  ready: function () {
    'use strict';
    var i = $('#ImgFrame');
    $.openImage(i.src);
  },
});

$.register({
  rule: 'http://www.dumppix.com/viewer.php?*',
  ready: function () {
    'use strict';
    var i = $.$('#boring');
    if (i) {
      $.openLink(i.src);
      return;
    }
    i = $('table td:nth-child(1) a');
    $.openLink(i.href);
  },
});

$.register({
  rule: {
    host: /^durl\.me$/,
  },
  ready: function () {
    'use strict';
    var a = $('a[class="proceedBtn"]');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /easyurl\.net|(atu|clickthru|redirects|readthis)\.ca|goshrink\.com$/,
  },
  ready: function () {
    'use strict';
    var f = $('frame[name=main]');
    $.openLink(f.src);
  },
});

$.register({
  rule: {
    host: /^emptypix\.com|overdream\.cz$/,
    path: /^\/image\//,
  },
  ready: function () {
    'use strict';
    var img = $('#full_image');
    $.openImage(img.src);
  },
});

$.register({
  rule: {
    host: /^(www\.)?filoops.info$/
  },
  ready: function () {
    'use strict';
    var a = $('#text > center a, #text > div[align=center] a');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /^fit\.sh$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('.container-body');
    var m = $.searchScripts(/token="([^"]+)"/);
    if (!m) {
      throw new _.SafeBrowseError('site changed');
    }
    m = m[1];
    var interLink = '/go/' + m + '?a=' + window.location.hash.substr(1);
    setTimeout(function () {
      $.openLink(interLink);
    }, 6000);
  },
});

$.register({
  rule: 'http://www.fotolink.su/v.php?id=*',
  ready: function () {
    'use strict';
    var i = $('#content img');
    $.openImage(i.src);
  },
});

(function () {
  'use strict';
  function run () {
    var i = $('#img_obj');
    $.openImage(i.src);
  }
  $.register({
    rule: 'http://fotoo.pl/show.php?img=*.html',
    ready: run,
  });
  $.register({
    rule: {
      host: /^www\.(fotoszok\.pl|imagestime)\.com$/,
      path: /^\/show\.php\/.*\.html$/,
    },
    ready: run,
  });
})();

$.register({
  rule: 'http://www.fotosik.pl/pokaz_obrazek/pelny/*.html',
  ready: function () {
    'use strict';
    var i = $('a.noborder img');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^freakimage\.com|www\.hostpic\.org$/,
    path: /^\/view\.php$/,
    query: /^\?filename=([^&]+)/,
  },
  start: function (m) {
    'use strict';
    $.openImage('/images/' + m.query[1]);
  },
});

(function () {
  'use strict';
  $.register({
    rule: {
      host: /^(www\.)?fundurl\.com$/,
      query: /i=([^&]+)/,
    },
    start: function (m) {
      $.openLink(m.query[1]);
    },
  });
  $.register({
    rule: {
      host: /^(www\.)?fundurl\.com$/,
      path: /^\/(go-\w+|load\.php)$/,
    },
    ready: function () {
      var f = $('iframe[name=fpage3]');
      $.openLink(f.src);
    },
  });
})();

$.register({
  rule: [
    'http://funkyimg.com/viewer.php?img=*',
    'http://funkyimg.com/view/*',
  ],
  ready: function () {
    'use strict';
    var i = $('#viewer img');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^gkurl\.us$/,
  },
  ready: function () {
    'use strict';
    var iframe = $('#gkurl-frame');
    $.openLink(iframe.src);
  },
});

$.register({
  rule: {
    host: /^u\.go2\.me$/,
  },
  ready: function () {
    'use strict';
    var iframe = $('iframe');
    $.openLink(iframe.src);
  },
});

(function () {
  'use strict';
  var hostRule = /^goimagehost\.com$/;
  $.register({
    rule: {
      host: hostRule,
      path: /^\/xxx\/images\//,
    },
  });
  $.register({
    rule: {
      host: hostRule,
      path: /^\/xxx\/(.+)/,
    },
    start: function (m) {
      $.openImage('/xxx/images/' + m.path[1]);
    },
  });
  $.register({
    rule: {
      host: hostRule,
      query: /^\?v=(.+)/,
    },
    start: function (m) {
      $.openImage('/xxx/images/' + m.query[1]);
    },
  });
})();

$.register({
  rule: {
    host: /www\.(h-animes|adultmove)\.info/,
    path: /^\/.+\/.+\/.+\.html$/,
  },
  ready: function () {
    'use strict';
    var a = $('.dlbutton2 > a');
    $.openImage(a.href);
  },
});

$.register({
  rule: 'http://www.hostingpics.net/viewer.php?id=*',
  ready: function () {
    'use strict';
    var i = $('#img_viewer');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^hotshorturl\.com$/,
  },
  ready: function () {
    'use strict';
    var frame = $('frame[scrolling=yes]');
    $.openLink(frame.src);
  },
});

$.register({
  rule: {
    host: /^ichan\.org$/,
    path: /^\/image\.php$/,
    query: /path=(.+)$/,
  },
  start: function (m) {
    'use strict';
    $.openImage('/' + m.query[1]);
  },
});
$.register({
  rule: {
    host: /ichan\.org$/,
  },
  ready: function () {
    'use strict';
    $.$$('a').each(function (a) {
      if (a.href.indexOf('/url/http://') > -1) {
        a.href = a.href.replace(/http:\/\/.+\/url\/(?=http:\/\/)/, '');
      }
    });
  },
});

$.register({
  rule: 'http://ifotos.pl/zobacz/*',
  ready: function () {
    'use strict';
    var m = $('meta[property="og:image"]');
    $.openImage(m.content);
  },
});

$.register({
  rule: {
    host: /^(www\.)?(ilix\.in|priva\.us)$/,
    path: /\/(\w+)/,
  },
  ready: function (m) {
    'use strict';
    var realHost = 'ilix.in';
    if (m.host[2] !== realHost) {
      var realURL = location.href.replace(m.host[2], realHost);
      $.openLink(realURL);
      return;
    }
    var f = $.$('iframe[name=ifram]');
    if (f) {
      $.openLink(f.src);
      return;
    }
    if (!$.$('img#captcha')) {
      $('form[name=frm]').submit();
    }
  },
});

$.register({
  rule: {
    host: /^ima\.so$/,
  },
  ready: function () {
    'use strict';
    var a = $('#image_block a');
    $.openImage(a.href);
  },
});

$.register({
  rule: [
    'http://image18.org/show/*',
    'http://screenlist.ru/details.php?image_id=*',
    'http://www.imagenetz.de/*/*.html',
  ],
  ready: function () {
    'use strict';
    var img = $('#picture');
    $.openImage(img.src);
  },
});

$.register({
  rule: {
    host: /^image2you\.ru$/,
    path: /^\/\d+\/\d+/,
  },
  ready: function () {
    'use strict';
    var i = $.$('div.t_tips2 div > img');
    if (!i) {
      $.openLinkByPost('', {
        _confirm: '',
      });
      return;
    }
    $.openImage(i.src);
  },
});

$.register({
  rule: 'http://imagearn.com/image.php?id=*',
  ready: function () {
    'use strict';
    var i = $('#img');
    $.openImage(i.src);
  },
});

$.register({
  rule: 'http://www.imagebam.com/image/*',
  ready: function () {
    'use strict';
    var o = $('#imageContainer img[id]');
    $.replace(o.src);
  },
});

$.register({
  rule: {
    host: /^imageban\.(ru|net)$/,
    path: /^\/show\/\d{4}\/\d{2}\/\d{2}\/.+/,
  },
  ready: function () {
    'use strict';
    var i = $('#img_obj');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^imageheli\.com|imgtube\.net|pixliv\.com$/,
    path: /^\/img-([a-zA-Z0-9]+)\..+$/,
  },
  ready: function () {
    'use strict';
    var a = $.$('a[rel="lightbox"]');
    if (!a) {
      $.openLinkByPost('', {
        browser_fingerprint: '',
        ads: '0',
      });
      return;
    }
    $.openImage(a.href);
  },
});

$.register({
  rule: 'http://www.imagehousing.com/image/*',
  ready: function () {
    'use strict';
    var i = $('td.text_item img');
    $.openImage(i.src);
  },
});

$.register({
  rule: 'http://imageno.com/*.html',
  ready: function () {
    'use strict';
    var i = $('#image_div img');
    $.openImage(i.src);
  },
});

$.register({
  rule: 'http://imagepix.org/image/*.html',
  ready: function () {
    'use strict';
    var i = $('img[border="0"]');
    $.openImage(i.src);
  },
});

(function () {
  'use strict';
  function run () {
    var o = $('#download_box img');
    $.openImage(o.src);
  }
  $.register({
    rule: {
      host: /^www\.imageporter\.com$/,
      path: /^\/\w{12}\/.*\.html$/,
    },
    ready: run,
  });
  $.register({
    rule: {
      host: /^(www\.)?(image(carry|dunk|porter|switch)|pic(leet|turedip|tureturn)|pixroute|imgspice)\.com|(piclambo|yankoimages)\.net$/,
    },
    ready: run,
  });
})();

$.register({
  rule: {
    host: /^imagescream\.com$/,
    path: /^\/img\/soft\//,
  },
  ready: function () {
    'use strict';
    var i = $('#shortURL-content img');
    $.openImage(i.src);
  },
});
$.register({
  rule: {
    host: /^(imagescream|anonpic|picturevip)\.com$/,
    query: /^\?v=/,
  },
  ready: function () {
    'use strict';
    var i = $('#imagen img');
    $.openImage(i.src);
  },
});

(function () {
  'use strict';
  var host = /^imageshack\.us$/;
  $.register({
    rule: {
      host: host,
      path: /^\/photo\/.+\/(.+)\/([^\/]+)/,
    },
    start: function (m) {
      $.openImage(_.T('/f/{0}/{1}/')(m.path[1], m.path[2]));
    },
  });
  $.register({
    rule: {
      host: host,
      path: /^\/f\/.+\/[^\/]+/,
    },
    ready: function () {
      var i = $('#fullimg');
      $.openImage(i.src);
    },
  });
})();

$.register({
  rule: 'http://imageshost.ru/photo/*/id*.html',
  ready: function () {
    'use strict';
    var a = $('#bphoto a');
    $.openImage(a.href);
  },
});

(function () {
  'use strict';
  function run () {
    unsafeWindow.$ = undefined;
    var i = $('img.pic');
    $.replace(i.src);
  }
  $.register({
    rule: {
      host: /^imagenpic\.com$/,
      path: /^\/.*\/.+\.html$/,
    },
    ready: run,
  });
  $.register({
    rule: {
      host: /^image(twist|cherry)\.com$/,
    },
    ready: run,
  });
})();

$.register({
  rule: 'http://imageupper.com/i/?*',
  ready: function () {
    'use strict';
    var i = $('#img');
    $.openImage(i.src);
  },
});

$.register({
  rule: [
    'http://*.imagevenue.com/img.php?*',
    'http://hotchyx.com/d/adult-image-hosting-view-08.php?id=*',
    'http://www.hostingfailov.com/photo/*',
  ],
  ready: function () {
    'use strict';
    var i = $('#thepic');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^imagezilla\.net$/,
    path: /^\/show\/(.+)$/,
  },
  start: function (m) {
    'use strict';
    $.openImage('/images/' + m.path[1]);
  },
});

$.register({
  rule: {
    host: /^imagik\.fr$/,
    path: /^\/view(-rl)?\/(.+)/,
  },
  start: function (m) {
    'use strict';
    $.openImage('/uploads/' + m.path[2]);
  },
});

$.register({
  rule: 'http://img.3ezy.net/*.htm',
  ready: function () {
    'use strict';
    var l = $('link[rel="image_src"]');
    $.openImage(l.href);
  },
});

$.register({
  rule: {
    host: /^img\.acianetmedia\.com$/,
    path: /^\/(image\/)?[^.]+$/,
  },
  ready: function () {
    'use strict';
    var img = $('#full_image, #shortURL-content img');
    $.openImage(img.src);
  },
});

$.register({
  rule: 'http://img1.imagilive.com/*/*',
  ready: function () {
    'use strict';
    var a = $.$('#page a.button');
    if (a) {
      $.redirect(a.href);
      return;
    }
    var i = $('#page > img:not([id])');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^img3x\.net$/,
  },
  ready: function () {
    'use strict';
    var f = $.$('form');
    if (f) {
      f.submit();
      return;
    }
    f = $('#show_image');
    $.openImage(f.src);
  },
});

$.register({
  rule: {
    host: /^www\.img(babes|flare)\.com$/,
  },
  ready: function () {
    'use strict';
    var i = $('#this_image');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^imgbar\.net$/,
    path: /^\/img_show\.php$/,
    query: /^\?view_id=/,
  },
  ready: function () {
    'use strict';
    var i = $('center img');
    $.openImage(i.src);
  },
});
$.register({
  rule: {
    host: /^imgbar\.net$/,
  },
  ready: function () {
    'use strict';
    var i = $('div.panel.top form input[name=sid]');
    $.openLink('/img_show.php?view_id=' + i.value);
  },
});

$.register({
  rule: {
    host: /^imgbin\.me$/,
    path: /^\/view\/([A-Z]+)$/,
  },
  start: function (m) {
    'use strict';
    var tpl = _.T('/image/{0}.jpg');
    $.openImage(tpl(m.path[1]));
  },
});

$.register({
  rule: {
    host: /^imgbox\.com$/,
    path: /^\/[\d\w]+$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var i = $('#img');
    $.openImage(i.src);
  },
});

$.register({
  rule: 'http://imgdollar.com/*/*.jpg.html',
  ready: function () {
    'use strict';
    var f = $('form[name="F1"]');
    f.submit();
  },
});

(function () {
  'use strict';
  var host = /^(img(fantasy|leech)|imagedomino)\.com$/;
  $.register({
    rule: {
      host: host,
      query: /^\?p=/,
    },
    ready: function () {
      var i = $('#container-home img');
      $.openImage(i.src);
    },
  });
  $.register({
    rule: {
      host: host,
      query: /^\?v=/,
    },
    ready: function () {
      if (unsafeWindow.confirmAge) {
        unsafeWindow.confirmAge(1);
        return;
      }
      var i = $('#container-home img');
      $.openImage(i.src);
    },
  });
})();

$.register({
  rule: {
    host: /^imglocker\.com$/,
    path: /^(\/\w+)\/([^.]+\.\w+)$/,
  },
  start: function (m) {
    'use strict';
    var url = _.T('//img.imglocker.com{0}_{1}');
    $.openImage(url(m.path[1], m.path[2]));
  },
});

$.register({
  rule: [
    {
      host: /^imgmega\.com$/,
      path: /^\/([^\/]+)\/.+\.jpg\.html$/,
    },
    {
      host: /^pic\.re$/,
      path: /^\/([^\/]+)$/,
    },
  ],
  ready: function (m) {
    'use strict';
    var i = $.$('img.pic');
    if (!i) {
      $.openLinkByPost('', {
        id: m.path[1],
        next: '',
        op: 'view',
        pre: 1,
      });
      return;
    }
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^imgpaying\.com$/,
  },
  ready: function () {
    'use strict';
    var i = $.$('img.pic');
    if (!i) {
      i = $('form');
      i.submit();
      return;
    }
    $.openImage(i.src);
  },
});

(function () {
  'use strict';
  function handler () {
    var node = $.$('#continuetoimage > form input');
    if (node) {
      node.click();
      return;
    }
    var o = $('img[alt="image"]');
    $.openImage(o.src);
  }
  $.register({
    rule: {
      host: /^(img(rill|next|savvy|\.spicyzilla)|image(corn|picsa)|www\.imagefolks|hosturimage|img-zone)\.com|img(candy|master)\.net|imgcloud\.co|pixup\.us|(www\.)?\.imgult\.com|(bulkimg|imgskull)\.info|image\.adlock\.org$/,
      path: /^\/img-.*\.html$/,
    },
    ready: handler,
  });
  $.register({
    rule: {
      host: /^08lkk\.com$/,
      path: /^\/\d+\/img-.*\.html$/,
    },
    ready: handler,
  });
})();

$.register({
  rule: 'http://imgtheif.com/image/*.html',
  ready: function () {
    'use strict';
    var a = $('div.content-container a');
    $.openImage(a.href);
  },
});

$.register({
  rule: {
    host: /^imgvault\.pw$/,
    path: /^\/view-image\//,
  },
  ready: function () {
    'use strict';
    var a = $('article div.span7 a[target="_blank"]');
    $.openImage(a.href);
  },
});

$.register({
  rule: 'http://ipic.su/?page=img&pic=*',
  ready: function () {
    'use strict';
    var i = $('#fz');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^ity\.im$/,
  },
  ready: function () {
    'use strict';
    var f = $.$('#main');
    if (f) {
      $.openLink(f.src);
      return;
    }
    f = $.$$('frame').find(function (frame) {
      if (frame.src.indexOf('interheader.php') < 0) {
        return _.nop;
      }
      return frame.src;
    });
    if (f) {
      $.openLink(f.payload);
      return;
    }
    f = $.searchScripts(/krypted=([^&]+)/);
    if (!f) {
      throw new _.SafeBrowseError('site changed');
    }
    f = f[1];
    var data = unsafeWindow.des('ksnslmtmk0v4Pdviusajqu', unsafeWindow.hexToString(f), 0, 0);
    if (data) {
      $.openLink('http://ity.im/1104_21_50846_' + data);
    }
  },
});

$.register({
  rule: {
    host: /keptarolo\.hu$/,
    path: /^(\/[^\/]+\/[^\/]+\.jpg)$/,
  },
  start: function (m) {
    'use strict';
    $.openImage('http://www.keptarolo.hu/kep' + m.path[1]);
  },
});

$.register({
  rule: {
    host: /^(www\.)?kingofshrink\.com$/,
  },
  ready: function () {
    'use strict';
    var l = $('#textresult > a');
    $.openLink(l.href);
  },
});

$.register({
  rule: 'http://www.lienscash.com/l/*',
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var a = $('#time a');
    $.openLink(a.id);
  },
});

$.register({
  rule: {
    host: /\.link2dollar\.com$/,
    path: /^\/\d+$/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/var rlink = '([^']+)';/);
    if (!m) {
      throw new _.SafeBrowseError('site changed');
    }
    m = m[1];
    $.openLink(m);
  },
});

$.register({
  rule: {
    host: /^link2you\.ru$/,
    path: /^\/\d+\/(.+)$/,
  },
  start: function (m) {
    'use strict';
    var url = m.path[1];
    if (!url.match(/^https?:\/\//)) {
      url = '//' + url;
    }
    $.openLink(url);
  },
});

(function() {
  'use strict';
  var hostRules = [
    /^(([\w]{8}|www)\.)?(allanalpass|cash4files|drstickyfingers|fapoff|freegaysitepass|(gone|tube)viral|(pic|tna)bucks|whackyvidz)\.com$/,
    /^(([\w]{8}|www)\.)?(a[mn]y|deb|dyo|sexpalace)\.gs$/,
    /^(([\w]{8}|www)\.)?(filesonthe|poontown|seriousdeals|ultrafiles|urlbeat)\.net$/,
    /^(([\w]{8}|www)\.)?freean\.us$/,
    /^(([\w]{8}|www)\.)?galleries\.bz$/,
    /^(([\w]{8}|www)\.)?hornywood\.tv$/,
    /^(([\w]{8}|www)\.)?link(babes|bucks)\.com$/,
    /^(([\w]{8}|www)\.)?(megaline|miniurls|qqc|rqq|tinylinks|yyv|zff)\.co$/,
    /^(([\w]{8}|www)\.)?(these(blog|forum)s)\.com$/,
    /^(([\w]{8}|www)\.)?youfap\.me$/,
    /^warning-this-linkcode-will-cease-working-soon\.www\.linkbucksdns\.com$/,
  ];
  $.register({
    rule: {
      host: hostRules,
      path: /^\/\w+\/url\/(.*)$/,
    },
    ready: function(m) {
      $.removeAllTimer();
      $.resetCookies();
      $.removeNodes('iframe');
      if (m.path[1] !== null) {
        $.openLink(m.path[1]);
      }
    }
  });
  $.register({
    rule: {
      host: hostRules,
    },
    ready: function () {
      $.removeAllTimer();
      $.resetCookies();
      $.removeNodes('iframe');
      if (window.location.pathname.indexOf('verify') >= 0) {
        $.openLink('../');
        return;
      }
      var script = $.$$('script').find(function (n) {
        if (n.innerHTML.indexOf('window[\'init\' + \'Lb\' + \'js\' + \'\']') < 0) {
          return _.nop;
        }
        return n.innerHTML;
      });
      if (!script) {
        _.warn('pattern changed');
        return;
      }
      script = script.payload;
      var m = script.match(/AdPopUrl\s*:\s*'.+\?ref=([\w\d]+)'/);
      var token = m[1];
      m = script.match(/=\s*(\d+);/);
      var ak = parseInt(m[1], 10);
      var re = /\+\s*(\d+);/g;
      var tmp = null;
      while((m = re.exec(script)) !== null) {
        tmp = m[1];
      }
      ak += parseInt(tmp, 10);
      _.info({
        t: token,
        aK: ak,
      });
      var i = setInterval(function () {
        $.get('/intermission/loadTargetUrl', {
          t: token,
          aK: ak,
        }, function (text) {
          var data = JSON.parse(text);
          _.info(data);
          if (!data.Success && data.Errors[0] === 'Invalid token') {
            window.location.reload();
            return;
          }
          if (data.Success && !data.AdBlockSpotted && data.Url) {
            clearInterval(i);
            $.openLink(data.Url);
          }
        });
      }, 1000);
    },
  });
})();
$.register({
  rule: 'http://lix.in/-*',
  ready: function () {
    'use strict';
    var i = $.$('#ibdc');
    if (i) {
      return;
    }
    i = $.$('form');
    if (i) {
      i.submit();
      return;
    }
    i = $('iframe');
    $.openLink(i.src);
  },
});

$.register({
  rule: {
    host: /^lnk\.in$/,
  },
  ready: function () {
    'use strict';
    var a = $('#divRedirectText a');
    $.openLink(a.innerHTML);
  },
});

$.register({
  rule: {
    host: /^(rd?)lnk\.co|reducelnk\.com$/,
    path: /^\/[^.]+$/,
  },
  ready: function () {
    'use strict';
    var f = $.$('iframe#dest');
    if (f) {
      $.openLink(f.src);
      return;
    }
    $.removeNodes('iframe');
    var o = $.$('#urlholder');
    if (o) {
      $.openLink(o.value);
      return;
    }
    o = $.$('#skipBtn');
    if (o) {
      o = o.querySelector('a');
      $.openLink(o.href);
      return;
    }
    o = document.title.replace(/(LNK.co|Linkbee)\s*:\s*/, '');
    $.openLink(o);
  },
});

$.register({
  rule: {
    host: /^lnx\.lu|url\.fm|z\.gs$/,
  },
  ready: function () {
    'use strict';
    var a = $('#clickbtn a');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /^lostpic\.net$/,
    query: /^\?photo=\d+$/,
  },
  ready: function () {
    'use strict';
    var i = $('img.notinline.circle');
    $.openImage(i.src);
  },
});

$.register({
  rule: function (uri_1, uri_3, uri_6) {
    if (!/^madlink\.sk$/.test(uri_6.host) || /\.html$/.test(uri_6.path)) {
      return null;
    }
    return uri_6.path.match(/^\/(.+)/);
  },
  start: function (m) {
    'use strict';
    $.removeNodes('iframe');
    $.post('/ajax/check_redirect.php', {
      link: m[1],
    }, function (text) {
      $.openLink(text);
    });
  },
});

(function () {
  'use strict';
  function helper (m) {
    $.openImage('/images/' + m.query[1]);
  }
  $.register({
    rule: {
      host: [
        /^(hentai-hosting|miragepics|funextra\.hostzi|imgrex)\.com$/,
        /^bilder\.nixhelp\.de$/,
        /^imagecurl\.(com|org)$/,
        /^imagevau\.eu$/,
        /^img\.deli\.sh$/,
        /^imgking\.us$/,
        /^image(pong|back)\.info$/,
        /^imgdream\.net$/,
      ],
      path: /^\/viewer\.php$/,
      query: /file=([^&]+)/,
    },
    start: helper,
  });
  $.register({
    rule: {
      host: /^(dwimg|imgsin|www\.pictureshoster)\.com$/,
      path: /^\/viewer\.php$/,
      query: /file=([^&]+)/,
    },
    start: function (m) {
      $.openImage('/files/' + m.query[1]);
    },
  });
  $.register({
    rule: {
      host: /imageview\.me|244pix\.com|imgnip\.com|postimg\.net$/,
      path: /^\/viewerr.*\.php$/,
      query: /file=([^&]+)/,
    },
    start: helper,
  });
  $.register({
    rule: {
      host: /^catpic\.biz$/,
      path: /^(\/\w)?\/viewer\.php$/,
      query: /file=([^&]+)/,
    },
    start: function (m) {
      var url = _.T('{0}/images/{1}');
      $.openImage(url(m.path[1] || '', m.query[1]));
    },
  });
  $.register({
    rule: [
      'http://www.overpic.net/viewer.php?file=*',
    ],
    ready: function () {
      var i = $('#main_img');
      $.openImage(i.src);
    },
  });
})();

$.register({
  rule: {
    host: /^www\.mrjh\.org$/,
    path: /^\/gallery\.php$/,
    query: /^\?entry=(.+)$/,
  },
  ready: function (m) {
    'use strict';
    var url = m.query[1];
    $.openImage('/' + url);
  },
});

$.register({
  rule: 'http://my-link.pro/*',
  ready: function () {
    'use strict';
    var i = $('iframe[scrolling=auto]');
    if (i) {
      $.openLink(i.src);
    }
  },
});

$.register({
  rule: {
    host: /^www\.noelshack\.com$/
  },
  ready: function () {
    var i = $('#elt_to_aff');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^nsfw\.in$/,
  },
  ready: function () {
    'use strict';
    var a = $('#long_url a');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /^nutshellurl\.com$/,
  },
  ready: function () {
    'use strict';
    var iframe = $('iframe');
    $.openLink(iframe.src);
  },
});

$.register({
  rule: {
    host: /^oxyl\.me$/,
  },
  ready: function () {
    'use strict';
    var l = $.$$('.links-container.result-form > a.result-a');
    if (l.size() > 1) {
      return;
    }
    $.openLink(l.at(0).href);
  },
});

$.register({
  rule: {
    host: /^p\.pw$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var m = $.searchScripts(/window\.location = "(.*)";/);
    m = m[1];
    $.openLink(m);
  },
});

$.register({
  rule: 'http://pic-money.ru/*.html',
  ready: function () {
    'use strict';
    var f = document.forms[0];
    var sig = $('input[name="sig"]', f).value;
    var pic_id = $('input[name="pic_id"]', f).value;
    var referer = $('input[name="referer"]', f).value;
    var url = _.T('/pic.jpeg?pic_id={pic_id}&sig={sig}&referer={referer}');
    $.openImage(url({
      sig: sig,
      pic_id: pic_id,
      referer: referer,
    }));
  },
});

$.register({
  rule: 'http://www.pic-upload.de/view-*.html',
  ready: function () {
    'use strict';
    $.removeNodes('.advert');
    var i = $('img.preview_picture_2b, img.original_picture_2b');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^pic(2profit|p2)\.com$/,
  },
  ready: function () {
    'use strict';
    var i = $('form > #d1 ~ input[name=bigimg]');
    $.openImage(i.value);
  },
});

$.register({
  rule: {
    host: /^pic(4|5)you.ru$/
  },
  ready: function () {
  if ($.$('#d1 > img') != null) {
    var URLparams = location.href.split("/", 5);
    var next = URLparams[0] + '/' + URLparams[1] + '/' + URLparams[2] + '/' + URLparams[3] + '/' + URLparams[4] + '/1/'; 
    $.setCookie('p4yclick','1');
    $.openLink(next);
  } else {
    var i = $('#d1 img').src;
    $.openImage(i);
  }
  },
});


$.register({
  rule: {
    host: /^(www\.)?piccash\.net$/
  },
  ready: function () {
  var i = $('.container > img');
  var m =i.onclick.toString().match(/mshow\('([^']+)'\);/);
  $.openImage(m[1]);
  },
});

$.register({
  rule: [
    'http://amateurfreak.org/share-*.html',
    'http://amateurfreak.org/share.php?id=*',
    'http://images.maxigame.by/share-*.html',
    'http://picfox.org/*',
    'http://www.euro-pic.eu/share.php?id=*',
    'http://www.gratisimage.dk/share-*.html',
    'http://xxx.freeimage.us/share.php?id=*',
    'http://npicture.net/share-*.html',
    'http://www.onlinepic.net/share.php?id=*',
    'http://www.pixsor.com/share.php?id=*',
  ],
  ready: function () {
    'use strict';
    var o = $('#iimg');
    $.openImage(o.src);
  },
});

$.register({
  rule: 'http://picmoe.net/d.php?id=*',
  ready: function () {
    'use strict';
    var i = $('img');
    $.openImage(i.src);
  },
});

$.register({
  rule: function (uri_1, uri_3, uri_6) {
    if (!/^pics-money\.ru$/.test(uri_6.host) || /^\/allpicfree\//.test(uri_6.path)) {
      return null;
    }
    return /^\/v\.php$/.test(uri_6.path);
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var i = $('center img:not([id])');
    $.openImage(i.src);
  },
});
$.register({
  rule: function (uri_1, uri_3, uri_6) {
    if (!/^www\.pics-money\.ru$/.test(uri_6.host) || /^\/allimage\//.test(uri_6.path)) {
      return null;
    }
    return true;
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var i = $('#d1 img');
    i = i.onclick.toString();
    i = i.match(/mshow\('(.+)'\)/);
    i = i[1];
    $.openImage(i);
  },
});

$.register({
  rule: 'http://picshare.geenza.com/pics/*',
  ready: function () {
    'use strict';
    var i = $('#picShare_image_container');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^pixhub\.eu$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe, .adultpage, #FFN_Banner_Holder');
    var i = $('.image-show img');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^pixpal\.net|imgsure\.com$/,
  },
  ready: function () {
    'use strict';
    var i = $('img.pic');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^postimg\.org$/,
  },
  ready: function () {
    'use strict';
    var i = $('body > center > img');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^prntscr\.com$/
  },
  ready: function () {
    'use strict';
    var i = $('#screenshot-image');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^qrrro\.com$/,
    path: /^(\/images\/.+)\.html$/,
  },
  start: function (m) {
    'use strict';
    $.openImage(m.path[1]);
  },
});

$.register({
  rule: {
    host: /^ref\.so$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var a = $('#btn_open a');
    $.openLink(a.href);
  },
});

$.register({
  rule: 'http://reffbux.com/refflinx/view/*',
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var m = $.searchScripts(/skip_this_ad_(\d+)_(\d+)/);
    var id = m[1];
    var share = m[2];
    var location = window.location.toString();
    $.post('http://reffbux.com/refflinx/register', {
      id: id,
      share: share,
      fp: 0,
      location: location,
      referer: '',
    }, function (text) {
      var m = text.match(/'([^']+)'/);
      if (!m) {
        throw new _.SafeBrowseError('pattern changed');
      }
      $.openLink(m[1]);
    });
  },
});

(function () {
  'use strict';
  function ready () {
    var i = $('img[class^=centred]');
    $.openImage(i.src);
  }
  $.register({
    rule: [
      {
        host: /^(image(decode|ontime)|(zonezeed|zelje|croft|myhot|dam)image|pic(\.apollon-fervor|stwist))\.com|(img(serve|coin|fap)|gallerycloud)\.net|hotimages\.eu|(imgstudio|dragimage)\.org$/,
        path: /^\/img-.*\.html$/,
      },
      'http://08lkk.com/Photo/img-*.html',
    ],
    ready: ready,
  });
  $.register({
    rule: 'http://www.imgadult.com/img-*.html',
    start: function () {
      var c = $.getCookie('user');
      if (c) {
        return;
      }
      $.setCookie('user', 'true');
      window.location.reload();
    },
    ready: ready,
  });
})();

$.register({
  rule: 'http://richlink.com/app/webscr?cmd=_click&key=*',
  ready: function () {
    'use strict';
    var f = $('frameset');
    f = f.onload.toString();
    f = f.match(/url=([^&]+)/);
    if (f) {
      f = decodeURIComponent(f[1]);
    } else {
      f = $('frame[name=site]');
      f = f.src;
    }
    $.openLink(f);
  },
});

$.register({
  rule: 'http://rijaliti.info/*.php',
  ready: function () {
    'use strict';
    var a = $('#main td[align="center"] a');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /^riurl\.com$/,
    path: /^\/.+/,
  },
  ready: function () {
    'use strict';
    var s = $.$('body script');
    if (s) {
      s = s.innerHTML.indexOf('window.location.replace');
      if (s >= 0) {
        return;
      }
    }
    $.openLinkByPost('', {
      hidden: '1',
      image: ' ',
    });
  },
});

$.register({
  rule: {
    host: /^preview\.rlu\.ru$/,
  },
  ready: function () {
    'use strict';
    var a = $('#content > .long_url > a');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /^robo\.us$/,
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var url = atob(unsafeWindow.fl);
    $.openLink(url);
  },
});

$.register({
  rule: {
    host: /^(www\.)?safeurl\.eu$/,
    path: /\/\w+/,
  },
  ready: function () {
    'use strict';
    var directUrl = $.searchScripts(/window\.open\("([^"]+)"\);/);
    if (!directUrl) {
      throw new _.SafeBrowseError('script content changed');
    }
    directUrl = directUrl[1];
    $.openLink(directUrl);
  },
});

$.register({
  rule: {
    host: /^(www\.)?(apploadz\.ru|seomafia\.net)$/
  },
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var a = $('table a');
    $.openLink(a.href);
  },
});

$.register({
  rule: /http:\/\/setlinks\.us\/(p|t|d).*/,
  ready: function () {
    'use strict';
    var k = $.searchScripts(/window\.location='([^']+)'/);
    if (k) {
      $.openLink(k[1]);
      return;
    }
    var aLinks = $.$$('div.links-container.result-form:not(.p-links-container) > span.dlinks > a');
    if (aLinks.size() === 1) {
      $.openLink(aLinks.at(0).href);
      return;
    }
    k = $('img[alt=captcha]');
    $.captcha(k.src, function (a) {
      var b = $('#captcha');
      var c = $('input[name=Submit]');
      b.value = a;
      c.click();
    });
  },
});

(function () {
  'use strict';
  function afterGotSessionId (sessionId) {
    var X_NewRelic_ID = $.searchScripts(/xpid:"([^"]+)"/);
    var Fingerprint = unsafeWindow.Fingerprint;
    var browserToken = null;
    if (Fingerprint) {
      browserToken = (new Fingerprint({canvas: !0})).get();
    } else {
      browserToken = Math.round((new Date()).getTime() / 1000);
    }
    var data = "sessionId=" + sessionId + "&browserToken=" + browserToken;
    var param = '?url=' + encodeURIComponent(window.location.href);
    var header = {
      Accept: 'application/json, text/javascript',
    };
    if (X_NewRelic_ID) {
      header['X-NewRelic-ID'] = X_NewRelic_ID;
    }
    var i = setInterval(function () {
      $.post('/adSession/callback' + param, data, function (text) {
        var r = JSON.parse(text);
        if (r.status == "ok" && r.destinationUrl) {
          clearInterval(i);
          $.openLink(r.destinationUrl);
        }
      }, header);
    }, 1000);
  }
  $.register({
    rule: {
      host: /^sh\.st|dh10thbvu\.com|u2ks\.com$/,
      path: /^\/[\d\w]+/,
    },
    ready: function () {
      $.removeNodes('iframe');
      var m = $.searchScripts(/sessionId: "([\d\w]+)",/);
      if (m) {
        afterGotSessionId(m[1]);
        return;
      }
      var o = MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          var m = $.searchScripts(/sessionId: "([\d\w]+)",/);
          if (m) {
            o.disconnect();
            afterGotSessionId(m[1]);
          }
        });
      });
      o.observe(document.body, {
        childList: true,
      });
    },
  });
})();

$.register({
  rule: {
    host: /^(www\.)?similarsites\.com$/,
    path: /^\/goto\/([^?]+)/
  },
  ready: function (m) {
    'use strict';
    var l = m.path[1];
    if (!/^https?:\/\//.test(l)) {
      l = 'http://' + l;
    }
    $.openLink(l);
  },
});

(function () {
  'use strict';
  $.register({
    rule: {
      host: /^www\.imagesnake\.com$/,
      path: /^\/index\.php$/,
      query: /^\?/,
    },
    ready: function () {
      var a = $('#tablewraper a:nth-child(2)');
      $.openImage(a.href);
    },
  });
  function run () {
    var i = $('#img_obj');
    $.openImage(i.src);
  }
  $.register({
    rule: {
      host: /^www\.(imagesnake|freebunker|imgcarry)\.com$/,
      path: /^\/show\//,
    },
    ready: run,
  });
  $.register({
    rule: {
      host: /^www\.imagefruit\.com$/,
      path: /^\/(img|show)\/.+/,
    },
    ready: run,
  });
})();

$.register({
  rule: {
    host: /^stash-coins\.com$/,
  },
  start: function () {
    'use strict';
    var url = window.location.toString();
    var i = url.lastIndexOf('http');
    url = url.substr(i);
    $.openLink(url);
  },
});

$.register({
  rule: 'http://www.subirimagenes.com/*.html',
  ready: function () {
    'use strict';
    var i = $('#ImagenVisualizada');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^thinfi\.com$/,
  },
  ready: function () {
    'use strict';
    var a = $('div p a');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /^tinyarrows\.com$/,
    path: /^\/preview\.php$/,
    query: /^\?page=([^&]+)/,
  },
  start: function (m) {
    'use strict';
    $.openLink(decodeURIComponent(m.query[1]));
  },
});

$.register({
  rule: 'http://tinypic.com/view.php?pic=*',
  ready: function () {
    'use strict';
    var i = $('#imgElement');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^www\.turboimagehost\.com$/,
  },
  ready: function () {
    'use strict';
    var i = $('#imageid');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^(www\.)?typ\.me$/,
  },
  ready: function (m) {
    'use strict';
    var a = $('#skipAdBtn');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /^(www\.)?ultshare\.com$/,
    path: /^\/(?:(?:\d-)?(\d+)|index\.php)$/,
    query: /^(?:\?a=\d&c=(\d+))?$/
  },
  ready: function (m) {
    'use strict';
    var linkId = m.path[1]?m.path[1]:m.query[1];
    var directLink = '/3-' + linkId;
    $.openLink(directLink);
  },
});

$.register({
  rule: {
    host: /^unfake\.it$/,
  },
  ready: function () {
    'use strict';
    var frame = $('frame');
    var i = frame.src.lastIndexOf('http://');
    $.openLink(frame.src.substr(i));
  },
});

$.register({
  rule: {
    host: /^(www\.)?(upan|gxp)\.so$/,
    path: /^\/\w+$/,
  },
  ready: function () {
    'use strict';
    var a = $('table.td_line a[onclick="down_process_s();"]');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /^url\.ie$/,
  },
  ready: function () {
    'use strict';
    var a = $('a[title="Link to original URL"]');
    $.openLink(a.href);
  },
});

$.register({
  rule: {
    host: /urlcash\.(com|net|org)|(bat5|detonating|celebclk|eightteen|smilinglinks|peekatmygirlfriend|pornyhost|clb1|urlgalleries)\.com|looble\.net|xxxs\.org$/,
  },
  ready: function () {
    'use strict';
    if (unsafeWindow && unsafeWindow.linkDestUrl) {
      $.openLink(unsafeWindow.linkDestUrl);
      return;
    }

    var matches = document.body.innerHTML.match(/linkDestUrl = '(.+)'/);
    if (matches) {
      $.openLink(matches[1]);
      return;
    }
  },
});

$.register({
  rule: {
    host: /^(www\.)?(urlcow|miniurl)\.com$/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/window\.location = "([^"]+)"/);
    if (!m) {
      throw new _.SafeBrowseError('site changed');
    }
    $.openLink(m[1]);
  },
});

$.register({
  rule: {
    host: /^urlinn\.com$/,
  },
  ready: function () {
    'use strict';
    var m = $('META[HTTP-EQUIV=refresh]').getAttribute('CONTENT').match(/url='([^']+)'/);
    if (m) {
      $.openLink(m[1]);
    }
  },
});

$.register({
  rule: {
    host: /^urlms\.com$/,
  },
  ready: function () {
    'use strict';
    var iframe = $('#content');
    $.openLink(iframe.src);
  },
});

$.register({
  rule: 'http://urlz.so/l/*',
  ready: function () {
    'use strict';
    var i = $.$('td > a');
    if (i) {
      i = i.href;
      var m = i.match(/javascript:declocation\('(.+)'\);/);
      if (m) {
        i = atob(m[1]);
      }
      $.openLink(i);
      return;
    }
    i = $('img');
    $.captcha(i.src, function (a) {
      var b = $('input[name=captcha]');
      var c = $('input[name=submit]');
      b.value = a;
      c.click();
    });
  },
});

$.register({
  rule: {
    host: /^www\.viidii\.info$/,
  },
  ready: function () {
    'use strict';
    var o = $('#directlink');
    $.openLink(o.href);
  },
});

$.register({
  rule: {
    host: /^(www\.)?vir\.al$/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/var target_url = '([^']+)';/);
    if (!m) {
      throw new _.SafeBrowseError('site changed');
    }
    $.openLink(m[1]);
  },
});

$.register({
  rule: 'http://vvcap.net/db/*.htp',
  ready: function () {
    'use strict';
    var i = $('img');
    $.replace(i.src);
  },
});

$.register({
  rule: {
    host: /^(www\.)?wzzq\.me$/,
  },
  ready: function () {
    'use strict';
    try {
      var l = $('#img_loading_table2  div.wz_img_hit a[target=_blank]').href;
      $.openLink(l);
    } catch (e) {
    }
  },
});

$.register({
  rule: {
    host: /^x\.pixfarm\.net$/,
    path: /^\/sexy\/\d+\/\d+\/.+\.html$/,
  },
  ready: function () {
    'use strict';
    var i = $('img');
    $.openImage(i.src);
  },
});

$.register({
  rule: {
    host: /^xlink.me$/
  },
  ready: function () {
    'use strict';
    var a = $('#main_form > center > a');
    if (!a) {return;}
    $.openLink(a.href);
  },
});

$.register({
  rule: 'http://yep.it/preview.php?p=*',
  ready: function () {
    'use strict';
    var link = $('font[color="grey"]').innerHTML;
    $.openLink(link);
  },
});

$.register({
  rule: {
    host: /\.yfrog\.com$/,
  },
  ready: function () {
    'use strict';
    if (/^\/z/.test(window.location.pathname)) {
      var i = $('#the-image img');
      $.openImage(i.src);
      return;
    }
    var a = $.$('#continue-link a, #main_image');
    if (a) {
      $.openLink('/z' + window.location.pathname);
      return;
    }
  },
});

$.register({
  rule: 'http://www.yooclick.com/l/*',
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    var uniq = unsafeWindow.uniq || unsafeWindow.uniqi;
    if (!uniq) {return;}
    var path = window.location.pathname;
    var url = _.T('{0}?ajax=true&adblock=false&old=false&framed=false&uniq={1}')(path, uniq);
    var getURL = function() {
      $.get(url, {
      }, function (text) {
        var goodURL = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(text);
        if (goodURL) {
          $.openLink(text);
        } else {
          setTimeout(getURL, 500);
        }
      });
    }
    getURL();
  },
});

$.register({
  rule: 'http://zo.mu/redirector/process?link=*',
  ready: function () {
    'use strict';
    $.removeNodes('iframe');
    window.location.reload();
  },
});

$.register({
  rule: {
    host: /^zzz\.gl$/,
  },
  ready: function () {
    'use strict';
    var m = $.searchScripts(/var domainurl = '([^']+)';/);
    if (!m) {
      throw new _.SafeBrowseError('site changed');
    }
    $.openLink(m[1]);
  },
});
$.register({
  rule: 'http://links.itaringa.net/go?*',
  ready: function () {
    'use strict';
    var url = decodeURIComponent(location.search.replace("?", ""));
    $.openLink(url);
  },
});
$.register({
  rule: 'http://re-direcciona.me/*',
  ready: function () {
    'use strict';
	if (document.getElementsByTagName("meta")[3].content){
		$.removeNodes('body');
		var url = document.getElementsByTagName("meta")[3].content;
		$.openLink(url.replace(/20; URL=/,""))
	};
  },
});
$.register({
  rule: 'http://www.argentinawarez.com/go/?*',
  ready: function () {
    'use strict';
    var url = decodeURIComponent(location.search.replace("?", ""));
    $.openLink(url);
  },
});
$.register({
  rule: {
    host: /^(www\.)?gratis(programas|juegos|peliculas|musica)\.org$/,
  },
  ready: function () {
    'use strict';
    $.setCookie('publi_adf', '1');
    $.$$('#decrypt').each(function (a) {
    a.click();
    a.value = 'SafeBrowse.co - '+a.value;
});

  },
});
$.register({
  rule: {
    host: /(u|i)denti\.li$/,
  },
  ready: function () {
    'use strict';
	$.setCookie('ads_accepted', '1');
	$.$$('#decrypt').each(function (a) {
		a.click();
        a.value = 'SafeBrowse.co';
    });
  },
});
$.register({
  rule: {
    host: /anonymbucks\.com$/,
  },
  ready: function () {
    'use strict';
	var a = $('#boton-continuar');
    if (!a) {return;}
	a.click();
  },
});
$.register({
  rule: {
    host: /lik\.cl$/,
  },
  ready: function () {
    'use strict';
	if (document.getElementsByTagName("meta")[5].content){
		$.removeNodes('body');
		var url = document.getElementsByTagName("meta")[5].content;
		$.openLink(url.replace(/10; URL=/,""))
	};
  },
});
$._main();
})();