// ==UserScript==
// @name         Twitch pauser
// @namespace    https://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/twitch.tv_Twitch_pauser.user.js
// @version      0.5
// @description  Pause the autoplaying video on Twitch.tv based on: https://webapps.stackexchange.com/a/106767
// @author       romibi
// @match        https://www.twitch.tv/*
// @grant        none
// ==/UserScript==

(function(oldPushstate) {
    'use strict';

    var attempts = 50;
    var playerDivSelector = ".front-page-carousel .player"

    var attemptsLeft = attempts;
    var wantedPauseStatus = null;
    var myInterval = null;
    var registeredPlayPauseEvent = false;

    var getPlayPause = function() {
        var playerdiv = document.querySelector(playerDivSelector);
        if(playerdiv !== null) {
            var playPause = playerdiv.querySelector(".qa-pause-play-button");
            if(!registeredPlayPauseEvent) {
                playPause.addEventListener("click", updateWantedPauseStatus );
            }
            return playPause;
        }
        return null;
    }

    var updateWantedPauseStatus = function() {
        setTimeout(function() {
            wantedPauseStatus=isPaused();
        },100);
    }

    var isPaused = function() {
        var playPause = getPlayPause();
        if(playPause===null) return null;
        var playPauseLabel = playPause.querySelector(".player-tip").getAttribute("data-tip");
        return playPauseLabel !== "Pause";
    }

    var myIntervalFunction = function() {
        var playPause = getPlayPause();
        if(playPause !== null) {
            if(!isPaused()) {
                playPause.click();
                clearInterval(myInterval);
            }
        } else {
            if(attemptsLeft--<0) {
                clearInterval(myInterval);
            }
        }
    };

    var preventUnpauseOnScroll = function() {
        var playPause = getPlayPause();
        if(playPause !== null) {
            var paused = isPaused();

            if(wantedPauseStatus!=null && wantedPauseStatus && !paused) {
                playPause.click();
                paused=!paused;
            }
            wantedPauseStatus = paused;
        }
    }

    var newPageInit = function() {
        attemptsLeft = attempts;
        registeredPlayPauseEvent = false;
        myInterval = setInterval(myIntervalFunction, 100);

        document.body.addEventListener("wheel", preventUnpauseOnScroll );
    }

    window.history.pushState = function () {
        oldPushstate.apply(window.history, arguments);
        clearInterval(myInterval);

        document.body.removeEventListener("wheel", preventUnpauseOnScroll);

        if(window.location.href.endsWith("twitch.tv/") || window.location.href.endsWith("twitch.tv")) {
            setTimeout(newPageInit,2000);
        }
    }

    if(window.location.href.endsWith("twitch.tv/") || window.location.href.endsWith("twitch.tv")) {
        newPageInit();
    }
})(window.history.pushState);