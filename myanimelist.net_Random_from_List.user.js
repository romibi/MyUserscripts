// ==UserScript==
// @name         MyAnimeList(MAL) - Random from List
// @namespace    https://romibi.ch/
// @downloadURL  https://raw.githubusercontent.com/romibi/MyUserscripts/master/myanimelist.net_Random_from_List.user.js
// @version      0.2
// @description  Adds a Random Button to Lists on myanimelist.net
// @author       romibi
// @grant GM_setValue
// @grant GM_getValue
// @match        https://myanimelist.net/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        var link = document.createElement('a');
        if($('.header-right').length > 0) {
            var linkContainer = document.createElement('div');
            $(linkContainer).addClass('header-right');

            var list = GM_getValue('ch.romibi.mal.random.listname');

            link.innerHTML = 'Random (last List)';
            link.title = list;
            linkContainer.prepend(' - ');
            linkContainer.prepend(link);
            $('.header-right').after(linkContainer);
        } else {
            link.innerHTML = '<i class="fa">#</i> Random';
            $('.list-status-title .stats').append(link);
        }
        link.addEventListener('click', getRandomFromList);
        link.href="javascript: void(0);"

        updateCachedList();

        var doUpdate = 0;
        var mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if(doUpdate==0) {
                    doUpdate = 1;
                    setTimeout(function(){ doUpdate = 0; updateCachedList(); }, 3000);
                }
            });
        });

        var table = $('.list-table')[0];
        if(table != undefined) {
            // Starts listening for changes in the root HTML element of the page.
            mutationObserver.observe(table, {
                attributes: false,
                characterData: false,
                childList: true,
                subtree: true,
                attributeOldValue: false,
                characterDataOldValue: false
            });
        }
    });

    function updateCachedList() {
        var links = [];
        var elems = $('.list-table .list-item .title .link');
        elems.each(
            function() {
                links.push(this.href);
            }
        );
        if(links.length>0) {
            GM_setValue('ch.romibi.mal.random.list', JSON.stringify(links));

            var list = $('.username').text();
            list += '/';
            list += $('body').attr('data-work');
            list += '/';
            list += $('.status-button.on').text()

            GM_setValue('ch.romibi.mal.random.listname', list);
        }
    }

    function getRandomFromList() {
        var elems = JSON.parse(GM_getValue('ch.romibi.mal.random.list'));
        var link = elems[Math.floor(Math.random() * elems.length)];
        window.location = link;
    }
})();