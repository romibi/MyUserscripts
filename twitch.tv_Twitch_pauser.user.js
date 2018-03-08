// ==UserScript==
// @name         Twitch pauser
// @namespace    https://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/twitch.tv_Twitch_pauser.user.js
// @version      0.2
// @description  Pause the autoplaying video on Twitch.tv based on: https://webapps.stackexchange.com/a/106767
// @author       Zach Saucier, romibi
// @match        https://www.twitch.tv/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var mySetInvertal = setInterval(function() {
        //console.log("userscript pause twitch running");
        var playerdiv = document.querySelector(".featured-broadcasters .carousel-player .player");
        if(playerdiv !== null) {
            //var playerIframeDoc = playerIframe.contentWindow.document;
            //var videoElem = playerIframeDoc.querySelector("video");
            var playPause = playerdiv.querySelector(".qa-pause-play-button");

            //playerdiv.addEventListener("loadeddata", clickPlayButton(playPause));
            var paused = playerdiv.getAttribute('data-paused');
            //console.log(paused);
            if(paused===false || paused === "false") {
                //console.log("click");
                playPause.click();
                clearInterval(mySetInvertal);
            }
        }
    }, 100);
})();