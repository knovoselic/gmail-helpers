var gmail;

function refresh(f) {
  if( (/in/.test(document.readyState)) || (typeof Gmail === undefined) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

var main = function(){
  gmail = new Gmail();
  var updateReviewView = function() {
    if (gmail.get.current_page() != 'label/Pending+reviews') return;
    var review_id_regex = /GLOWEB-\d+/;

    if (!window.reviewButtonAdded) {
      window.reviewButtonAdded = true;
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
    var hues = ["blue", "purple", "red", "yellow", "green", "pink", "monochrome"];
    var current_hue_index = -1;

    var titles = gmail.dom.inbox_content().find('tr td.xY.a4W span:not([class])');
    titles.each(function(i, el) {
      var current_review = el.innerText.match(review_id_regex)
      if (current_review === null) return;
      current_review = current_review[0];
      if (Object.keys(reviews).indexOf(current_review) === -1) {
        current_hue_index = (current_hue_index + 1) % hues.length;
        reviews[current_review] = randomColor({hue: hues[current_hue_index], luminosity: 'light'});
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
    })
  };
  window.addEventListener("hashchange", updateReviewView, false);
  updateReviewView();
}

refresh(main);
