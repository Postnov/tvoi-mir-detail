document.addEventListener('DOMContentLoaded', () => {

  // slider detail product

  $('.js-detail-products').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    nextArrow: '.js-detprod-next',
    prevArrow: '.js-detprod-prev'
  });


});
