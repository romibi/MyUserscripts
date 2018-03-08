// ==UserScript==
// @name         Gyazo Auto Direct Link
// @namespace    http://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/gyazo.com_Auto_Direct_Link.user.js
// @version      0.1
// @description  automatically copy gyazo direct links to clipboard
// @author       romibi
// @match        https://gyazo.com/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        if(document.referrer=="") {
            $('.shr-menu-btn')[0].click();
            $('.share-menu-component .code-btn-box .operation-btn')[0].click();
            GM_setClipboard($($('.share-menu-component .code-btn-box .copy-area input')[0]).attr("value"));
            $('.shr-menu-btn')[0].click();
        }
    });
})();