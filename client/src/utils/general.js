import "bootstrap";
import "../scss/main.scss";
console.log("this is general file");
import $ from "jquery";
import slick from "slick-carousel";
import "./loginCheck.js";

// Video Play
if ($(".video")) {
  $(function () {
    // Auto play modal video
    $(".video").click(function () {
      var theModal = $(this).data("target"),
        videoSRC = $(this).attr("data-video"),
        videoSRCauto =
          videoSRC +
          "?modestbranding=1&rel=0&controls=0&showinfo=0&html5=1&autoplay=1";
      $(theModal + " iframe").attr("src", videoSRCauto);
      $(theModal + " button.close").click(function () {
        $(theModal + " iframe").attr("src", videoSRC);
      });
    });
  });
}

// $('.slider').slick({
//     dots: true,
//     infinite: false,
//     speed: 2000,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
// });
if ($(".slider")) {
  $(".slider").slick({
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerPadding: "40px",
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerPadding: "40px",
          slidesToShow: 1,
        },
      },
    ],
  });
}
