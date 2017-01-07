//main.js

$(document).ready(function(){
  replaceSVGs();
  toggleSidebar();
  clickSidebarItemListener();
  usingFauxtonNavigationListener();
  jumpToAnchor();
  detectHashChange();
  changeHashOnScroll();
});

function jumpToAnchor () {

  var hash = window.location.hash;
  switch (hash) {
    case '' : 
      $('#redsidebar .getting-started').click();
      break;
    case '#getting-started' : 
      $('#redsidebar .getting-started').click();
      break;
    case '#answers' :
      $('#redsidebar .answers').click();
      break;
    default: 
      $('#redsidebar .using-fauxton').click();
      if (location.hash) {
        location.href = location.hash;
      }
      highlightFauxtonNavigation();
  }
}

function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}

function getAmountofContentVisibleOnPage () {

  var hash = window.location.hash;

  switch (hash) {
    case '' : 
    case '#getting-started' : 
      return getOffset(document.getElementById('end-getting-started')).top;
    case '#using-fauxton' : 
      return getOffset(document.getElementById('end-using-fauxton')).top;
    case '#answers' :
      return getOffset(document.getElementById('end-answers')).top;
    default:
      return getOffset(document.getElementById('end-using-fauxton')).top;
  }
}

function highlightFauxtonNavigation () {
    clearAll();

    var hash = window.location.hash;
    var address = hash.substring(1);
    var end = address.slice(-1);

    // init middle bar
    if (hash === '#using-fauxton') {
      $('#toc-intro').addClass('selected');
      $('icon-menu-_all_dbs').addClass('selected');
    } else {
      $('#toc-' + address).addClass('selected');
      $('.icon-menu-'+ address).addClass('selected');
    }

    function clearAll () {
      $('.toc .heading, .fauxton-toc .icon-menu a').each(function () {
        $(this).removeClass('selected');
      });
    }
  }

function changeHashOnScroll() {
  //http://stackoverflow.com/questions/5315659/jquery-change-hash-fragment-identifier-while-scrolling-down-page
  
  var timer = null;
  $(window).scroll(function (e) {
    $('div.chapter').each(function () {
      if (
        $(this).offset().top < window.pageYOffset + 10
        //begins before top
        && $(this).offset().top + $(this).height() > window.pageYOffset + 10
        //but ends in visible area
        //+ 20 allows you to change hash before it hits the top border
      ){

        history.replaceState(null, null, "#" + $(this).attr('id'));
        highlightFauxtonNavigation();

        if ($('#_all_dbs').visible(true)) {
          clear();
          $('#_all_dbs-sub').css({
            'color': 'black',
            'font-weight': 'bold'
          });
        }
        

        if ($('#_all_docs').visible(true)) {
          clear();
          $('#_all_docs-sub').css({
            'color': 'black',
            'font-weight': 'bold'
          });
          return;
        }

        if ($('#editor').visible(true)) {
          clear();
          $('#editor-sub').css({
            'color': 'black',
            'font-weight': 'bold'
          });
          return;
        }

        if ($('#db-action').visible(true)) {
          clear();
          $('#db-actions-sub').css({
            'color': 'black',
            'font-weight': 'bold'
          });
        }
      }
    });
  });

  function clear () {
    $('#db-actions-sub, #_all_docs-sub, #editor-sub, #_all_dbs-sub').css({
      'color': '',
      'font-weight': ''
    });
  }
}

function detectHashChange () {
  // this is if you click the back button on the browser

  $(window).on('load', function() {
    jumpToAnchor();
  });

  $(window).on('hashchange', function() {
    var hash = window.location.hash;
    switch (hash) {
      case '#editor' : 
      case '#_all_docs':
      case '#db-action':
        $('#toc-_all_dbs').addClass('selected');
        $('.icon-menu-_all_dbs').addClass('selected');
        break;
      case '#answers': 
        window.scrollTo(0,0);
        break;
      case '#using-fauxton':
        highlightFauxtonNavigation();
        break;
      default:
    }
  });
}

function toggleSidebar() {
  $('#hamburger, #redsidebar .header').click(function () {
    $('#content').toggleClass('showSideBar');
    $('#hamburger').toggleClass('showSideBar');
  });
}

function clickSidebarItemListener () {

  //makes the CSS changes
  $('#redsidebar .section').click(function () {
    clearAll();
    var sectionChosen = $(this).data('nav');

    $('#' + sectionChosen).addClass('shown');
    $('.' + sectionChosen + ' .big-nav-subtitle')
      .css({
        'color': '#750f34',
        'font-weight': 'bold'
      });
    $('.section.' + sectionChosen + ' .large-icon')
      .css('background-image', 'url("imgs/'+ sectionChosen +'-dark.png")');
    $( ".middleBar" ).css('padding-top', '50px');
  });

  //makes the CSS default
  function clearAll () {
    $('#getting-started').removeClass('shown');
    $('#using-fauxton').removeClass('shown');
    $('#answers').removeClass('shown');
    $('.toc .heading, .fauxton-toc .icon-menu a').each(function () {
      $(this).removeClass('selected');
    })

    $('.big-nav-subtitle')
      .css({
        'color': '',
        'font-weight': ''
      });
    $('.getting-started .large-icon, .using-fauxton .large-icon, .answers .large-icon')
      .css('background-image', '');
  }
}

function usingFauxtonNavigationListener () {
  $('#using-fauxton .toc a, .fauxton-toc .icon-menu a').click(function (e) {
    clearAll();

    if ($(this).hasClass('subheading')) {
      e.stopPropagation();
    }
    var href = $(this).attr('href');
    var address = href.substring(1);

    $('#toc-' + address).addClass('selected');
    $('.icon-menu-'+ address).addClass('selected');

  });

  function clearAll () {
    $('.toc .heading, .fauxton-toc .icon-menu a').each(function () {
      $(this).removeClass('selected');
    });
  }
}

/*
 * Replace all SVG images with inline SVG
 * from http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
 */
function replaceSVGs () {
  jQuery('img.svg').each(function(){
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function(data) {
      // Get the SVG tag, ignore the rest
      var $svg = jQuery(data).find('svg');

      // Add replaced image's ID to the new SVG
      if(typeof imgID !== 'undefined') {
        $svg = $svg.attr('id', imgID);
      }
      // Add replaced image's classes to the new SVG
      if(typeof imgClass !== 'undefined') {
        $svg = $svg.attr('class', imgClass+' replaced-svg');
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr('xmlns:a');

      // Replace image with new SVG
      $img.replaceWith($svg);

    }, 'xml');  
  });
}
