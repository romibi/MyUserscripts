// ==UserScript==
// @name         Twitch pauser
// @namespace    https://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/twitch.tv_Twitch_pauser.user.js
// @version      0.4
// @description  Pause the autoplaying video on Twitch.tv based on: https://webapps.stackexchange.com/a/106767
// @author       Zach Saucier, romibi
// @match        https://www.twitch.tv/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var attempts = 50;
    var playerDivSelector = ".front-page-carousel .player"

    var mySetInvertal = setInterval(function() {
        var playerdiv = document.querySelector(playerDivSelector);
        if(playerdiv !== null) {
            var playPause = playerdiv.querySelector(".qa-pause-play-button");
            var playPauseLabel = playPause.querySelector(".player-tip").getAttribute("data-tip");
            var paused = playPauseLabel !== "Pause";

            if(!paused) {
                playPause.click();
                clearInterval(mySetInvertal);
            }
        } else {
            if(attempts--<0) {
                clearInterval(mySetInvertal);
            }
        }
    }, 100);
})();