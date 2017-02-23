// ==UserScript==
// @name         Gmail helpers
// @namespace    https://github.com/knovoselic/gmail-helpers
// @version      0.1
// @description  Random helpers for Gmail
// @author       Kristijan Novoselic
// @match        https://mail.google.com/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/randomcolor/0.4.4/randomColor.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/gmail-js/0.6.1/gmail.min.js
// @grant        none
// @noframe
// ==/UserScript==

var main = function(){
    var gmail = new Gmail();
    var hues = ["blue", "purple", "red", "yellow", "green", "pink", "monochrome"];
    var colors = [];
    for(var i = 0; i < 20; i++) {
        colors.push(randomColor({hue: hues[i % hues.length], luminosity: 'light'}));
    }
    var updateReviewView = function() {
        if (gmail.get.current_page().indexOf('label/Pending+reviews') === -1) return;
        var review_id_regex = /GLO\w+-\d+/;

        if (gmail.dom.toolbar().find(':contains(Review)').length === 0) {
            gmail.tools.add_toolbar_button('Review', function() {
                var openedReviews = [];
                gmail.dom.inbox_content().find('div[role=checkbox][aria-checked=true]')
                    .parents('tr').find('td.xY.a4W span:not([class])')
                    .each(function(el) {
                    var review_id = this.innerText.match(review_id_regex)[0];
                    if (openedReviews.indexOf(review_id) === -1) {
                        window.open('http://jira.glooko.work:8060/cru/' + review_id);
                        openedReviews.push(review_id);
                    }
                });
            }, 'T-I J-J5-Ji nX T-I-ax7 T-I-Js-Gs ar7 T-I-Zf-aw2');
        }
        var reviews = {};
        var current_index = 0;

        var titles = gmail.dom.inbox_content().find('tr td.xY.a4W span.bog');
        titles.each(function(i, el) {
            var current_review = el.innerText.match(review_id_regex);
            if (current_review === null) return;
            current_review = current_review[0];
            if (Object.keys(reviews).indexOf(current_review) === -1) {
                reviews[current_review] = colors[current_index++];
            }
            $(el).parents("tr").find("td:nth-child(-n+3)").css('cssText', 'background-color: ' + reviews[current_review] + '!important');
            if (el.innerHTML.indexOf('review_hover') === -1) {
                el.innerHTML = el.innerHTML.replace(review_id_regex, '<span class="review_hover">$&</span>');
            }
        });
        titles.find('span.review_hover').hover(function() {
            $(this).css('text-decoration', 'underline');
        }, function() {
            $(this).css('text-decoration', 'none');
        });
        titles.find('span.review_hover').off('click');
        titles.find('span.review_hover').on('click', function(e, a, b) {
            e.stopPropagation();
            review_id = this.innerText.match(review_id_regex)[0];
            titles.find('span:contains(' + review_id + ')').parents('tr').find('div[role=checkbox]').trigger('click');
            return true;
        });
    };
    window.addEventListener("hashchange", updateReviewView, false);
    gmail.observe.on('refresh', updateReviewView);

    updateReviewView();
};

window.addEventListener ("load", main, false);
