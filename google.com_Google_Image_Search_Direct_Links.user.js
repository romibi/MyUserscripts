// ==UserScript==
// @name         Google Image Search Direct Links
// @namespace    https://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/google.com_Google_Image_Search_Direct_Links.user.js
// @version      0.2
// @description  Add Direct Links to Google Image Search back...
// @author       romibi
// @include      /^https?:\/\/(.*\.)?google..*\/search\?.*/
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let updateLink = function() {
        console.log("updating link");
        let imglink = $('.irc_c[style*="transform: translate3d(0px, 0px, 0px)"] .irc_mi').attr("src");
        console.log(imglink);
        $(".rmbDirectImageLink").remove();
        if(imglink!='undefined') {
            let linkhtml = "<tr class=\"rmbDirectImageLink\"><td colspan=\"4\"><a href=\""+imglink+"\" class=\"i18192 r-iGpPao0iH2zA\" role=\"button\"><span>Image Direct Link (by Userscript)</span></a></td></tr>";
            $(".irc_but_r > tbody:last-child").append(linkhtml);
        }
    };

    let images = $(".rg_l");
    images.each(function(i, elem) {
        $(elem).click(function() {
            setTimeout(updateLink, 500);
        });
    });

    setTimeout(updateLink, 1000);
})();