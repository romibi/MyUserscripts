// ==UserScript==
// @name         ToTK Spoiler Blocker
// @namespace    https://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/ToTK_spoiler_blocker.user.js
// @version      0.1
// @description  Prevent TotK spoilers
// @author       romibi
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @run-at        document-start
// @grant        GM_addStyle
// @grant        window.onurlchange
// ==/UserScript==

(function() {
    'use strict';

    let singlePageSites = [
        'youtube.com'
    ];
    let no_Subtreemodified_Sites = [
        'youtube.com'
    ];
    // [<website>, <selector>, <parent selector maps>]
    let postDivMap = [
        ['google.com/search', 'cite, a div[role="heading"]',
          [
             ['cite', ['cite|a', 'a|div', 'div|div', 'div|div']],
             ['div', ['div|a', 'a|div', 'div|div']]
          ]
        ],
        ['youtube.com', 'div.ytd-rich-item-renderer, .ytd-rich-shelf-renderer, div.ytd-expanded-shelf-contents-renderer, ytd-grid-video-renderer>.ytd-grid-video-renderer'],
        ['twitter.com', 'article .r-18u37iz > div > .css-1dbjc4n + .css-1dbjc4n']
    ];
    let spoilerWarningKeywords = [
//// trigger testing keywords
//        ['mxr'],
//        ['tom'],
//        ['gothamchess'],
//        ['corridor'],
//        ['hermit'],
//        ['loop'],
//        ['cat', 'job'],
//        ['cat', 'sitting'],
//        ['cat', 'peeking'],
        ['zelda'],
        ['totk'],
        ['tears', 'kingdom']
    ];
    let spoilerDetectionKeywords = [];
    // json encoded with btoa (base64) with actual spoilers
    // friend provided list (todo, currently empty)
    //let spoilerDetectionKeywords_Encoded = "WwogIFsibG9vcCIsICJadXJpY2giXQpd";
    let spoilerDetectionKeywords_Encoded = "WwogIFsidG90ayJdLAogIFsidGVhcnMiLCAia2luZ2RvbSJdCl0";

    function unEncodeSpoilerKeywords () {
        if(spoilerDetectionKeywords.length>0) {
            return;
        }
        let keywordlist = JSON.parse(atob(spoilerDetectionKeywords_Encoded));
        for (let i = 0; i < keywordlist.length; i++) {
            let spoilerKeywords = [];
            let encodedSpoilerKeywords = keywordlist[i];
            for (let j = 0; j < encodedSpoilerKeywords.length; j++) {
                spoilerKeywords.push(encodedSpoilerKeywords[j].toLowerCase())
            }
            spoilerDetectionKeywords.push(spoilerKeywords);
        }
        //console.log(spoilerDetectionKeywords);
    }

    function addSpoilerWarnings() {
        let postDivSelector = getPostDivSelector();
        let hasParentSel = hasParentSelectors();
        $(postDivSelector).each(function() {
            let elem = $(this);
            if(hasParentSel) {
                let parentSelectorMap = getPostDivParentSelectorMap()
                let parentSelectors = [];
                for (let i = 0; i < parentSelectorMap.length; i++) {
                    if(elem.is(parentSelectorMap[i][0])) {
                        parentSelectors = parentSelectorMap[i][1];
                        break;
                    }
                }
                for (let i = 0; i < parentSelectors.length; i++) {
                    let selector = parentSelectors[i];
                    let matcher = selector.split('|')[0];
                    selector = selector.split('|')[1];

                    if (!elem.is(matcher)) {
                        break;
                    }
                    elem = $(elem.parents(selector)[0]);
                }
            }
            if(elem.hasClass('romibi-spoiler-post')) {
                return;
            }
            let postContent = getContentText(elem).toLowerCase();
            if(findKeywords(postContent, spoilerDetectionKeywords)) {
                addSpoilerWarningToPost(elem, 'romibi-danger', 'This likely contains Spoilers for "The&nbsp;Legend&nbsp;of&nbsp;Z&#xfeff;elda: T&#xfeff;ears&nbsp;of&nbsp;the&nbsp;K&#xfeff;ingdom"!!<br/>Doubleclick to show anyways!', true);
            } else if(findKeywords(postContent, spoilerWarningKeywords)) {
                addSpoilerWarningToPost(elem, 'romibi-warning', 'This mentions "The&nbsp;Legend&nbsp;of&nbsp;Z&#xfeff;elda: T&#xfeff;ears&nbsp;of&nbsp;the&nbsp;K&#xfeff;ingdom"!<br/>Be aware of potential Spoilers!<br/>Click to show anyways!', false);
            }
        });
    }

    function addSpoilerWarningToPost(post, warningClass, spanText, dbl) {
        $(post).addClass('romibi-spoiler-post');
        let myId = revisedRandId();
        $(post).append('<div id="'+myId+'" class="romibi-spoiler-post-block '+warningClass+' romibi-hideable"><span>'+spanText+'</span></div>');
        if(dbl) {
            $(post).find('.romibi-spoiler-post-block').dblclick(function(e){
                hideSpoilerFirewall('#'+myId);
                e.stopPropagation();
            });
            $(post).find('.romibi-spoiler-post-block').click(function(e){
                e.stopPropagation();
            });
        } else {
            $(post).find('.romibi-spoiler-post-block').click(function(e){
                hideSpoilerFirewall('#'+myId);
                e.stopPropagation();
            });
        }
    }

    function findKeywords(content, keywords) {
        //return false;
        for (let i = 0; i < keywords.length; i++) {
            let match = true;
            keywords[i].forEach(keyword => {
                if(match) {
                    match = content.includes(keyword);
                }
            });
            if(match) {
                // console.log('match in:'+content);
                return true;
            }
        }
    }

    function findSpoilersInBody() {
        let pageContent = getContentTextFor('body').toLowerCase();
        findSpoilers(pageContent);
    }

    function findSpoilers(content){
        unEncodeSpoilerKeywords();

        if(findKeywords(content, spoilerDetectionKeywords)) {
            showSpoilerDanger();
        } else if(findKeywords(content, spoilerWarningKeywords)) {
            showSpoilerWarning();
        }
    }

    function getPostDivSelector() {
        return getPostDivSelectorMap()[1];
    }

    function hasParentSelectors() {
        return getPostDivSelectorMap().length > 2;
    }

    function getPostDivSelectorMap() {
        for (let i = 0; i < postDivMap.length; i++) {
            if(window.location.href.includes(postDivMap[i][0])) {
               return postDivMap[i];
            }
        }
    }

    function getPostDivParentSelectorMap() {
        return getPostDivSelectorMap()[2];
    }

    function canHideSelectively() {
        return getPostDivSelectorMap() !== undefined
        //return $(getPostDivSelector()).length > 0;
    }

    function cleanupOldSpoilerBlockers() {
        $('.romibi-spoiler-post-block').remove();
        $('.romibi-spoiler-post').removeClass('romibi-spoiler-post');
    }

    function addSpoilerFirewall() {
        $('body').append(`<div id="romibi-spoiler-firewall" class="romibi-spoiler-firewall romibi-hideable">
                <span>Checking for "The&nbsp;Legend&nbsp;of&nbsp;Z&#xfeff;elda: T&#xfeff;ears&nbsp;of&nbsp;the&nbsp;K&#xfeff;ingdom" Spoilers…</span>
            </div>`);
    }

    function showSpoilerDanger() {
        if(canHideSelectively()) {
            addSpoilerWarnings();
        } else {
            showSpoilerDangerFullscreen();
        }
    }

    function showSpoilerDangerFullscreen() {
        unRegisterContentLoadListener();
        $('body').append(`<div id="romibi-spoiler-firewall-danger" class="romibi-spoiler-firewall romibi-hideable romibi-danger">
                <span>This Site likely contains Spoilers for "The&nbsp;Legend&nbsp;of&nbsp;Z&#xfeff;elda: T&#xfeff;ears&nbsp;of&nbsp;the&nbsp;K&#xfeff;ingdom"!!<br/>Doubleclick to show anyways!</span>
            </div>`);
        hideSpoilerFirewall();
        $('#romibi-spoiler-firewall-danger').dblclick(function() {
            hideSpoilerFirewall('#romibi-spoiler-firewall-danger');
        });
    }

    function showSpoilerWarning() {
        if(canHideSelectively()) {
            addSpoilerWarnings();
        } else {
            showSpoilerWarningFullscreen();
        }
    }

    function showSpoilerWarningFullscreen() {
        unRegisterContentLoadListener();
        $('body').append(`<div id="romibi-spoiler-firewall-warning" class="romibi-spoiler-firewall romibi-hideable romibi-warning">
                             <span>This Site mentions "The&nbsp;Legend&nbsp;of&nbsp;Z&#xfeff;elda: T&#xfeff;ears&nbsp;of&nbsp;the&nbsp;K&#xfeff;ingdom"!<br/>Be aware of potential Spoilers!<br/>Click to show anyways!</span></div>`);
        hideSpoilerFirewall();
        $('#romibi-spoiler-firewall-warning').click(function() {
            hideSpoilerFirewall('#romibi-spoiler-firewall-warning');
        });

    }

    function hideSpoilerFirewall(id) {
        let idquery = id;
        if(typeof id === 'undefined') {
            idquery = '#romibi-spoiler-firewall';
        }
        $(idquery).addClass('romibi-hiding');
        setTimeout(function() {
            $(idquery).remove();
        }, 1000);
    }

    function getContentTextFor(selector) {
        return getContentText($(selector));
    }

    function getContentText(elem) {
        let clonedElem = elem.clone();
        $(clonedElem).find('script').each(function(){this.remove()});
        $(clonedElem).find('style').each(function(){this.remove()});
        let result = $(clonedElem).text();
        $(clonedElem).find('img[alt]').each(function(){
            let imgalt = $(this).attr('alt');
            //console.log('imgalt: '+imgalt);
            result += imgalt;
        });
        clonedElem.remove();
        //console.log(result);
        return result;
    }

    function revisedRandId() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
    }

    function noSubtreeModified() {
        for (let i = 0; i < no_Subtreemodified_Sites.length; i++) {
            if(window.location.href.includes(no_Subtreemodified_Sites[i])) {
               return true;
            }
        }
        return false;
    }

    function needRegisterUrlChangeListener() {
        for (let i = 0; i < singlePageSites.length; i++) {
            if(window.location.href.includes(singlePageSites[i])) {
               return true;
            }
        }
        return false;
    }

    function registerUrlChangeListener() {
        if (!needRegisterUrlChangeListener()) {
            return;
        }
        if (window.onurlchange === null) {
            // feature is supported
            window.addEventListener('urlchange', (info) => {
                addSpoilerFirewall();
                cleanupOldSpoilerBlockers();
                findSpoilersInBody();
                hideSpoilerFirewall();
            });
        }
    }

    function registerContentLoadListener() {
        if(noSubtreeModified()) {
            $(document).on("DOMNodeInserted", "body", findSpoilersInInserted);
        } else {
            $(document).on("DOMNodeInserted, DOMSubtreeModified", "body", findSpoilersInInserted);
        }
    }

    function unRegisterContentLoadListener() {
        if(noSubtreeModified()) {
            $(document).off("DOMNodeInserted", "body", findSpoilersInInserted);
        } else {
            $(document).off("DOMNodeInserted, DOMSubtreeModified", "body", findSpoilersInInserted);
        }
    }

    function findSpoilersInInserted(event) {
//        if($(event.target).text().includes('cats with jobs')) {
//            console.log(event.target.innerHTML);
//        }
        let insertContent = getContentTextFor(event.target).toLowerCase();
        findSpoilers(insertContent);
    }

    function addCSS(){
        GM_addStyle(`
          .romibi-spoiler-firewall {
              position: fixed;
              top: 0px;
              left: 0px;
              width: 100%;
              height: 100%;
              background: black;
              z-index: 9999999999;
              text-align: center;
              font-size: 5em;
              line-height: 100vh;
              color: white;
          }

          .romibi-spoiler-firewall span {
              display: inline-block;
              vertical-align: middle;
              line-height: 1em;
              margin: 5vh;
          }

          .romibi-spoiler-post {
              position: relative;
          }

          .romibi-spoiler-post-block {
              position: absolute;
              top: 0px;
              left: 0px;
              width: 100%;
              height: 100%;
              z-index: 99999999999;
              text-align: center;
              line-height: 100%;
          }

          .romibi-spoiler-post-block span {
              display: inline-block;
              vertical-align: middle;
              line-height: 1em;
              margin: 5%;
          }

          .romibi-danger {
              color: black;
              background: rgb(255,50,50);
          }

          .romibi-warning {
              color: black;
              background: rgb(255,255,50);
          }

          .romibi-hideable {
              opacity: 1;
              transition: opacity 1s ease-out;
          }

          .romibi-hiding {
              opacity: 0;
          }
        `);
    }

    addCSS();
    addSpoilerFirewall();

    $( document ).ready(function() {
        registerUrlChangeListener();
        registerContentLoadListener();
        findSpoilersInBody();
        hideSpoilerFirewall();
    });
})();
