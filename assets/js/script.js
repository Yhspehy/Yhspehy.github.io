/*!--------------------------------*\
   3-Jekyll Theme
   @author Peiwen Lu (P233)
   https://github.com/P233/3-Jekyll
\*---------------------------------*/

// Detect window size, if less than 1280px add class 'mobile' to sidebar therefore it will be auto hide when trigger the pjax request in small screen devices.

// Variables
//    tag1       = $('.pl__all'),
//    tag2       = $('js-label2'),
//    tag3       = $('js-label3'),
//    tag4       = $('js-label4'),
var sidebar = $("#sidebar"),
  container = $("#post"),
  content = $("#pjax"),
  button = $("#icon-arrow");

if ($(window).width() <= 1280) {
  sidebar.addClass("fullscreen");
  button.addClass("fullscreen");
  content.delay(200).queue(function() {
    $(this)
      .addClass("fullscreen")
      .dequeue();
  });
}

// Tags switcher
//var clickHandler = function(k) {
//  return function() {
//    $(this).addClass('active').siblings().removeClass('active');
//    tag1.hide();
//    window['tag'+k].delay(50).fadeIn(350);
//  }
//};
//for (var i = 1; i <= 4; i++) {
//  $('#js-label' + i).on('click', clickHandler(i));
//}

var clickHandler = function(id) {
  return function() {
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
    $(".pl__all").hide();
    $("." + id)
      .delay(50)
      .fadeIn(350);
  };
};

$("#tags__ul li").each(function(index) {
  $("#" + $(this).attr("id")).on("click", clickHandler($(this).attr("id")));
});

$("#pl__container a").each(function(index) {
  $(this).click(function() {
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
    if (sidebar.hasClass("mobile")) {
      sidebar.addClass("fullscreen");
      button.addClass("fullscreen");
    }
  });
});

// If sidebar has class 'mobile', hide it after clicking.
//tag1.on('click', function() {
//  $(this).addClass('active').siblings().removeClass('active');
//  if (sidebar.hasClass('mobile')) {
//    $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
//  }
//});

// $('.pl__all').on('click', function() {
//   $(this).addClass('active').siblings().removeClass('active');
//   if (sidebar.hasClass('mobile')) {
//     $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
//   }
// });

// Enable fullscreen.
$("#js-fullscreen").on("click", function() {
  if (button.hasClass("fullscreen")) {
    sidebar.removeClass("fullscreen");
    button.removeClass("fullscreen");
    content.delay(300).queue(function() {
      $(this)
        .removeClass("fullscreen")
        .dequeue();
    });
  } else {
    sidebar.addClass("fullscreen");
    button.addClass("fullscreen");
    content.delay(200).queue(function() {
      $(this)
        .addClass("fullscreen")
        .dequeue();
    });
  }
});

$("#mobile-avatar").on("click", function() {
  $("#sidebar, #pjax, #icon-arrow").addClass("fullscreen");
});

// Pjax
$(document).pjax("#avatar, #mobile-avatar, .pl__all", "#pjax", {
  fragment: "#pjax",
  timeout: 10000
});
$(document).on({
  "pjax:click": function() {
    content.removeClass("fadeIn").addClass("fadeOut");
    NProgress.start();
  },
  "pjax:start": function() {
    content.css({ opacity: 0 });
  },
  "pjax:end": function() {
    NProgress.done();
    container.scrollTop(0);
    content
      .css({ opacity: 1 })
      .removeClass("fadeOut")
      .addClass("fadeIn");
    afterPjax();
  }
});

// Codepen embed js
// http://codepen.io/assets/embed/ei.js
// Added on 17 Nov 2013
var CodePenEmbed = {
  width: "100%",
  init: function() {
    this.showCodePenEmbeds(), this.listenToParentPostMessages();
  },
  showCodePenEmbeds: function() {
    var e = document.getElementsByClassName("codepen");
    for (var t = e.length - 1; t > -1; t--) {
      var n = this._getParamsFromAttributes(e[t]);
      n = this._convertOldDataAttributesToNewDataAttributes(n);
      var r = this._buildURL(n),
        i = this._buildIFrame(n, r);
      this._addIFrameToPage(e[t], i);
    }
  },
  _getParamsFromAttributes: function(e) {
    var t = {},
      n = e.attributes;
    for (var r = 0, i = n.length; r < i; r++)
      (name = n[r].name),
        name.indexOf("data-") === 0 &&
          (t[name.replace("data-", "")] = n[r].value);
    return t;
  },
  _convertOldDataAttributesToNewDataAttributes: function(e) {
    return (
      e.href && (e["slug-hash"] = e.href),
      e.type && (e["default-tab"] = e.type),
      e.safe &&
        (e["safe"] == "true"
          ? (e.animations = "run")
          : (e.animations = "stop-after-5")),
      e
    );
  },
  _buildURL: function(e) {
    var t = this._getHost(e),
      n = e.user ? e.user : "anon",
      r = "?" + this._getGetParams(e),
      i = [t, n, "embed", e["slug-hash"] + r].join("/");
    return i.replace(/\/\//g, "//");
  },
  _getHost: function(e) {
    return e.host
      ? e.host
      : document.location.protocol == "file:"
      ? "http://codepen.io"
      : "//codepen.io";
  },
  _getGetParams: function(e) {
    var t = "",
      n = 0;
    for (var r in e)
      t !== "" && (t += "&"), (t += r + "=" + encodeURIComponent(e[r]));
    return t;
  },
  _buildIFrame: function(e, t) {
    var n = {
        id: "cp_embed_" + e["slug-hash"].replace("/", "_"),
        src: t,
        scrolling: "no",
        frameborder: "0",
        height: this._getHeight(e),
        allowTransparency: "true",
        class: "cp_embed_iframe",
        style: "width: " + this.width + "; overflow: hidden;"
      },
      r = "<iframe ";
    for (var i in n) r += i + '="' + n[i] + '" ';
    return (r += "></iframe>"), r;
  },
  _getHeight: function(e) {
    return e.height ? (e["height"] == "auto" ? 300 : e.height) : 300;
  },
  _addIFrameToPage: function(e, t) {
    if (e.parentNode) {
      var n = document.createElement("div");
      (n.innerHTML = t), e.parentNode.replaceChild(n, e);
    } else e.innerHTML = t;
  },
  listenToParentPostMessages: function() {
    var eventMethod = window.addEventListener
        ? "addEventListener"
        : "attachEvent",
      eventListener = window[eventMethod],
      messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
    eventListener(
      messageEvent,
      function(e) {
        try {
          var dataObj = eval("(" + e.data + ")"),
            iframe = document.getElementById("cp_embed_" + dataObj.hash);
          iframe && (iframe.height = dataObj.height);
        } catch (err) {}
      },
      !1
    );
  }
};

// Re-run scripts for post content after pjax
function afterPjax() {
  // Open links in new tab
  $("#post__content a").attr("target", "_blank");

  // Embed codepen after pjax
  CodePenEmbed.init();

  // Generate post TOC for h1 h2 and h3
  var toc = $("#post__toc-ul");
  // Empty TOC and generate an entry for h1
  toc
    .empty()
    .append(
      '<li class="post__toc-li post__toc-h1"><a href="#post__title" class="js-anchor-link">' +
        $("#post__title").text() +
        "</a></li>"
    );

  // Generate entries for h2 and h3
  $("#post__content")
    .children("h2,h3")
    .each(function() {
      // Generate random ID for each heading
      $(this).attr("id", function() {
        var ID = "",
          alphabet = "abcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < 5; i++) {
          ID += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }
        return ID;
      });

      if ($(this).prop("tagName") == "H2") {
        toc.append(
          '<li class="post__toc-li post__toc-h2"><a href="#' +
            $(this).attr("id") +
            '" class="js-anchor-link">' +
            $(this).text() +
            "</a></li>"
        );
      } else {
        toc.append(
          '<li class="post__toc-li post__toc-h3"><a href="#' +
            $(this).attr("id") +
            '" class="js-anchor-link">' +
            $(this).text() +
            "</a></li>"
        );
      }
    });

  // Smooth scrolling
  $(".js-anchor-link").on("click", function() {
    var target = $(this.hash);
    container.animate(
      { scrollTop: target.offset().top + container.scrollTop() },
      500,
      function() {
        target
          .addClass("flash")
          .delay(0)
          .queue(function() {
            $(this)
              .removeClass("flash")
              .dequeue();
          });
      }
    );
  });

  // Lazy Loading Disqus
  // http://jsfiddle.net/dragoncrew/SHGwe/1/
  // var ds_loaded = false,
  //     top = $('#disqus_thread').offset().top;
  //identifier = $('#post__title').data('identifier');
  // window.disqus_shortname = $('#disqus_thread').attr('name');
  //window.disqus_shortname = 'coffeechou';
  //window.disqus_identifier = identifier;

  // function check() {
  //   if ( !ds_loaded && container.scrollTop() + container.height() > top ) {
  //     $.ajax({
  //       type: 'GET',
  //       url: 'https://' + disqus_shortname + '.disqus.com/embed.js',
  //       dataType: 'script',
  //       cache: true
  //     });
  //     ds_loaded = true;
  //   }
  // }check();
  // container.scroll(check);
}
afterPjax();

!(function() {
  function o(w, v, i) {
    return w.getAttribute(v) || i;
  }
  function j(i) {
    return document.getElementsByTagName(i);
  }
  function l() {
    var i = j("script"),
      w = i.length,
      v = i[w - 1];
    return {
      l: w,
      z: o(v, "zIndex", -1),
      o: o(v, "opacity", 1),
      c: o(v, "color", "255,255,153"),
      n: o(v, "count", 60)
    };
  }
  function k() {
    (r = u.width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth),
      (n = u.height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight);
    pp.height = n;
    pp.width = r;
    if ($(window).width() <= 1280) {
      $("#sidebar").addClass("mobile");
      e.clearRect(0, 0, r, n);
      t = [];
    } else {
      $("#sidebar").removeClass("mobile");
    }
  }
  function b() {
    e.clearRect(0, 0, r, n);
    var w = [f].concat(t);
    var x, v, A, B, z, y;
    t.forEach(function(i) {
      (i.x += i.xa),
        (i.y += i.ya),
        (i.xa *= i.x > r || i.x < 0 ? -1 : 1),
        (i.ya *= i.y > n || i.y < 0 ? -1 : 1),
        e.fillRect(i.x - 0.5, i.y - 0.5, 1, 1);
      for (v = 0; v < w.length; v++) {
        x = w[v];
        if (i !== x && null !== x.x && null !== x.y) {
          (B = i.x - x.x), (z = i.y - x.y), (y = B * B + z * z);
          y < x.max &&
            (x === f &&
              y >= x.max / 2 &&
              ((i.x -= 0.03 * B), (i.y -= 0.03 * z)),
            (A = (x.max - y) / x.max),
            e.beginPath(),
            (e.lineWidth = A / 2),
            (e.strokeStyle = "rgba(" + s.c + "," + (A + 0.2) + ")"),
            e.moveTo(i.x, i.y),
            e.lineTo(x.x, x.y),
            e.stroke());
        }
      }
      w.splice(w.indexOf(i), 1);
    }),
      m(b);
  }

  var pp = document.getElementById("c_n149");
  var u = document.createElement("canvas"),
    s = l(),
    c = "c_n" + s.l,
    e = u.getContext("2d"),
    r,
    n,
    m =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(i) {
        window.setTimeout(i, 1000 / 45);
      },
    a = Math.random,
    f = {
      x: null,
      y: null,
      max: 20000
    };
  u.id = c;
  u.style.cssText =
    "position:fixed;top:0;left:0;z-index:" + s.z + ";opacity:" + s.o;
  j("body")[0].appendChild(u);
  k(), (window.onresize = k);
  (window.onmousemove = function(i) {
    (i = i || window.event), (f.x = i.clientX), (f.y = i.clientY);
  }),
    (window.onmouseout = function() {
      (f.x = null), (f.y = null);
    });
  for (var t = [], p = 0; s.n > p; p++) {
    var h = a() * r,
      g = a() * n,
      q = 2 * a() - 1,
      d = 2 * a() - 1;
    t.push({
      x: h,
      y: g,
      xa: q,
      ya: d,
      max: 6000
    });
  }

  if ($(window).width() >= 1280) {
    setTimeout(function() {
      b();
    }, 100);
  }
})();
