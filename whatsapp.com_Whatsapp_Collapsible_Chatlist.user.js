// ==UserScript==
// @name         Whatsapp Collapsible Chatlist
// @namespace    http://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/whatsapp.com_Whatsapp_Collapsible_Chatlist.user.js
// @version      25.01.29
// @description  Make the chatlist of whatsapp collapsible
// @author       romibi
// @match        https://web.whatsapp.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    function addCSS() {
        GM_addStyle(`
          .romibi-chat-collapse-btn, .romibi-chat-uncollapse-btn {
            border: 1px solid black;
            border-radius: 3px;
            line-height: 1.8em;
            padding: 0px 10px 3px;
            display: inline-block;
            font-weight: bolder;
            font-size: 1.2em;
            cursor: pointer;
            color:black;
          }

          body.dark .romibi-chat-collapse-btn, body.dark .romibi-chat-uncollapse-btn {
            border: 1px solid white;
            color:white;
          }

          .romibi-chat-collapse-btn {
            margin: 2px 10px 2px 2px;
          }

          .romibi-chat-uncollapse-btn {
            margin-top: 10px;
          }

          .romibi-chatmarker.romibi-hideable {
            transition: width 0.75s ease-in-out, min-width 0.75s ease-in-out, max-width 0.75s ease-in-out;
          }

          .romibi-chatmarker.romibi-hidden {
            width: 0px !important;
            max-width: 0px !important;
            min-width: 0px !important;
            overflow: hidden;
            transition: width 0.75s ease-in-out, min-width 0.75s ease-in-out, max-width 0.75s ease-in-out;
          }

          .romibi-chat-uncollapse-btn.romibi-hideable {
            transition: height 0.75s ease-in-out, padding 0.75s ease-in-out, margin 0.75s ease-in-out, border 0.75s ease-in-out;
            height: 35px;
            overflow: hidden;
          }

          .romibi-chat-uncollapse-btn.romibi-hidden, body.dark .romibi-chat-uncollapse-btn.romibi-hidden {
            transition: height 0.75s ease-in-out, padding 0.75s ease-in-out, margin 0.75s ease-in-out, border 0.75s ease-in-out;
            height:  0px;
            padding-top: 0px;
            padding-bottom: 0px;
            margin-top: 0px;
            margin-bottom: 0px;
            border: 1px transparent;
          }
        `);
    }

    function RegisterModificationObserver(target, selector, action) {
        const observer = new MutationObserver(mutationList =>
            mutationList.filter(m => m.type === 'childList').forEach(m => {
                m.addedNodes.forEach(function(elem) {
                    if (selector === "" || $(elem).parents(selector).length) {
                       action();
                    }
                });
            })
        );
        observer.observe(target,{childList: true, subtree: true});
    }

    function addCollapseButton(insertBeforeElement) {
        if ($('.romibi-chat-collapse-btn').length > 0) {
            return;
        }

        var collapse = document.createElement("a");
        collapse.setAttribute("class", "romibi-chat-collapse-btn");
        collapse.onclick = function() {
            doCollapse();
        }
        collapse.innerHTML = "&lt;";
        let insertParent = $(insertBeforeElement).parent()[0];
        insertParent.insertBefore(collapse, insertBeforeElement);
    }

    function addUnCollapseButton(insertBeforeElement) {
        if ($('.romibi-chat-uncollapse-btn').length > 0) {
            return;
        }

        var unCollapse = document.createElement("a");
        unCollapse.setAttribute("class", "romibi-chat-uncollapse-btn romibi-hideable romibi-hidden");
        unCollapse.onclick = function() {
            doUnCollapse();
        }
        unCollapse.innerHTML = "&gt;";
        let insertParent = $(insertBeforeElement).parent()[0];
        insertParent.insertBefore(unCollapse, insertBeforeElement);
    }

    function markChatsHideable() {
        if ($('.romibi-chatmarker').length > 0) {
            return;
        }
        let chats = $($('#app .two header + div')[0]);
        chats.addClass('romibi-chatmarker');
        chats.addClass('romibi-hideable');
    }

    function doCollapse() {
        $($('.romibi-chatmarker')[0]).addClass('romibi-hidden');
        $($('.romibi-chat-uncollapse-btn')[0]).removeClass('romibi-hidden');
    }

    function doUnCollapse() {
        console.log("collapsing");
        $($('.romibi-chatmarker')[0]).removeClass('romibi-hidden');
        $($('.romibi-chat-uncollapse-btn')[0]).addClass('romibi-hidden');
    }

    $( document ).ready(function() {
        addCSS();
        RegisterModificationObserver(document, "header", function() {
            markChatsHideable();
            addCollapseButton($($("h1:contains('Chats')")[0]).parent()[0]);
            addUnCollapseButton($($('button[aria-label="Chats"]')[0]).parent()[0]);
        });
    });
})();