// ==UserScript==
// @name         Fix Youtube Fullscreen
// @namespace    https://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/youtube.com_Fix_Fullscreen.user.js
// @version      0.1
// @description  Fix annoying white bar at bottom of Fullscreen Video
// @author       romibi
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var observer = new MutationObserver(function(mutations) {
        var last = mutations[mutations.length-1].target;
        if(last.style.marginBottom!="" && last.style.marginBottom!="0px") {
            last.style.marginBottom="0px";
        }
    });
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['style'] });
})();