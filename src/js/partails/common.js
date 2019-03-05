document.addEventListener('DOMContentLoaded', () => {
  let templateRowProduct = $('#new-row-product').html(),
    tableProducts = $('.js-det-table'),
    hiddenBlockLength = $('.js-hide-length'),
    overlay = $('.js-modal-overlay');

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

  $('.js-det-add-product').click(() => {
    tableProducts.append(templateRowProduct);
    checkList();
    calcProductsRow();
  });

  $(document).on('click', '.js-det-row-delete', (e) => {
    $(e.target).closest('.d-i-table__row').remove();
    checkList();
    calcProductsRow();
  });


  $(document).on('click', '.js-d-choice-up, .js-d-choice-down', (e) => {
    switchVariablesLength(e);
    calcProductsRow();
  });

  $(document).on('focusin', '.js-choice-value', (e) => {
    let value = e.target.value;
    e.target.setAttribute('data-previous-value', value);
  });

  $(document).on('focusout', '.js-choice-value', (e) => {
    let value = $(e.target).val(),
      arr = hiddenBlockLength.children(),
      newValue = '';

    value = value.replace(' мм.', '');

    arr.map((i, el) => {
      if (newValue === '') {
        if ($(el).text() === value) {
          newValue = $(el).text();
          $(e.target).val(newValue + ' мм.');
          calcProductsRow();
        }
      }
      return el;
    });

    if (newValue === '') {
      let previousValue = e.target.getAttribute('data-previous-value');
      console.log(previousValue);
      $(e.target).val(previousValue);
      console.warn('Ошибка, такого показателя длинны нет, установлено предыдущее значение');
    }
  });


  // Count product row
  $(document).on('click', '.js-d-count-up, .js-d-count-down', (e) => {
    countProductRow(e);
  });
  $(document).on('keyup', '.js-d-count-value', () => {
    calcProductsRow();
  });
  $(document).on('focusout', '.js-d-count-value', (e) => {
    let value = e.target.value;
    value = parseInt(value, 10);
    e.target.value = value + ' шт.';
  });

  calcProductsRow();

  function calcProductsRow() {
    let totalRowSum = 0,
      totalPrice = 0,
      price = $('.js-det-price').text(),
      totalPriceEl = $('.js-det-total-price');

    price = parseInt(price, 10);

    $('.js-t-product-row').each((i, el) => {
      let lengthEl = $(el).find('.js-choice-value'),
        length = lengthEl.val(),
        width = $(el).find('.js-row-product-width').text(),
        amount = $(el).find('.js-d-count-value').val(),
        totalEl = $(el).find('.js-row-product-total'),
        totalRow = 0;

      length = parseInt(length, 10);
      width = parseInt(width, 10);
      amount = parseInt(amount, 10);

      totalRow = (length * width * amount) / 1000000;
      totalEl.html(totalRow.toLocaleString() + ' м');

      totalRowSum += totalRow;
    });

    totalPrice = (price * totalRowSum).toFixed(0);

    if (!Number.isNaN(totalPrice)) {
      totalPriceEl.text(Number(totalPrice).toLocaleString());
    } else {
      totalPriceEl.text('0 шт.');
    }
  }

  function countProductRow(e) {
    let target = $(e.target),
      parent = target.closest('.js-d-count'),
      valueElem = parent.find('.js-d-count-value'),
      value = parseInt(valueElem.val(), 10);

    if (target.hasClass('js-d-count-up')) {
      value += 1;
      valueElem.val(value + ' шт.');
    } else if (target.hasClass('js-d-count-down') && value > 0) {
      value -= 1;
      valueElem.val(value + ' шт.');
    }

    calcProductsRow();
  }

  function switchVariablesLength(e) {
    let elemValue = $(e.target).closest('.js-choice').find('.js-choice-value'),
      value = elemValue.val(),
      hiddenElemsLength = hiddenBlockLength.children();

    value = value.replace(' мм.', '');

    if ($(e.target).hasClass('js-d-choice-up')) {
      hiddenElemsLength.map((i, el) => {
        if ($(el).text() === value) {
          if ($(el).next().length) {
            value = $(el).next().text() + ' мм.';
            elemValue.val(value);
          } else {
            console.log('Выбрано последнее значение - 1250');
          }
        }
        return el;
      });
    } else if ($(e.target).hasClass('js-d-choice-down')) {
      hiddenElemsLength.map((i, el) => {
        if ($(el).text() === value) {
          if ($(el).prev().length) {
            value = $(el).prev().text() + ' мм.';
            elemValue.val(value);
          } else {
            console.log('Выбрано первое значение - 0');
          }
        }
        return el;
      });
    }
  }

  // check product row for manage visible block with table
  function checkList() {
    let lengthProductRows = $('.d-i-table__row--product').length;
    if (lengthProductRows) {
      $('.js-det-table').show();
    } else {
      $('.js-det-table').hide();
    }
  }


  // MODALS

  $('.js-open-modal').click(function (e) {
    e.preventDefault();

    let dataModal = $(this).attr('data-modal'),
      targetModal = $(`.js-modal[data-modal='${dataModal}']`);

    overlay.addClass('is-show');
    targetModal.addClass('is-show');
    $('body').addClass('no-scroll');
  });

  $('.js-modal-cross').click(function () {
    $(this).closest('.js-modal').removeClass('is-show');
    overlay.removeClass('is-show');
    $('body').removeClass('no-scroll');
  });

  $('.js-modal-form').submit(function (e) {
    e.preventDefault();
    $(this).closest('.js-modal').removeClass('is-show');
    $('.js-modal[data-modal="order-accept"]').addClass('is-show');
  });

  $('.js-modal-overlay').click(function () {
    $('.js-modal.is-show').removeClass('is-show');
    $(this).removeClass('is-show');
    $('body').removeClass('no-scroll');
  });
});
