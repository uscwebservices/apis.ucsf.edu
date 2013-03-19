var UCSF = (function () {
    "use strict";

    // work queue for IE7 polyfill
    var _ie7q = [];

    var me = {

        serialize: function (obj, prefix) {
            var str = [];
            for (var p in obj) {
                var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                str.push(typeof v === "object" ?
                    this.serialize(v, k) :
                    encodeURIComponent(k) + "=" + encodeURIComponent(v));
            }
            return str.join("&");
        },

        createCORSRequest: function (method, url, success, failure) {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
                // XHR for Chrome/Firefox/Opera/Safari.
                xhr.open(method, url, true);
            } else if (typeof XDomainRequest !== "undefined") {
                // XDomainRequest for IE8+.
                xhr = new XDomainRequest();
                xhr.open(method, url);
            } else if ((typeof flensed !== "undefined") && "flXHR" in flensed) {
                // flensed.flXHR polyfill for IE7
                xhr = new flensed.flXHR({
                    xmlResponseText:false,
                    onreadystatechange:
                        function (XHRobj) {
                            if (XHRobj.readyState === 4) {
                                if (XHRobj.status === 200 && success) {
                                    success(JSON.parse(XHRobj.responseText));
                                } else {
                                    failure(XHRobj.statusText);
                                }
                            }
                        },
                    ontimeout: failure,
                    onerror: failure
                });
                xhr.open(method, url, true);
            } else {
                xhr = null;
            }
            return xhr;
        },

        createRequestString: function(url, options) {
            var separator = url.indexOf('?')===-1 ? '?' : '&';
            return url + separator + this.serialize(options);
        },

        Person: {
            search: function (options, success, failure ) {
                failure = failure || function (msg) {window.alert(msg);};
                var reqString = UCSF.createRequestString('http://apis.ucsf.edu/person/search', options);
                var xhr = UCSF.createCORSRequest('GET', reqString, success, failure);
                if (! xhr) {
                    _ie7q.push({options:options, success:success, failure:failure});
                } else {
                    xhr.onload = function () {
                        success(JSON.parse(xhr.responseText));
                    };
                    xhr.onerror = failure;
                    xhr.send();
                }
            }
        }
    };

    // Determine if CORS is supported. If not, load flXHR polyfill.
    // Needed for IE7 support. :-(
    if (! me.createCORSRequest('GET', 'http://www.example.com/')) {
        window.flensed={base_path:"http://apis.ucsf.edu/static/flensed/"};
        var polyfill = document.createElement('script');
        polyfill.src = 'http://apis.ucsf.edu/static/ie7_polyfill.js';
        polyfill.onreadystatechange = function () {
            if ((polyfill.readyState !== "complete") && (polyfill.readyState !== "loaded")) {
                return;
            }
            var length = _ie7q.length;
            for (var i=0; i<length; i++) {
                UCSF.Person.search(_ie7q[i].options, _ie7q[i].success, _ie7q[i].failure);
            }
        };
        document.body.appendChild(polyfill);
    }

    // End code specifically for IE7 support.
    return me;

}());