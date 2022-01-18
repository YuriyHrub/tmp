"use strict";

(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a;
        }

        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r);
        }, p, p.exports, r, e, n, t);
      }

      return n[i].exports;
    }

    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
      o(t[i]);
    }

    return o;
  }

  return r;
})()({
  1: [function (require, module, exports) {
    'use strict';

    var userAgent = ~navigator.userAgent.indexOf('Trident/7.0;');
    console.log(~navigator.userAgent.indexOf('Triedent/7.0;'));

    if (userAgent) {
      document.documentElement.classList.add('ie');
    } else {
      document.documentElement.classList.add('no-ie');
    }

    if (document.documentElement.classList.contains('ie')) {
      svg4everybody();
    }
    /* ===========================
      #Phone mask
    ============================= */


    var inputTelElements = document.querySelectorAll('#js-phone-mask');
    var maskOptions = {
      mask: '+{38}(000)000-00-00'
    };
    inputTelElements.forEach(function (inputElement) {
      IMask(inputElement, maskOptions);
    }); //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  }, {}]
}, {}, [1]);