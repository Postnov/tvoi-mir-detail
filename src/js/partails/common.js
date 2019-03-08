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
    prevArrow: '.js-detprod-prev',
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: false
        }
      },
    ]
  });

  // in start page, main image
  $('.js-detail-main-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: '.js-detail-nav-slider',
    arrows: false,
    infinite: false,
    responsive: [
      {
        breakpoint: 990,
        settings: {
          infinite: false,
          arrows: true,
          nextArrow: '.js-detmain-next',
          prevArrow: '.js-detmain-prev',
        }
      }
    ]
  });

  // in start page, thumb image
  $('.js-detail-nav-slider').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    asNavFor: '.js-detail-main-slider',
    nextArrow: '.js-detnav-next',
    prevArrow: '.js-detnav-prev',
    infinite: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      }
    ]
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
    if (!Number.isNaN(value)) {
      e.target.value = value + ' шт.';
    }else {
      e.target.value = '0 шт.';
    }
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
        length = lengthEl.val() || lengthEl.text() || 0,
        width = $(el).find('.js-row-product-width'),
        widthText = width.text(),
        amount = $(el).find('.js-d-count-value'),
        amountVal = amount.val(),
        totalEl = $(el).find('.js-row-product-total'),
        totalRow = 0;

      amountVal = parseInt(amount.val());
      length = parseInt(length, 10);
      widthText = parseInt(widthText, 10);

      if ($(el).hasClass('calc-type-1')) {
        totalRow = (length * widthText * amountVal) / 1000000;
        if (!Number.isNaN(+totalRow)) {
          totalEl.html(totalRow.toLocaleString() + ' м');
        } else {
          totalEl.html('0 м');
        }

        totalRowSum += totalRow;
      }
      if ($(el).hasClass('calc-type-2')) {
        totalRowSum = amountVal;
      }
      if ($(el).hasClass('calc-type-3')) {
        lengthEl.each((i, el) => {
          let res = parseInt(el.innerHTML, 10) * amountVal;
          if (!Number.isNaN(+res)) {
            $(totalEl[i]).find('span.res').text(res.toLocaleString('en-IN'));
          }else {
            $(totalEl[i]).find('span.res').text('0');
          }
        });

        totalRowSum = parseInt(amountVal, 10);
      }
      if ($(el).hasClass('calc-type-4')) {
        let res = length * amountVal;
        if (!Number.isNaN(+res)) {
          $(totalEl).find('span.res').text(res.toLocaleString('en-IN'));
        }else {
          $(totalEl).find('span.res').text('0');
        }

        totalRowSum = parseInt(amountVal, 10);
      }
    });

    totalPrice = (price * totalRowSum).toFixed(0);

    if (!Number.isNaN(+totalPrice)) {
      totalPriceEl.text(Number(totalPrice).toLocaleString());
    } else {
      totalPriceEl.text('0');
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
            console.warn('Выбрано последнее значение - 1250');
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
            console.warn('Выбрано первое значение - 0');
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

  $(document).on('click', '.js-open-modal', function (e) {
    e.preventDefault();

    let dataModal = $(e.target).attr('data-modal'),
      targetModal = $(`.js-modal[data-modal='${dataModal}']`);

    overlay.addClass('is-show');
    targetModal.addClass('is-show');
    $('body').addClass('no-scroll');
  });

  $('.js-modal-close').click(function (e) {
    e.preventDefault();

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


  // tabs on detail
  $('.js-tab-trigger').on('click', function () {
    let tabName = $(this).data('tab'),
      tab = $(`.js-tab-content[data-tab="${tabName}"]`),
      tabsParent = $(this).closest('.js-tabs');

    tabsParent.find('.js-tab-trigger.is-active').removeClass('is-active');
    $(this).addClass('is-active');

    tabsParent.find('.js-tab-content.is-active').removeClass('is-active');
    tab.addClass('is-active');
  });

  // move and accord for mobile tabs
  if ($(window).width() < 769) {
    let accordsContent = document.querySelectorAll('.js-accord-content');

    $('.js-tab-content').each(function(index, item) {
      let content = item.innerHTML;

      accordsContent[index].innerHTML = content;
    });
  }

  // tabs on detail
  $('.js-accord-trigger').on('click', function () {

    let trigger = $(this),
      block = $(this).closest('.js-accord-block'),
      content = block.find('.js-accord-content');

      trigger.toggleClass('is-active');
      content.toggleClass('is-active');
  });


  if ($(window).width() < 768) {
    $('.js-params-link')
    .removeClass('js-params-link')
    .addClass('js-open-modal')
    .attr('data-modal', 'table-params');

    // colors

    $('.js-color-trigger')
      .addClass('link js-open-modal')
      .attr('data-modal', 'another-colors');
  }

  // params in tabs
  $('.js-params-link').click(function () {
    $(this).closest('.js-params').find('.js-params-hidden').toggleClass('is-active');
    $(this).toggleClass('is-active');
  });
});
// end ready
