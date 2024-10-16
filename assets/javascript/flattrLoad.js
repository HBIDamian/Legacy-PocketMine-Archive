var FlattrLoader = function() {
	"use strict";
	var t = {
		instance: !1,
		queryString: !1,
		validParams: ["mode", "https", "uid", "button", "language", "html5-key-prefix", "popout", "revsharekey"],
		validButtonParams: ["uid", "owner", "button", "title", "url", "revsharekey"],
		options: {},
		POPOUT_WIDTH: 400,
		POPOUT_HEIGHT: 80,
		TIMEOUT: 1500,
		activeButton: null,
		popout: null,
		eventHandlers: {
			unauthorized: function() {
				t.showPopoutForButton(t.activeButton)
			},
			popout_close_button_clicked: function() {
				t.removePopout()
			}
		},
		createIframe: function(t) {
			var e = "compact" == t.button,
				o = document.createElement("iframe");
			if (o.setAttribute("src", (1 == this.getParam("https") ? "https" : "http") + "://button.flattr." + this.getParam("domain", "com") + "/view/?e=1&" + this.encodeData(t)), o.setAttribute("class", "FlattrButton"), o.setAttribute("width", 1 == e ? 110 : 55), o.setAttribute("height", 1 == e ? 20 : 62), o.setAttribute("frameBorder", 0), o.setAttribute("scrolling", "no"), o.setAttribute("title", "Flattr"), o.setAttribute("border", 0), o.setAttribute("marginHeight", 0), o.setAttribute("marginWidth", 0), o.setAttribute("allowTransparency", "true"), o.data = t, 0 != t.popout) {
				var i = this;
				o.onmouseover = function() {
					i.activeButton = this
				}
			}
			return o
		},
		getAbsolutePositionForElement: function(t) {
			var e = {
				x: 0,
				y: 0
			};
			if (t.offsetParent)
				do {
					e.x += t.offsetLeft, e.y += t.offsetTop, t = t.offsetParent
				} while (t);
			return e
		},
		showPopoutForButton: function(e) {
			var o;
			null != t.popout && t.removePopout();
			var i = "s",
				n = "e",
				r = void 0 !== window.innerWidth ? window.innerWidth : document.documentElement.clientWidth,
				a = void 0 !== window.innerHeight ? window.innerHeight : document.documentElement.clientHeight,
				s = this.getAbsolutePositionForElement(e);
			s.x > r / 2 && (n = "w"), s.y + Number(e.height) + this.POPOUT_HEIGHT > a && (i = "n"), o = i + n, e.data.dir = o;
			var u = this.createPopoutIframe(e, e.data);
			"w" === n ? u.style.left = Number(s.x) - Number(this.POPOUT_WIDTH) + Number(e.width) + "px" : "e" === n && (u.style.left = s.x + "px"), "n" === i ? u.style.top = Number(s.y) - Number(this.POPOUT_HEIGHT) + "px" : "s" === i && (u.style.top = Number(s.y) + Number(e.height) + "px"), u.timeout = setTimeout(function() {
				t.popout && t.removePopout()
			}, 4 * t.TIMEOUT), t.popout = u, document.querySelector("body").appendChild(u)
		},
		createPopoutIframe: function(e, o) {
			var i = document.createElement("iframe");
			return i.setAttribute("src", (1 == this.getParam("https") ? "https" : "http") + "://button.flattr." + this.getParam("domain", "com") + "/popout/?" + this.encodeData(o)), i.setAttribute("frameBorder", 0), i.setAttribute("allowTransparency", "true"), i.setAttribute("style", "position: absolute; display:block; z-index: 9999;"), i.setAttribute("width", this.POPOUT_WIDTH), i.setAttribute("height", this.POPOUT_HEIGHT), i.onmouseover = function() {
				this.timeout && (clearTimeout(this.timeout), this.timeout = void 0)
			}, i.onmouseout = function() {
				this.parentNode && (this.timeout = setTimeout(function() {
					t.popout && t.removePopout()
				}, t.TIMEOUT))
			}, i
		},
		removePopout: function() {
			if (t.popout) {
				var e = t.popout;
				e.timeout && clearTimeout(e.timeout), e.parentNode.removeChild(e), t.popout = null
			}
		},
		encodeData: function(t) {
			var e, o, i = "";
			for (e in t) t.hasOwnProperty(e) && (o = (o = t[e]).replace(/^\s+|\s+$/g, "").replace(/\s{2,}|\t+/g, " "), i += e + "=" + encodeURIComponent(o) + "&");
			return i
		},
		getParam: function(t, e) {
			return void 0 !== this.options[t] ? this.options[t] : e
		},
		init: function() {
			try {
				if ("BackCompat" == document.compatMode) {
					var e = document.documentMode;
					if (void 0 != e && e < 8) return void(void 0 != console && console.log("The Flattr button requires the page to be rendered in Standards mode (IE8 or later)."))
				}
				var o, i, n, r, a, s, u, l, d, c, h, m = document.getElementsByTagName("script");
				for (o = m.length - 1; o >= 0; o--)
					if ((i = m[o]).hasAttribute("src") && (n = i.src, r = new RegExp("^(http(?:s?))://((?:(?:api|button).)?flattr.(com|test))", "i"), a = n.match(r))) {
						if (n.indexOf("button/load.js") && (this.options.mode = "d"), this.options.https = "https" == a[1].toString() ? 1 : 0, this.options.domain = a[3].toString(), s = n.indexOf("?"))
							for (u = n.substring(++s).split("&"), d = 0; d < u.length; d++) l = u[d].split("="), this.validParam(l[0], this.validParams) && (this.options[l[0]] = l[1]);
						this.instance = i;
						break
					} if (!this.instance) return
			} catch (t) {}
			switch (void 0 !== window.addEventListener ? (c = window.addEventListener, h = "message") : (c = window.attachEvent, h = "onmessage"), c(h, function(e) {
					var o;
					try {
						o = JSON.parse(e.data)
					} catch (t) {
						o = {}
					}
					"function" == typeof t.eventHandlers[o.flattr_button_event] && t.eventHandlers[o.flattr_button_event]()
				}, !1), this.getParam("mode", "sdk")) {
				case "d":
					this.options.mode = "direct";
				case "direct":
					this.render();
					break;
				case "auto":
				case "automatic":
					var p = this;
					this.domReady(function() {
						p.setup()
					})
			}
			return this
		},
		loadButton: function(t) {
			var e, o, i, n, r, a = {},
				s = null;
			for (e in this.options) this.options.hasOwnProperty(e) && this.validParam(e, this.validButtonParams) && (a[e] = this.options[e]);
			if (t.href && (a.url = t.href), t.getAttribute("title") && (a.title = t.getAttribute("title")), null !== (s = t.getAttribute("rev")) && "flattr" == s.substring(0, 6) || null !== (s = t.getAttribute("rel")) && "flattr" == s.substring(0, 6))
				for (s = s.substring(7).split(";"), o = 0; o < s.length; o++) n = (i = s[o].split(":")).shift(), this.validParam(n, this.validButtonParams) && (a[n] = i.join(":"));
			else
				for (r in this.validButtonParams) this.validButtonParams.hasOwnProperty(r) && null !== (s = t.getAttribute(this.getParam("html5-key-prefix", "data-flattr") + "-" + this.validButtonParams[r])) && (a[this.validButtonParams[r]] = s);
			this.replaceWith(t, this.createIframe(a))
		},
		render: function(t, e, o) {
			var i, n = {};
			for (i in this.options) this.options.hasOwnProperty(i) && this.validParam(i, this.validButtonParams) && (n[i] = this.options[i]);
			try {
				if (t)
					for (i in t) t.hasOwnProperty(i) && this.validParam(i, this.validButtonParams) && (n[i] = t[i]);
				else window.flattr_uid && (n.uid = window.flattr_uid), window.flattr_url && (n.url = window.flattr_url), window.flattr_btn && (n.button = window.flattr_btn), window.flattr_tle && (n.title = window.flattr_tle);
				var r = this.createIframe(n);
				if (e) switch ("string" == typeof e && (e = document.getElementById(e)), o) {
					case "before":
						e.parentNode.insertBefore(r, e);
						break;
					case "replace":
						this.replaceWith(e, r);
						break;
					case "append":
					default:
						e.appendChild(r)
				} else "direct" == this.getParam("mode", "manual") && this.replaceWith(this.instance, r)
			} catch (t) {}
		},
		replaceWith: function(t, e) {
			if ("string" == typeof e)
				if (void 0 !== document.documentElement.outerHTML) t.outerHTML = e;
				else {
					var o = document.createRange();
					o.selectNode(t), e = o.createContextualFragment(e), t.parentNode.replaceChild(e, t)
				} t.parentNode.replaceChild(e, t)
		},
		setup: function() {
			var t, e, o;
			if (document.querySelectorAll) try {
				o = document.querySelectorAll("a.FlattrButton")
			} catch (t) {}
			if (void 0 == o)
				for (o = [], e = (t = document.getElementsByTagName("a")).length - 1; e >= 0; e--) /FlattrButton/.test(t[e].className) && (o[o.length] = t[e]);
			for (e = o.length - 1; e >= 0; e--) this.loadButton(o[e])
		},
		validParam: function(t, e) {
			var o;
			for (o = 0; o < e.length; o++)
				if (e[o] == t) return !0;
			return !1
		}
	};
	return t
}();
! function(t, e) {
	function o(t) {
		for (c = 1; t = r.shift();) t()
	}
	var i, n, r = [],
		a = e.documentElement,
		s = a.doScroll,
		u = "DOMContentLoaded",
		l = "addEventListener",
		d = "onreadystatechange",
		c = /^loade|c/.test(e.readyState);
	e[l] && e[l](u, n = function() {
		e.removeEventListener(u, n, !1), o()
	}, !1), s && e.attachEvent(d, i = function() {
		/^c/.test(e.readyState) && (e.detachEvent(d, i), o())
	}), t.domReady = s ? function(e) {
		self != top ? c ? e() : r.push(e) : function() {
			try {
				a.doScroll("left")
			} catch (o) {
				return setTimeout(function() {
					t.domReady(e)
				}, 50)
			}
			e()
		}()
	} : function(t) {
		c ? t() : r.push(t)
	}
}(FlattrLoader, document), FlattrLoader.init();