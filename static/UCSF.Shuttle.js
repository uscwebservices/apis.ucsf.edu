var UCSF=UCSF||function(){"use strict";var e={_ie7q:[],serialize:function(e,t){var n=[];for(var s in e){var r=t?t+"["+s+"]":s,a=e[s];n.push("object"==typeof a?this.serialize(a,r):encodeURIComponent(r)+"="+encodeURIComponent(a))}return n.join("&")},createCORSRequest:function(e,t,n,s){var r=new XMLHttpRequest;return"withCredentials"in r?r.open(e,t,!0):"undefined"!=typeof XDomainRequest?(r=new XDomainRequest,r.open(e,t)):"undefined"!=typeof flensed&&"flXHR"in flensed?(r=new flensed.flXHR({xmlResponseText:!1,onreadystatechange:function(e){4===e.readyState&&(200===e.status&&n?n(JSON.parse(e.responseText)):s(e))},ontimeout:s,onerror:s}),r.open(e,t,!0)):r=null,r},createRequestString:function(e,t){var n=-1===e.indexOf("?")?"?":"&";return e+n+this.serialize(t)}};if(!e.createCORSRequest("GET","http://www.example.com/")){window.flensed={base_path:"http://apis.ucsf.edu/static/flensed/"};var t=document.createElement("script");t.src="http://apis.ucsf.edu/static/ie7_polyfill.js",t.onreadystatechange=function(){if("complete"===t.readyState||"loaded"===t.readyState)for(var n=e._ie7q.length,s=0;n>s;s++)e._ie7q[s].callee(e._ie7q[s].options,e._ie7q[s].success,e._ie7q[s].failure)},document.getElementsByTagName("head")[0].appendChild(t)}return e}();UCSF.Shuttle={stops:function(e,t,n){n=n||function(e){window.alert(e.statusText||"An error occurred. Please try again.")};var s=UCSF.createRequestString("http://apis.ucsf.edu/shuttle/stops",e),r=UCSF.createCORSRequest("GET",s,t,n);r?(r.onload=function(){t(JSON.parse(r.responseText))},r.onerror=n,r.send()):UCSF._ie7q.push({callee:UCSF.Shuttle.stops,options:e,success:t,failure:n})},plan:function(e,t,n){if(n=n||function(e){window.alert(e.statusText||"An error occurred. Please try again.")},!e||!e.hasOwnProperty("fromPlace")||!e.hasOwnProperty("toPlace"))return n({statusText:"Required options fromPlace and toPlace were not specified"}),void 0;var s=UCSF.createRequestString("http://apis.ucsf.edu/shuttle/plan",e),r=UCSF.createCORSRequest("GET",s,t,n);r?(r.onload=function(){t(JSON.parse(r.responseText))},r.onerror=n,r.send()):UCSF._ie7q.push({callee:UCSF.Shuttle.plan,options:e,success:t,failure:n})}};