// ==UserScript==
// @name         Minecraft User Joined Notification
// @namespace    http://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/gamedde_Minecraft_Server_Console_User_Notification.user.js
// @version      0.2
// @description  Get Notified when a new user joined!
// @author       romibi
// @match        https://wsproxy.united-gameserver.de:8080/console/*/
// @icon         https://www.google.com/s2/favicons?domain=united-gameserver.de
// @grant        none
// ==/UserScript==

(function(){

var canNotify = false;
var enc = new TextDecoder("utf-8");

var askNotificationPermission = function() {
    if(canNotify) return;
    //console.log(Notification.permission);
    if (Notification.permission === "granted") {
        canNotify = true;
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            //console.log(permission);
        });
    }
}

if (Notification.permission === "granted") {
    canNotify = true;
    //console.log(Notification.permission);
} else {
    document.body.onclick = askNotificationPermission;
}

var showNotify = function(message) {
    //console.log("showing notification: "+message);
    const notification = new Notification("Minecraft Server Notification", {body: message, icon: 'https://romibi.ch/images/bluehat-gaming.png'});
    notification.onclick = function() { window.focus(); this.cancel(); }
}

var notify = function(message) {
    if(canNotify) {
        showNotify(message);
    }
}

var checkMessageForNotification = function(message) {
    var match = message.match(/: (\w*)\[.*?\] logged in/);
    //console.log("no match with: "+message);
    if(match !== null) {
        //console.log(match[1] + " logged in");
        notify(match[1] + " logged in");
    }
}

var logMessage = function(event){
    //console.log(event);
    var message = enc.decode(event.data);
    var lines = message.split("\n");
    for ( const line of lines) {
        var cleaned = line.replace(/\u001b\[\d{0,2}m/g,"")
        checkMessageForNotification(cleaned);
        //console.log(cleaned);
    }
}

var ws = window.WebSocket;

window.WebSocket = function (a, b) {
   var that = b ? new ws(a, b) : new ws(a);
   //that.addEventListener("open", console.info.bind(console, "socket open"));
   //that.addEventListener("close", console.info.bind(console, "socket close"));
   //that.addEventListener("message", console.info.bind(console, "socket msg"));
   that.addEventListener("message", logMessage);
   return that;
};

window.WebSocket.prototype=ws.prototype;
window.WebSocket.OPEN = 1; // Apparently gamed (or a used lib) defined some custom constants …

}());
