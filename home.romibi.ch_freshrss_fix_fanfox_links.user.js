// ==UserScript==
// @name         Fix Fanfox RSS Links in Fresh-RSS
// @namespace    http://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/home.romibi.ch_freshrss_fix_fanfox_links.user.js
// @version      0.1
// @description  Fixes broken links in the Fanfox RSS Feed in my own Fresh-RSS installation
// @author       romibi
// @match        https://home.romibi.ch/freshrss/i/?get=f_13
// @match        https://home.romibi.ch/freshrss/i/?get=c_6
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    $('a').each(function() {
	    if($(this).attr("href") !== undefined && $(this).attr("href").indexOf("https://fanfox.net")>=0)
	    {
		    $(this).attr("href",$(this).attr("href").replace("https","http"));
        }
    });
})();