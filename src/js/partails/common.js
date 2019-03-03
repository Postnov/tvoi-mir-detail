document.addEventListener('DOMContentLoaded', () => {
  // SLIDERS FOR DETAIL

  // addition products
  $('.js-detail-products').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    nextArrow: '.js-detprod-next',
    prevArrow: '.js-detprod-prev'
  });

  // in start page, main image
  $('.js-detail-main-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: '.js-detail-nav-slider',
    arrows: false,
    infinite: false
  });

  // in start page, thumb image
  $('.js-detail-nav-slider').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.js-detail-main-slider',
    nextArrow: '.js-detnav-next',
    prevArrow: '.js-detnav-prev',
    infinite: false
  });
});
