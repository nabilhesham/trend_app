var offset = $("nav.navbar").offset();
var top = offset.top;

$(document).ready(function () {
  var topscroll = $(window).scrollTop();
  if (topscroll == 0) {
    $("nav.navbar").removeClass("sticky");
    //   $("#toTop").css("display", "none");
  } else {
    $("nav.navbar").addClass("sticky");
    //   $("#toTop").css("display", "block");
  }
});

$(window).scroll(function () {
  // Sticky NavBAr
  var offset = $("nav.navbar").offset();
  var top = offset.top;
  if (top == 0) {
    $("nav.navbar").removeClass("sticky");
    //   $("#toTop").css("display", "none");
  } else {
    $("nav.navbar").addClass("sticky");
    //   $("#toTop").css("display", "block");
  }
});
