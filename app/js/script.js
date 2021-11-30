'use strict';
let userAgent = ~navigator.userAgent.indexOf('Trident/7.0;');
console.log(~navigator.userAgent.indexOf('Triedent/7.0;'));
if(userAgent) {
  document.documentElement.classList.add('ie');
} else {
  document.documentElement.classList.add('no-ie')
}

if(document.documentElement.classList.contains('ie')) {
  svg4everybody();
}

/* ===========================
  #Phone mask
============================= */
let inputTelElements = document.querySelectorAll('#js-phone-mask');
let maskOptions = {
  mask: '+{38}(000)000-00-00'
};

inputTelElements.forEach(inputElement => {
  IMask(inputElement, maskOptions);
});
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


