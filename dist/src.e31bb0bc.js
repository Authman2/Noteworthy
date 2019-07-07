// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/@authman2/mosaic/dist/index.js":[function(require,module,exports) {
var define;
parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"n1Wj":[function(require,module,exports) {
"use strict";function e(e){return n(e)||r(e)||t()}function t(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function r(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function n(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function s(e,t,r){return t&&a(e.prototype,t),r&&a(e,r),e}Object.defineProperty(exports,"__esModule",{value:!0});var c=require("./util"),u=function(){function t(e){o(this,t),this.config=e}return s(t,[{key:"step",value:function(e){for(var t=e,r=0;r<this.config.steps.length;r++){var n=this.config.steps[r];t=t.childNodes[n]}return t}},{key:"commit",value:function(e,t,r){var n=this.step(e);switch(this.config.type){case"node":this.commitNode(n,t,r);break;case"attribute":this.commitAttribute(n,t,r)}}},{key:"commitNode",value:function(e,t,r){if("object"===i(r)&&r.__isTemplate){var n=c.renderTemplate(r);e.replaceWith(n)}else if("object"===i(r)&&r.__isKeyedArray)this.commitArray(e,t,r);else{if(Array.isArray(r))throw new Error('Please do not use direct arrays in the view function as it is inefficient. Use the "Mosaic.list" function instead.');e.replaceWith(r)}}},{key:"commitAttribute",value:function(e,t,r){if(this.config.attribute){var n=this.config.attribute.name;if(!0===this.config.isEvent)this.commitEvent(e,n,t,r);else{var o=r;"object"===i(r)?o=JSON.stringify(r):"function"==typeof r?(o=r,e.removeAttribute(n)):o=r;var a=e.attributes.getNamedItem(n);if(!a)return c.isBooleanAttribute(n)&&!0===o&&e.setAttribute(n,"true"),!0===this.config.isComponentType&&"function"==typeof o?e.data[n]=o.bind(e):void 0;var s=a.value.replace(c.nodeMarker,o);if(e.setAttribute(n,s),c.isBooleanAttribute(n)&&(o?e.setAttribute(n,"true"):e.removeAttribute(n)),!0===this.config.isComponentType){try{return e.data[n]=JSON.parse(s)}catch(f){}var u=parseFloat(s);return isNaN(u)?e.data[n]=s:e.data[n]=u}}}}},{key:"commitEvent",value:function(e,t,r,n){var i=e.eventHandlers||{},o=t.substring(2);i[t]&&e.removeEventListener(o,i[t]),i[t]=n.bind(e),e.eventHandlers=i,e.addEventListener(o,e.eventHandlers[t]),e.removeAttribute(t)}},{key:"commitArray",value:function(t,r,n){if(r&&0!==r.length){for(var i=r.keys,o=n.keys,a=r.items,s=n.items,u=c.difference(i,o),f=u.additions,l=u.deletions,y=0;y<l.length;y++){var m=l[y].key,p=document.querySelector("[key='".concat(m,"']"));p&&p.remove()}for(var v=0;v<f.length;v++){var d=f[v],b=(m=d.key,d.index),h=b-(f.length+v),g=c.renderTemplate(s[b],m);if(a[h]){var A=i[h],k=document.querySelector("[key='".concat(A,"']"));c.insertAfter(g,k)}else c.insertAfter(g,t)}}else{var S=document.createDocumentFragment(),w=n.items.map(function(e,t){return c.renderTemplate(e,n.keys[t])});S.append.apply(S,e(w)),t.replaceWith(S)}}}]),t}();exports.default=u;
},{"./util":"Y/Oq"}],"CUYV":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./util"),t=require("./memory");function r(t){for(var r="",n=!1,a=t.length-1,o=0;o<a;o++){var s=t[o],i=s.lastIndexOf("\x3c!--");n=(i>-1||n)&&-1===s.indexOf("--\x3e",i+1);var u=e.lastAttributeNameRegex.exec(s);r+=null===u?s+e.nodeMarker:s.substring(0,u.index)+u[1]+u[2]+u[3]+e.nodeMarker}return r+=t[a]}function n(t){var r=[];return e.traverse(t.content,function(e,t){switch(e.nodeType){case 1:r=r.concat(a(e,t));break;case 3:r=r.concat(o(e,t));break;case 8:r=r.concat(s(e,t))}}),r}function a(r,n){if(!r.attributes)return[];for(var a=[],o=void 0!==customElements.get(r.nodeName.toLowerCase()),s=new RegExp("[a-z|A-Z| ]*".concat(e.marker,"[a-z|A-Z| ]*"),"g"),i=new RegExp("[a-z|A-Z| ]*".concat(e.nodeMarker,"[a-z|A-Z| ]*"),"g"),u=0;u<r.attributes.length;u++){var c=r.attributes[u],m=c.name,d=c.value;if(s.test(d)||i.test(d))for(var p=("style"===m?d.split(";"):d.split(" ")).filter(function(e){return e.length>0}),l=0;l<p.length;l++){var f=p[l];(f===e.nodeMarker||f===e.marker)&&a.push(new t.default({type:"attribute",steps:n,isComponentType:o,isEvent:m.startsWith("on"),attribute:{name:m}}))}}return a}function o(r,n){var a=void 0!==customElements.get(r.nodeName.toLowerCase());if(r.data===e.marker)return[new t.default({type:"node",steps:n,isComponentType:a})];for(var o=-1,s=[];-1!==(o=r.data.indexOf(e.marker,o+1));){var i=new t.default({type:"node",steps:n,isComponentType:a});s.push(i)}return s}function s(r,n){if(r.textContent!==e.marker)return[];var a=void 0!==customElements.get(r.nodeName.toLowerCase()),o=!1;return r.parentElement&&(o=void 0!==customElements.get(r.parentElement.nodeName.toLowerCase())),[new t.default({type:"node",steps:n,isComponentType:a||o})]}exports.buildHTML=r,exports.memorize=n;
},{"./util":"Y/Oq","./memory":"n1Wj"}],"Y/Oq":[function(require,module,exports) {
"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}Object.defineProperty(exports,"__esModule",{value:!0});var t=require("./parser");function r(e){return"string"==typeof e||"boolean"==typeof e||"number"==typeof e||"bigint"==typeof e}function n(e,t){return t.parentNode.insertBefore(e,t.nextSibling),e}function o(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];t&&t(e,r);for(var n=e.childNodes,i=0;i<n.length;i++)o(n[i],t,r.concat(i))}function i(e,r){var n=document.createElement("template");n.innerHTML=t.buildHTML(e.strings),n.memories=t.memorize(document.importNode(n,!0)),n.repaint=function(e,t,r){for(var n=0;n<this.memories.length;n++){var o=this.memories[n],i=t[n],s=r[n];a(i,s)&&o.commit(e,i,s)}};var o=document.importNode(n.content,!0);return n.repaint(o,[],e.values),r&&o.firstChild.setAttribute("key",r),o}function a(t,n){if(!t)return!0;if(t&&!n)return!0;if(r(n))return t!==n;if("function"==typeof n)return""+t!=""+n;if(Array.isArray(n))return""+t!=""+n;if("object"===e(n)){if(t.__isTemplate)return!n.__isTemplate||""+t.values!=""+n.values;if(!t.__isKeyedArray)return!Object.is(t,n);if(!n.__isKeyedArray)return!0;if(""+t.keys!=""+n.keys)return!0}return!1}function s(e,t){var r=[],n=[];return e.forEach(function(e,r){t.find(function(t){return e===t})||n.push({key:e,index:r})}),t.forEach(function(t,n){e.find(function(e){return t===e})||r.push({key:t,index:n})}),{deletions:n,additions:r}}exports.marker="{{m-".concat(String(Math.random()).slice(2),"}}"),exports.nodeMarker="\x3c!--".concat(exports.marker,"--\x3e"),exports.lastAttributeNameRegex=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=\/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/,exports.randomKey=function(){return Math.random().toString(36).slice(2)},exports.isPrimitive=r,exports.isBooleanAttribute=function(e){return"contenteditable|controlsdefault|defer|disabled|formNoValidate|frameborder|hidden|","indeterminate|ismap|loop|multiple|muted|nohref|noresizenoshade|novalidate|nowrap|","open|readonly|required|reversed|scoped|scrolling|seamless|selected|sortable|spell|","check|translate",new RegExp("async|autocomplete|autofocus|autoplay|border|challenge|checked|compact|contenteditable|controlsdefault|defer|disabled|formNoValidate|frameborder|hidden|indeterminate|ismap|loop|multiple|muted|nohref|noresizenoshade|novalidate|nowrap|open|readonly|required|reversed|scoped|scrolling|seamless|selected|sortable|spell|check|translate","gi").test(e)},exports.insertAfter=n,exports.traverse=o,exports.renderTemplate=i,exports.changed=a,exports.difference=s;
},{"./parser":"CUYV"}],"uXLq":[function(require,module,exports) {
"use strict";function e(t,r,n){return new Proxy(t,{get:function(t,s,u){return t[s]&&Array.isArray(t[s])?e(t[s],r,n):Reflect.get(t,s,u)},set:function(e,t,s,u){return r&&r(Object.assign({},e)),e[t]=s,n&&n(e),Reflect.set(e,t,s,u)}})}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=e;
},{}],"hPM2":[function(require,module,exports) {
"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}function e(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function r(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t}function o(e,n){return!n||"object"!==t(n)&&"function"!=typeof n?i(e):n}function i(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function u(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&l(t,e)}function c(t){var e="function"==typeof Map?new Map:void 0;return(c=function(t){if(null===t||!s(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,n)}function n(){return f(t,arguments,p(this).constructor)}return n.prototype=Object.create(t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),l(n,t)})(t)}function a(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}function f(t,e,n){return(f=a()?Reflect.construct:function(t,e,n){var r=[null];r.push.apply(r,e);var o=new(Function.bind.apply(t,r));return n&&l(o,n.prototype),o}).apply(null,arguments)}function s(t){return-1!==Function.toString.call(t).indexOf("[native code]")}function l(t,e){return(l=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function y(t){var e=document.createElement("mosaic-router");return e.element=t,e}Object.defineProperty(exports,"__esModule",{value:!0}),customElements.define("mosaic-router",function(t){function n(){var t;return e(this,n),(t=o(this,p(n).call(this))).data={},t.routes={},t.current="/",t.element=document.body,window.onpopstate=function(){var e=window.location.pathname;t.data=Object.assign({},t.data),t.render(e)},t}return u(n,c(HTMLElement)),r(n,[{key:"render",value:function(t){var e=this.routes[t];e||(this.notFound?(this.data.status=404,e=this.notFound):e=document.createElement("div")),this.innerHTML="",this.appendChild(e)}},{key:"addRoute",value:function(t,e){var n=this,r=function(t){e.router=n,n.routes[t]=e};if(Array.isArray(t))for(var o=0;o<t.length;o++)r(t[o]);else r(t)}},{key:"setNotFound",value:function(t){this.notFound=t}},{key:"send",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.current=t,this.data=Object.assign({},e),window.history.pushState({},this.current,window.location.origin+this.current),this.render(this.current)}},{key:"paint",value:function(){window.location.pathname!==this.current&&(this.current=window.location.pathname),this.render(this.current);var t="string"==typeof this.element?document.getElementById(this.element):this.element;t&&t.replaceWith(this)}}]),n}()),exports.default=y;
},{}],"pzHV":[function(require,module,exports) {
"use strict";function e(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function n(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function t(e,t,i){return t&&n(e.prototype,t),i&&n(e,i),e}Object.defineProperty(exports,"__esModule",{value:!0});var i=function(){function n(t,i){e(this,n),this.data=t,this.action=i,this.dependencies=new Set}return t(n,[{key:"get",value:function(e){return this.data[e]}},{key:"addDependency",value:function(e){this.dependencies.add(e)}},{key:"removeDependency",value:function(e){this.dependencies.delete(e)}},{key:"dispatch",value:function(e){var n=this,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!this.action)throw new Error("You must define an action in the Portfolio constructor before dispatching events.");Array.isArray(e)?e.forEach(function(e){return n.action(e,n.data,t)}):this.action(e,this.data,t),this.dependencies.forEach(function(e){return e.repaint()})}}]),n}();exports.default=i;
},{}],"Focm":[function(require,module,exports) {
"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e){return i(e)||r(e)||n()}function n(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function r(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function i(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function u(e,t,n){return t&&a(e.prototype,t),n&&a(e,n),e}function c(t,n){return!n||"object"!==e(n)&&"function"!=typeof n?s(t):n}function s(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function l(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&m(e,t)}function f(e){var t="function"==typeof Map?new Map:void 0;return(f=function(e){if(null===e||!h(e))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,n)}function n(){return p(e,arguments,y(this).constructor)}return n.prototype=Object.create(e.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),m(n,e)})(e)}function d(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}function p(e,t,n){return(p=d()?Reflect.construct:function(e,t,n){var r=[null];r.push.apply(r,t);var i=new(Function.bind.apply(e,r));return n&&m(i,n.prototype),i}).apply(null,arguments)}function h(e){return-1!==Function.toString.call(e).indexOf("[native code]")}function m(e,t){return(m=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function y(e){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}Object.defineProperty(exports,"__esModule",{value:!0});var v=require("./util"),b=require("./parser"),g=require("./observable"),w=require("./router");exports.Router=w.default;var O=require("./portfolio");exports.Portfolio=O.default;var j=function(e){var t=this,n=Object.assign({},e);this.data=g.default(n,function(e){!0!==t.barrierOn&&t.willUpdate&&t.willUpdate(e)},function(){!0!==t.barrierOn&&(t.repaint(),t.updated&&t.updated())})},E=function(){if(this.view){var e=this.view(),t=e.strings,n=(e.values,document.createElement("template"));n.id=this.tid,n.innerHTML=b.buildHTML(t),n.memories=b.memorize(document.importNode(n,!0)),n.repaint=function(e,t,n){for(var r=0;r<this.memories.length;r++){var i=this.memories[r],o=t[r],a=n[r];v.changed(o,a)&&i.commit(e,o,a)}},document.body.appendChild(n)}};function T(e){var n=v.randomKey(),r=Object.assign({},e.data);if(e.descendants)throw new Error('"Descendants" is a readonly property of Mosaics.');return e.data||(e.data={}),customElements.define(e.name,function(i){function a(){var r;o(this,a),(r=c(this,y(a).call(this))).tid=n,r.values=[],r.barrierOn=!1,r.name=e.name,r.descendants=document.createDocumentFragment();for(var i=Object.keys(e),u=0;u<i.length;u++){var s=i[u];"element"!==s&&(r[s]=e[s])}if(r.childNodes.length>0){var l,f=Array.from(r.childNodes);(l=r.descendants).append.apply(l,t(f)),r.innerHTML=""}return r}return l(a,f(HTMLElement)),u(a,[{key:"connectedCallback",value:function(){if(""===this.innerHTML){this.portfolio&&this.portfolio.addDependency(this);for(var t=0;t<this.attributes.length;t++){var i=this.attributes[t],o=i.name,a=i.value;e.data[o]=a}if(e.data)for(var u=Object.keys(e.data),c=0;c<u.length;c++){var s=u[c],l=e.data[s];l!==v.nodeMarker&&l!==v.marker||(e.data[s]=r[s])}if(j.call(this,e.data),!0!==this.delayTemplate||document.getElementById(n)){document.getElementById(this.tid)||E.call(this);var f=document.getElementById(this.tid),d=document.importNode(f.content,!0);this.innerHTML="",this.appendChild(d),this.repaint(),this.created&&this.created()}else this.created&&this.created()}else this.created&&this.created()}},{key:"disconnectedCallback",value:function(){this.portfolio&&this.portfolio.removeDependency(this),this.willDestroy&&this.willDestroy()}},{key:"paint",value:function(){var t="string"==typeof e.element?document.getElementById(e.element):e.element;if(!t)throw new Error("Could not find the base element ".concat(e.element,"."));t.appendChild(this)}},{key:"repaint",value:function(){var e=document.getElementById(this.tid);if(e||!0!==this.delayTemplate||(E.call(this),e=document.getElementById(this.tid)),!0===this.delayTemplate&&""===this.innerHTML){var t=document.importNode(e.content,!0);this.innerHTML="",this.appendChild(t)}if(this.view){var n=this.view().values;e.repaint(this,this.values,n),this.values=n}}},{key:"set",value:function(e){if(this.data){this.barrierOn=!0;for(var t=Object.keys(e),n=0;n<t.length;n++)this.data[t[n]]=e[t[n]];this.barrierOn=!1}else j.call(this,e);this.repaint()}}]),a}()),document.createElement(e.name)}exports.default=T,T.list=function(e,t,n){return{keys:e.map(function(e){return t(e)}),items:e.map(function(e,t){return n(e,t)}),__isKeyedArray:!0}},window.html=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return{strings:e,values:n,__isTemplate:!0}},window.Mosaic=T;
},{"./util":"Y/Oq","./parser":"CUYV","./observable":"uXLq","./router":"hPM2","./portfolio":"pzHV"}]},{},["Focm"], "Mosaic")
},{}],"pages/landing-page.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mosaic = _interopRequireDefault(require("@authman2/mosaic"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <h1>Noteworthy</h1>\n        <h3>Mac | iOS | iPad OS</h3>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = new _mosaic.default({
  name: 'landing-page',
  view: function view() {
    return html(_templateObject());
  }
});

exports.default = _default;
},{"@authman2/mosaic":"../node_modules/@authman2/mosaic/dist/index.js"}],"components/pill-button.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mosaic = _interopRequireDefault(require("@authman2/mosaic"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <button onpointerdown='", "'\n                onpointerup='", "'>\n            ", "\n        </button>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = new _mosaic.default({
  name: 'pill-button',
  view: function view() {
    return html(_templateObject(), this.touchDown, this.touchUp, this.data.title || '');
  },
  touchDown: function touchDown(e) {
    e.target.style.color = 'cornflowerblue';
    e.target.style.backgroundColor = 'white';
  },
  touchUp: function touchUp(e) {
    e.target.style.color = 'white';
    e.target.style.backgroundColor = 'rgba(0,0,0,0)';
  }
});

exports.default = _default;
},{"@authman2/mosaic":"../node_modules/@authman2/mosaic/dist/index.js"}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"styles/login-page.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"pages/login-page.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mosaic = _interopRequireDefault(require("@authman2/mosaic"));

require("../components/pill-button");

require("../styles/login-page.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        <h1>Noteworthy</h1>\n        <input type='email' placeholder='Email'>\n        <input type='password' placeholder='Password'>\n\n        <pill-button title='Login'></pill-button>\n        <pill-button title='Sign Up'></pill-button>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _default = new _mosaic.default({
  name: 'login-page',
  view: function view() {
    return html(_templateObject());
  }
});

exports.default = _default;
},{"@authman2/mosaic":"../node_modules/@authman2/mosaic/dist/index.js","../components/pill-button":"components/pill-button.js","../styles/login-page.less":"styles/login-page.less"}],"styles/index.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _mosaic = require("@authman2/mosaic");

var _landingPage = _interopRequireDefault(require("./pages/landing-page"));

var _loginPage = _interopRequireDefault(require("./pages/login-page"));

require("./styles/index.less");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _mosaic.Router('root');
router.addRoute('/', _landingPage.default);
router.addRoute('/login', _loginPage.default);
router.paint();
},{"@authman2/mosaic":"../node_modules/@authman2/mosaic/dist/index.js","./pages/landing-page":"pages/landing-page.js","./pages/login-page":"pages/login-page.js","./styles/index.less":"styles/index.less"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49790" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map