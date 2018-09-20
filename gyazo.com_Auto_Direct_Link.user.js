// ==UserScript==
// @name         Gyazo Auto Direct Link
// @namespace    http://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/gyazo.com_Auto_Direct_Link.user.js
// @version      0.2
// @description  automatically copy gyazo direct links to clipboard
// @author       romibi
// @match        https://gyazo.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';
    if(document.referrer=="") {
        GM_setClipboard(document.querySelector('link[rel="image_src"]').href);
    }
})();