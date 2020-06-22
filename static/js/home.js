$(document).ready(function () {
  var welcomeInterval = setInterval(() => {
    setTimeout(() => {
      $(".welcome_container").addClass("welcome_container_scaled");
    }, 700);
    $(".welcome_container").removeClass("welcome_container_scaled");
  }, 2000);

  // PreLoader
  // setTimeout(function () {
  //   $("#preloader").fadeOut(2000);
  // }, 2000);
});
