// ==UserScript==
// @name         Google Image Search Direct Links
// @namespace    https://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/google.com_Google_Image_Search_Direct_Links.user.js
// @version      0.5
// @description  Add Direct Links to Google Image Search back...
// @author       romibi
// @include      /^https?:\/\/(.*\.)?google..*\/search\?.*/
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let updateLink = function(elem) {
        console.log("updating link");
        if(typeof elem === 'undefined') {
            let elemName = $('.irc_c[style*="transform: translate3d(0px, 0px, 0px)"]').attr("data-item-id");
            elem = $('img[name=\''+elemName+'\']');
        }
        let elemJson = $(elem).parents('.rg_el').find('.rg_meta').html();
        let imglink = $.parseJSON(elemJson).ou;
        $(".rmbDirectImageLink").remove();
        if(typeof imglink !== 'undefined') {
            let linkhtml = "<tr class=\"rmbDirectImageLink\"><td colspan=\"4\"><a href=\""+imglink+"\" class=\"i18192 r-iGpPao0iH2zA\" role=\"button\" rel=\"noreferrer\"><span>Image Direct Link (by Userscript)</span></a></td></tr>";
            $(".irc_but_r > tbody:last-child").append(linkhtml);
        }
    };

    let updateImages = function() {
        let images = $(".rg_l");
        images.each(function(i, elem) {
            $(elem).click(function() {
                updateLink(elem);
            });
        });
    };
    updateImages();

    // onXMLHttpRequest by https://stackoverflow.com/a/629724
    XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
    let myOpen = function(method, url, async, user, password) {
        console.log("xmlhttprequest: "+url);
        if(url.startsWith("/search?")) {
            setTimeout(updateImages, 500);
        }
        this.realOpen (method, url, async, user, password);
    };
    XMLHttpRequest.prototype.open = myOpen;

    setTimeout(updateLink, 1000);
})();