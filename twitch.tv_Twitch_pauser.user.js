// ==UserScript==
// @name         Twitch pauser
// @namespace    https://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/twitch.tv_Twitch_pauser.user.js
// @version      0.6
// @description  Pause the autoplaying video on Twitch.tv based on: https://webapps.stackexchange.com/a/106767
// @author       romibi
// @match        https://www.twitch.tv/*
// @grant        none
// ==/UserScript==

(function(oldPushstate) {
    'use strict';

    var attempts = 50;
    var playerDivSelector = ".front-page-carousel .player"
    var playPauseSelector = ".qa-pause-play-button";
    var streamStatusSelector = ".player-streamstatus";

    var attemptsLeft = attempts;
    var wantedPauseStatus = null;
    var myInterval = null;
    var registeredPlayPauseEvent = false;
    var debugLog = false;

    var log = function(text) {
        if(debugLog) {
            console.log("TwitchPauser: "+text);
        }
    }

    var getPlayPause = function() {
        var playerdiv = document.querySelector(playerDivSelector);
        if(playerdiv !== null) {
            var playPause = playerdiv.querySelector(playPauseSelector);
            if(!registeredPlayPauseEvent) {
                playPause.addEventListener("click", updateWantedPauseStatus );
            }
            return playPause;
        }
        return null;
    }

    var getStreamStatus = function() {
        var playerdiv = document.querySelector(playerDivSelector);
        if(playerdiv !== null) {
            return playerdiv.querySelector(streamStatusSelector);
        }
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

    var isOffline = function() {
        var streamStatus = getStreamStatus();
        if(streamStatus===null) return null;
        var streamStatusTip = streamStatus.querySelector(".player-tip").getAttribute("data-tip");
        return streamStatusTip === "offlineStatus";
    }

    var myIntervalFunction = function() {
        var playPause = getPlayPause();
        if(playPause !== null) {
            if(!isPaused() && !isOffline()) {
                log("click");
                playPause.click();
                setTimeout(function() {
                    if(isPaused()) {
                        log("success");
                        clearInterval(myInterval);
                    } else {
                        log("fail");
                    }
                },80);
            }
        } else {
            if(attemptsLeft--<0) {
                log("giveup");
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