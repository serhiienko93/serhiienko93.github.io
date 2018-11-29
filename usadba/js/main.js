jQuery(function($){

    var offset = 10;

    $('.load-more').click(function(e){
        e.preventDefault();
        $.post(
            window.location,
            {
                offset: offset,
            },
            function(data){
                if (data.error == false){
                    $('.list-group-cont').append(data.news);
                    
                }
            }       
        );
        offset += 10;
    });

    $('.reservation-panel-tt span').click(function(e){
        if (!$(this).is('active')){
            $(this).addClass('active').siblings().removeClass('active');
            if ($(this).data('f') === 'email') {
                $(this).parent().parent().find('input[data-f=email]').show().focus();
                $(this).parent().parent().find('input[data-f=phone]').hide();
            } else {
                $(this).parent().parent().find('input[data-f=email]').hide();
                $(this).parent().parent().find('input[data-f=phone]').show();
            }
        }
    });

    $('#land-zoom').each(function () {
        var isTouch = 'ontouchstart' in window;
        var $wrapper = $(this);
        var $zoomEls = $wrapper.find('[data-zoom]');
        var $pins = $wrapper.find('.map-pin');
        var $slider = $('.rail-map-slider');

        var factor = isTouch ? .97 : .9;
        var currentZoom = 1;
        var currentZoomLevel = 0;
        var maxZoomLevel = 7 * (isTouch ? 6 : 1);
        var minZoomLevel = -12 * (isTouch ? 6 : 1);
        var mouseX = mouseY = 0;
        var mapMovePx = 15;

        $zoomEls.each(function () {
            var dataObj = JSON.parse($(this).attr('data-zoom'));
            $(this).data('init', dataObj);
        });

        $zoomEls.each(function(){
            var data = $(this).data('init');

            $(this).css({
                top: data.y,
                left: data.x,
                width: data.w,
                height: data.h
            });
        });

        $wrapper.css({
            left: -($wrapper.width() - document.documentElement.clientWidth) / 2,
            top: -($wrapper.height() - document.documentElement.clientHeight) / 2
        });

        $zoomEls.draggable({
            multiple: true
        });

        $slider.slider({
            orientation: "vertical",
            min: minZoomLevel,
            max: maxZoomLevel,
            value: currentZoomLevel,
            step: 1,
            slide: function (e, ui) {
                centerZoom();
                onZoom(ui.value);
            }
        });

        $slider.find('.ui-slider-handle').off('keydown keyup');

        $pins.click(function () {
            var id = $(this).attr('data-id');
            $('.map-pin-info').hide();
            $('#' + id).find('.map-pin-info').show();
        });

        $('.js-zoom .rail-plus').click(function (e) {
            e.preventDefault();
            var level = currentZoomLevel + 1;
            onZoom(level);
        });

        $('.js-zoom .rail-minus').click(function (e) {
            e.preventDefault();
            var level = currentZoomLevel - 1;
            onZoom(level);
        });

        if (isTouch) {
            centerZoom();
        }

        function centerZoom () {
            var offset = $wrapper.offset();
            mouseX = parseInt(document.documentElement.clientWidth / 2 - offset.left);
            mouseY = parseInt(document.documentElement.clientHeight / 2 - offset.top);
        }

        function onMouseMove(event) {
            event = event || window.event;
            var offset = $wrapper.offset();
            mouseX = event.pageX - offset.left;
            mouseY = event.pageY - offset.top;
        }

        function onZoom (level) {
            if (level <= minZoomLevel - 1) {
                setSlider();
                return;
            }
            if (level >= maxZoomLevel + 1) {
                setSlider();
                return;
            }

            var delta = currentZoomLevel > level ? -1 : 1;
            currentZoomLevel = level;
            var currentFactor = delta < 0 ? factor : 1/factor;
            currentZoom *= currentFactor;

            setZoom(currentZoom, currentFactor);
            setSlider();
        }

        function setZoom (currentZoom, currentFactor) {
            $zoomEls.each(function () {
                var $el = $(this);
                var data = $el.data('init');
                var offset = $el.position();
                var dx = (mouseX - offset.left) * (currentFactor - 1);
                var dy = (mouseY - offset.top) * (currentFactor - 1);

                var width = data.w * currentZoom;
                var height = data.h * currentZoom;
                var left = offset.left - dx;
                var top = offset.top - dy;

                $el.css({
                    width: width,
                    height: height,
                    left: left,
                    top: top
                });
            });
        }

        function setSlider () {
            $slider.slider("option", "value", currentZoomLevel);
        }

        function mapMove (e) {
            var e = e || window.event;
            var keyCode = e.keyCode;

            //go left
            if (keyCode === 37) {
                $zoomEls.animate({left: "+=" + mapMovePx + "px"}, 0);
                return;
            }

            //go up
            if (keyCode === 38) {
                $zoomEls.animate({top: "+=" + mapMovePx + "px"}, 0);
                return;
            }

            //go right
            if (keyCode === 39) {
                $zoomEls.animate({left: "-=" + mapMovePx + "px"}, 0);
                return;
            }

            //go down
            if (keyCode === 40) {
                $zoomEls.animate({top: "-=" + mapMovePx + "px"}, 0);
            }
        }

        if (!isTouch) $(window).on('mousemove.map', onMouseMove);

        $wrapper.on("mousewheel.zoom", function (event) {
            var delta = event.originalEvent.wheelDelta / 120;
            var level = delta > 0 ? (currentZoomLevel + 1) : (currentZoomLevel - 1);
            onZoom(level);
        });

        if (!isTouch) $(window).on('keydown.mapmove', mapMove);

        if (isTouch) {
            $('body').addClass('_touch');

            $.getScript('js/libsmin/hammer.min.js', function () {
                var touchEvents = new Hammer(document.documentElement, {});
                touchEvents.get('pinch').set({ enable: true, domEvents: false });

                touchEvents.on('pinchin', function(e) {
                    $('.js-zoom .rail-minus').trigger('click');
                });

                touchEvents.on('pinchout', function(e) {
                    $('.js-zoom .rail-plus').trigger('click');
                });
            });
        }
    });

  $('input[placeholder], textarea[placeholder]').placeholder();
  $(".mask-phone").mask("+7 (999) 999-99-99");


  $(".mask-phone-bg").mask("+7 999 999 99 99");


  $('.open-modal').magnificPopup({
    type:'inline',
    midClick: true
  });


$('.reservation-panel-tt').on('click', 'span:not(.active)', function() {

  $(this).addClass('active').siblings().removeClass('active')

    .parents('div.reservation-panel-item').find('div.box').eq($(this).index()).fadeIn(500).siblings('div.box').hide();

})


  $("a.scrollto").click(function () {
    var elementClick = $(this).attr("href")
    var destination = $(elementClick).offset().top;
    jQuery("html:not(:animated),body:not(:animated)").animate({scrollTop: destination}, 800);
    return false;
  });

jcf.setOptions('Select', {
  wrapNative: false,
  multipleCompactStyle: true,
  maxVisibleItems: 6,
  useCustomScroll: false
});


  $('.image-popup').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    mainClass: 'mfp-img-mobile',
    image: {
      verticalFit: true
    }
    
  });

  jcf.replaceAll();


  var owl = $('.cottages-slider').owlCarousel({
    items: 1,
    loop:true,
    margin: 0,
    autoplay:true,
    autoplayTimeout:7000,
    autoplaySpeed:1000,
    nav: false,
    dots: false,
    dotsContainer: '.cottages-tab',
    navSpeed: 1000
  });

    owl.on('changed.owl.carousel', function(e) {
        $('.cottages-tab .cottages-tab__item').removeClass('active');
        var i = parseInt($('.owl-item.active .cottages-img').data('i')) + 1;
        if (i > 2) i = 0;
        var active = $('.cottages-tab .cottages-tab__item[data-i=' + i + ']');
        $(active).addClass('active');
        if ($(active).offset().left + $(active).width() > $(window).width()) {
            var x = $('.cottages-tab').scrollLeft() + $(active).offset().left + $(active).width() - $(window).width();
            $('.cottages-tab').animate({scrollLeft:x}, 500, 'swing');
        }
        if ($(active).offset().left < 0) {
            $('.cottages-tab').animate({scrollLeft:0}, 500, 'swing');
        }
    });

  $('.additional-information-tt').click(function(){
   if($(this).parent().is('.additional-information-open')){
    $(this).parent().removeClass('additional-information-open');
    $(this).parent().find('.additional-information-cont').slideUp(200);
   }else{
    $('.additional-information').removeClass('additional-information-open');
    $(this).parent().addClass('additional-information-open');
    $('.additional-information-cont').slideUp(200);
    $(this).parent().find('.additional-information-cont').slideDown(200);
   }
  });



// $('.cottages-slider .owl-next').on('click', function (e) {
//         $('.cottages-tab .cottages-tab__item').removeClass('active');
//         var i = $('.owl-item.active div').data('i');
//         var active = $('.cottages-tab .cottages-tab__item[data-i=' + i + ']');
//         $(active).addClass('active');
//         if ($(active).offset().left + $(active).width() > $(window).width()) {
//             $('.cottages-tab').offset({left: $(window).width() - $(active).offset().left - $(active).width()});
//         }
//         if ($(active).offset().left < 0) {
//             $('.cottages-tab').offset({left: 16});
//         }
//     });
//
// $('.cottages-slider .owl-prev').on('click', function (e) {
//         $('.cottages-tab .cottages-tab__item').removeClass('active');
//         var i = $('.owl-item.active .cottages-img').data('i');
//         var active = $('.cottages-tab .cottages-tab__item[data-i=' + i + ']');
//         $(active).addClass('active');
//         if ($(active).offset().left + $(active).width() > $(window).width()) {
//             $('.cottages-tab').offset({left: $(window).width() - $(active).offset().left - $(active).width()});
//         }
//         if ($(active).offset().left < 0) {
//             $('.cottages-tab').offset({left: 16});
//         }
//     });

$('.cottages-tab').on('mouseover', 'li', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('.cottages-tab .cottages-tab__item').removeClass('active');
        $(this).addClass('active');
        owl.trigger('to.owl.carousel', [$(this).index(), 1000]);
    });

  // add-open-class
  $('.burger-menu').click(function(){
   if($(this).parent().is('.menu-burger--opened')){
     $(this).parent().removeClass('menu-burger--opened');
     $('body').removeClass('menu-open-wrapper-page');
   }else{
     $(this).parent().addClass('menu-burger--opened');
     $('body').addClass('menu-open-wrapper-page');
   }
  });

  // add-open-class
  $('.menu-item__link--dd-open').click(function(){
   if($(this).parent().is('.menu-item--dd-opened')){
    $(this).parent().removeClass('menu-item--dd-opened');
   }else{
    $(this).parent().addClass('menu-item--dd-opened');
   }
  });


  $('.close-modal').click(function(){
   if($(this).parent().is('.modal-info')){
     $('.modal-info-wrap').removeClass('modal-open');
   }
  });

  $('.order-transfer-btn').click(function(){
   if($(this).parent().is('.order-transfer--opened')){
     $(this).parent().removeClass('order-transfer--opened');
     $('.order-transfer-cont').removeClass('order-transfer-open');
   }else{
     $(this).parent().addClass('order-transfer--opened');
     $('.order-transfer-cont').addClass('order-transfer-open');
   }
  });

  // $(document).bind('click touchstart', function(e) {
  //   var $clicked = $(e.target);
  //   if (! $clicked.parents().hasClass("map-pin-and-info-wrapper")){
  //     $(".map-pin-info-wpapp").removeClass("show-map-pin-info");
  //     $(".map-pin-icon").removeClass("map-pin-icon-opened");
  //   }
  // });

  $('.map-pin-icon').click(function(){
    $(".map-pin-icon").removeClass("map-pin-icon-opened");
    $(this).addClass('map-pin-icon-opened');
  });



  $('.map-pin-icon-home').click(function(){
    $('.map-pin-info').hide();
    $('.map-pin-info-wpapp').addClass('show-map-pin-info');
    $(`#modal-${$(this).data('id')}`).show();
  });

  $('.home-form-bg').click(function(){
    $('.map-pin-info').hide();
    $('.map-pin-info-wpapp').removeClass('show-map-pin-info');
    $('.map-pin-info-wpapp').addClass('show-map-pin-info');
  });

  $('.close-map-pin').click(function(){
    $(this).parent().hide();
    $('.map-pin-info-wpapp').removeClass('show-map-pin-info');
  });




  $(window).on('load scroll',function(){ 
    if ($(this).scrollTop() >= '200') {
        $('.burger-menu').addClass("show");
    }
    else  {$('.burger-menu').removeClass("show");}
  });

    $.datepicker._updateDatepicker_original = $.datepicker._updateDatepicker;
    $.datepicker._updateDatepicker = function(inst) {
        $.datepicker._updateDatepicker_original(inst);
        var afterShow = this._get(inst, 'afterShow');
        if (afterShow)
            afterShow.apply((inst.input ? inst.input[0] : null));
    };

    var drawRange = function() {
        if (!$('#datepicker2').length) return;
        $('.ui-datepicker-calendar tbody td').each(function(i,a){
            var d = $(a).data();
            var day = parseInt($(a).find('a').html());
            var year = d.year;
            var month = parseInt(d.month);
            var date = +new Date(year, month, day, 0, 0, 0);
            // $('.reservation-panel-wrap').prepend(date + ' ');
            if (date >= +new Date(dateFrom) && date <= +new Date(dateTo)) {
                $(a).addClass('selected');
                $(a).find('a').addClass('ui-state-active');
            }
            if (date === +new Date(dateFrom)) {
                $(a).addClass('selected-start');
            }
            if (date === +new Date(dateTo)) {
                $(a).addClass('selected-end');
            }
        });
    };
    var dateFrom = null;
    var dateTo = null;
    var dateFormat = "dd M",
        from = $("#datepicker")
            .datepicker({
                dateFormat: "dd M",
                minDate: 0,
                maxDate:"+30M +10D",
                showOtherMonths: true,
                selectOtherMonths: true,
                monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                monthNamesShort: [ "Янв","Фев","Мар","Апр","Май","Июн", "Июл","Авг","Сен","Окт","Ноя","Дек" ],
                dayNamesMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
                onSelect: function(d, ui){
                    to.datepicker("option", "minDate", d);
                    dateFrom = from.datepicker('getDate');
                    if (+new Date(dateFrom) > +new Date(dateTo)) {
                        dateTo = new Date(+new Date(dateFrom) + 6*24*60*60*1000);
                        to.datepicker("setDate", dateTo);
                    }
                },
                afterShow: function(d, ui) {
                    drawRange();
                }
            })
            .on("change", function(u) {
                // $(this).parent().addClass('selected-start');
                to.datepicker( "option", "minDate", getDate(this));
            }),
        to = $("#datepicker2").datepicker({
            dateFormat: "dd M",
            minDate: "+1d",
            maxDate:"+30M +10D",
            // defaultDate: "+1d",
            showOtherMonths: true,
            selectOtherMonths: true,
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            monthNamesShort: [ "Янв","Фев","Мар","Апр","Май","Июн", "Июл","Авг","Сен","Окт","Ноя","Дек" ],
            dayNamesMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            onSelect: function(d, ui) {
                dateTo = to.datepicker('getDate');
                // from.datepicker("option", "maxDate", d);
            },
            afterShow: function(d, ui) {
                drawRange();
            }
        })
            .on("change", function() {
                from.datepicker("option", "maxDate", getDate(this));
            });
    from.datepicker("setDate", "+0d");
    to.datepicker("setDate", "+1d");
    if (dateFrom) {
        $('#date').val($.datepicker.formatDate('yy-mm-dd', dateFrom));
        var nights = (dateTo - dateFrom)/1000/60/60/24 - 1;
        $('#nights').val(nights);
    }
    dateFrom = $("#datepicker").datepicker("getDate");
    dateTo = $("#datepicker2").datepicker("getDate");

    if ('ontouchstart' in window) {
        $('#datepicker, #datepicker2').attr('disabled', 'disabled').on('touchstart', function () {
            $(this).datepicker("show");
        });
    }

    function getDate( element ) {
        var date;
        try {
            // date = $.datepicker.parseDate( dateFormat, element.value );
            date = element.value;
            // console.log(date)
        } catch( error ) {
            date = null;
        }

        return date;
    }

    $('.reservation-form').submit(function(){
        $('#adults').val($('#adults').val().replace(/^0+/,''));
        $('#children').val($('#children').val().replace(/^0+/,''));
        $('#date').val($.datepicker.formatDate('yy-mm-dd', $("#datepicker").datepicker('getDate')));
        var nights = ($("#datepicker2").datepicker("getDate") - $("#datepicker").datepicker("getDate"))/1000/60/60/24;
        // console.log(($("#datepicker2").datepicker("getDate") - $("#datepicker").datepicker("getDate"))/1000/60/60/24);
        $('#nights').val(nights);
        // return false;
    });
    // $('#datepicker, #datepicker2').datepicker({
    //     dateFormat: "dd M",
    //     minDate: 0,
    //     maxDate:"+30M +10D",
    //     showOtherMonths: true,
    //     selectOtherMonths: true,
    //     monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    //     monthNamesShort: [ "Янв","Фев","Мар","Апр","Май","Июн", "Июл","Авг","Сен","Окт","Ноя","Дек" ],
    //     dayNamesMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    //     range: 'period'
    // });

  $('.feedback-form').submit(function(){
    var $form = $(this);
    if (!$form.find('input[name="agreement"]').prop('checked')) {
        return false;
    }
  });
  $('.slider-cont').owlCarousel({
    items: 1,
    lazyLoad: false,
    loop: true,
    nav: true,
    dots: true,
    navSpeed: 1500,
    dotsSpeed: 1500
  });

  $('.slider-banner').owlCarousel({
    items: 1,
    lazyLoad: false,
    loop: true,
    nav: true,
    dots: true,
    navSpeed: 1500,
    dotsSpeed: 1500
  });




    $('.reservation-panel-item [type=number]').change(function(e){
      var v = parseInt($(this).val());
      if (v) {
        $(this).val(('0' + String(v)).slice(-2));
        }
    });


    $('input.error').focus(function(){
        var $this = $(this);
        
        if(this.focus){
          $(this).parent().removeClass('st-form-error');
        }
      });


    $('input.introduced-txt').focus(function(){
        var $this = $(this);
        
        if(this.focus){
          $(this).parent().addClass('introduced-txt-active');
        }else{
          $(this).parent().removeClass('introduced-txt-active');
        }
      });



    $('ul.tabs-nav').on('click', 'li:not(.active)', function() {

      $(this).addClass('active').siblings().removeClass('active')

        .parents('.korpus').find('div.box').eq($(this).index()).fadeIn(500).siblings('div.box').hide();

    });

    $('.block-header').click(function(e){
        e.preventDefault();
        $('.block-header').removeClass('active');
        $(this).addClass('active');
        $('.transfer-content').removeClass('visible');
        var $content = $(`.transfer-content-${$(this).data('id')}`);
        $content.addClass('visible');
        $content.find('.content-header').removeClass('active');
        $content.find('.content-header').first().addClass('active');
        $content.find('.transfer-description').removeClass('visible');
        $content.find('.transfer-description').first().addClass('visible');

    });

    $('.content-header').click(function(e){
        e.preventDefault();
        $('.content-header').removeClass('active');
        $(this).addClass('active');
        $('.transfer-description').removeClass('visible');
        $(`.transfer-description-${$(this).data('id')}`).addClass('visible');
    });

    $('.list-group-link').hover(function(){
        $(this).addClass('active');
    }, function(){
        $(this).removeClass('active');
    });
    if (typeof Cookies !== 'undefined' && !Cookies.get('welcome')) {
        $('.modal-info-wrap').addClass('modal-open');
        Cookies.set('welcome', true, { expires: 7 });
    }
    if (typeof Cookies !== 'undefined' && Cookies.get('news')) {
        $.get(
            "/get-news-num/",
            {
                date: Cookies.get('news')
            },
            function(data){
                if (data.error == false && data.news_num > 0) {
                    $('.informer-news-number').text(data.news_num);
                    // my eyes bleeding, while I writing this
                    var lang = $('html').attr('lang');
                    var newsStrings = {
                        'ru': ['новость', 'новости', 'новостей'],
                        'en': ['news', 'news', 'news']
                    };
                    if (data.news_num < 21 && data.news_num > 4) {
                        $('.news-num').text(newsStrings[lang][2]);
                    } else if(data.news_num.toString().charAt(data.news_num.toString().length - 1) === '1') {
                        $('.news-num').text(newsStrings[lang][0]);
                    } else if(['1', '2', '3'].includes(data.news_num.toString().charAt(data.news_num.toString().length - 1))) {
                        $('.news-num').text(newsStrings[lang][1]);
                    } else {
                        $('.news-num').text(newsStrings[lang][2]);
                    }
                }
            }
        );
    }

    $('#book-restaurant-form').submit(function(){
        var form = $(this);
        $('#date').val(
            $.datepicker.formatDate(
                'yy-mm-dd', $("#datepicker").datepicker('getDate')
            ) + ' ' + $('#time').val()
        );
        $.post(
            form.attr("action"),
            form.serialize(),
            function(data){
                if (data.error == false) {
                    $('.modal-info-wrap').addClass('modal-open');
                }
            }
        );
        return false;
    });

    $('#book-hall-form').submit(function(){
        var form = $(this);
        $('#date').val(
            $.datepicker.formatDate('yy-mm-dd', $("#datepicker").datepicker('getDate'))
        );
        $.post(
            form.attr("action"),
            form.serialize(),
            function(data){
                if (data.error == false) {
                    $('.modal-info-wrap').addClass('modal-open');
                }
                
            }
        );
        return false;
    });

    $('.link-video').click(function(){
        // $('.section-main-video video').get(0).play();
        if($('.section-main-screen').is('.section-main-screen--play')){
         $('.section-main-screen').removeClass('section-main-screen--play');
        }else{
         $('.section-main-screen').addClass('section-main-screen--play');
        }
    });



  

});

  var vid = document.getElementById("myVideo"); 
  function playVid() { 
      vid.play(); 
  } 
  function pauseVid() { 
      vid.pause(); 
  } 

 $.datepicker._get_original=$.datepicker._get,$.datepicker._get=function(t,e){var i=$.datepicker._get_original(t,e),a=t.settings.range;if(!a)return i;var s=this;switch(a){case"period":case"multiple":var n=$(this.dpDiv).data("datepickerExtensionRange");switch(n||(n=new _datepickerExtension,$(this.dpDiv).data("datepickerExtensionRange",n)),n.range=a,n.range_multiple_max=t.settings.range_multiple_max||0,e){case"onSelect":var r=i;r||(r=function(){}),i=function(t,e){n.onSelect(t,e),r(t,e,n),s._datepickerShowing=!1,setTimeout(function(){s._updateDatepicker(e),s._datepickerShowing=!0}),n.setClassActive(e)};break;case"beforeShowDay":var r=i;r||(r=function(){return[!0,""]}),i=function(t){var e=r(t);return e=n.fillDay(t,e)};break;case"beforeShow":var r=i;r||(r=function(){}),i=function(t,e){r(t,e),n.setClassActive(e)};break;case"onChangeMonthYear":var r=i;r||(r=function(){}),i=function(t,e,i){r(t,e,i),n.setClassActive(i)}}}return i},$.datepicker._setDate_original=$.datepicker._setDate,$.datepicker._setDate=function(t,e,i){var a=t.settings.range;if(!a)return $.datepicker._setDate_original(t,e,i);var s=this.dpDiv.data("datepickerExtensionRange");if(!s)return $.datepicker._setDate_original(t,e,i);switch(a){case"period":("object"!=typeof e||void 0==e.length)&&(e=[e,e]),s.step=0,$.datepicker._setDate_original(t,e[0],i),s.startDate=this._getDate(t),s.startDateText=this._formatDate(t),$.datepicker._setDate_original(t,e[1],i),s.endDate=this._getDate(t),s.endDateText=this._formatDate(t),s.setClassActive(t);break;case"multiple":("object"!=typeof e||void 0==e.length)&&(e=[e]),s.dates=[],s.datesText=[];var n=this;$.map(e,function(e){$.datepicker._setDate_original(t,e,i),s.dates.push(n._getDate(t)),s.datesText.push(n._formatDate(t))}),s.setClassActive(t)}};var _datepickerExtension=function(){this.range=!1,this.range_multiple_max=0,this.step=0,this.dates=[],this.datesText=[],this.startDate=null,this.endDate=null,this.startDateText="",this.endDateText="",this.onSelect=function(t,e){switch(this.range){case"period":return this.onSelectPeriod(t,e);case"multiple":return this.onSelectMultiple(t,e)}},this.onSelectPeriod=function(t,e){this.step++,this.step%=2,this.step?(this.startDate=this.getSelectedDate(e),this.endDate=this.startDate,this.startDateText=t,this.endDateText=this.startDateText):(this.endDate=this.getSelectedDate(e),this.endDateText=t,this.startDate.getTime()>this.endDate.getTime()&&(this.endDate=this.startDate,this.startDate=this.getSelectedDate(e),this.endDateText=this.startDateText,this.startDateText=t))},this.onSelectMultiple=function(t,e){var i=this.getSelectedDate(e),a=-1;$.map(this.dates,function(t,e){t.getTime()==i.getTime()&&(a=e)});var s=$.inArray(t,this.datesText);-1!=a?this.dates.splice(a,1):this.dates.push(i),-1!=s?this.datesText.splice(s,1):this.datesText.push(t),this.range_multiple_max&&this.dates.length>this.range_multiple_max&&(this.dates.splice(0,1),this.datesText.splice(0,1))},this.fillDay=function(t,e){var i=e[1];switch(1==t.getDate()&&(i+=" first-of-month"),t.getDate()==new Date(t.getFullYear(),t.getMonth()+1,0).getDate()&&(i+=" last-of-month"),e[1]=i.trim(),this.range){case"period":return this.fillDayPeriod(t,e);case"multiple":return this.fillDayMultiple(t,e)}},this.fillDayPeriod=function(t,e){if(!this.startDate||!this.endDate)return e;var i=e[1];return t>=this.startDate&&t<=this.endDate&&(i+=" selected"),t.getTime()==this.startDate.getTime()&&(i+=" selected-start"),t.getTime()==this.endDate.getTime()&&(i+=" selected-end"),e[1]=i.trim(),e},this.fillDayMultiple=function(t,e){var i=e[1],a=!1;return $.map(this.dates,function(e){e.getTime()==t.getTime()&&(a=!0)}),a&&(i+=" selected selected-start selected-end"),e[1]=i.trim(),e},this.getSelectedDate=function(t){return new Date(t.selectedYear,t.selectedMonth,t.selectedDay)},this.setClassActive=function(t){var e=this;setTimeout(function(){$("td.selected > *",t.dpDiv).addClass("ui-state-active"),"multiple"==e.range&&$("td:not(.selected)",t.dpDiv).removeClass("ui-datepicker-current-day").children().removeClass("ui-state-active")})}};


//Plugin placeholder
(function(b,f,i){function l(){b(this).find(c).each(j)}function m(a){for(var a=a.attributes,b={},c=/^jQuery\d+/,e=0;e<a.length;e++)if(a[e].specified&&!c.test(a[e].name))b[a[e].name]=a[e].value;return b}function j(){var a=b(this),d;a.is(":password")||(a.data("password")?(d=a.next().show().focus(),b("label[for="+a.attr("id")+"]").attr("for",d.attr("id")),a.remove()):a.realVal()==a.attr("placeholder")&&(a.val(""),a.removeClass("placeholder")))}function k(){var a=b(this),d,c;placeholder=a.attr("placeholder");
b.trim(a.val()).length>0||(a.is(":password")?(c=a.attr("id")+"-clone",d=b("<input/>").attr(b.extend(m(this),{type:"text",value:placeholder,"data-password":1,id:c})).addClass("placeholder"),a.before(d).hide(),b("label[for="+a.attr("id")+"]").attr("for",c)):(a.val(placeholder),a.addClass("placeholder")))}var g="placeholder"in f.createElement("input"),h="placeholder"in f.createElement("textarea"),c=":input[placeholder]";b.placeholder={input:g,textarea:h};!i&&g&&h?b.fn.placeholder=function(){}:(!i&&g&&
!h&&(c="textarea[placeholder]"),b.fn.realVal=b.fn.val,b.fn.val=function(){var a=b(this),d;if(arguments.length>0)return a.realVal.apply(this,arguments);d=a.realVal();a=a.attr("placeholder");return d==a?"":d},b.fn.placeholder=function(){this.filter(c).each(k);return this},b(function(a){var b=a(f);b.on("submit","form",l);b.on("focus",c,j);b.on("blur",c,k);a(c).placeholder()}))})(jQuery,document,window.debug);

//checkbox
!function(e){e.addModule(function(e){"use strict";return{name:"Checkbox",selector:'input[type="checkbox"]',options:{wrapNative:!0,checkedClass:"jcf-checked",uncheckedClass:"jcf-unchecked",labelActiveClass:"jcf-label-active",fakeStructure:'<span class="jcf-checkbox"><span></span></span>'},matchElement:function(e){return e.is(":checkbox")},init:function(){this.initStructure(),this.attachEvents(),this.refresh()},initStructure:function(){this.doc=e(document),this.realElement=e(this.options.element),this.fakeElement=e(this.options.fakeStructure).insertAfter(this.realElement),this.labelElement=this.getLabelFor(),this.options.wrapNative?this.realElement.appendTo(this.fakeElement).css({position:"absolute",height:"100%",width:"100%",opacity:0,margin:0}):this.realElement.addClass(this.options.hiddenClass)},attachEvents:function(){this.realElement.on({focus:this.onFocus,click:this.onRealClick}),this.fakeElement.on("click",this.onFakeClick),this.fakeElement.on("jcf-pointerdown",this.onPress)},onRealClick:function(e){var t=this;this.savedEventObject=e,setTimeout(function(){t.refresh()},0)},onFakeClick:function(e){this.options.wrapNative&&this.realElement.is(e.target)||this.realElement.is(":disabled")||(delete this.savedEventObject,this.stateChecked=this.realElement.prop("checked"),this.realElement.prop("checked",!this.stateChecked),this.fireNativeEvent(this.realElement,"click"),this.savedEventObject&&this.savedEventObject.isDefaultPrevented()?this.realElement.prop("checked",this.stateChecked):this.fireNativeEvent(this.realElement,"change"),delete this.savedEventObject)},onFocus:function(){this.pressedFlag&&this.focusedFlag||(this.focusedFlag=!0,this.fakeElement.addClass(this.options.focusClass),this.realElement.on("blur",this.onBlur))},onBlur:function(){this.pressedFlag||(this.focusedFlag=!1,this.fakeElement.removeClass(this.options.focusClass),this.realElement.off("blur",this.onBlur))},onPress:function(e){this.focusedFlag||"mouse"!==e.pointerType||this.realElement.focus(),this.pressedFlag=!0,this.fakeElement.addClass(this.options.pressedClass),this.doc.on("jcf-pointerup",this.onRelease)},onRelease:function(e){this.focusedFlag&&"mouse"===e.pointerType&&this.realElement.focus(),this.pressedFlag=!1,this.fakeElement.removeClass(this.options.pressedClass),this.doc.off("jcf-pointerup",this.onRelease)},getLabelFor:function(){var t=this.realElement.closest("label"),s=this.realElement.prop("id");return!t.length&&s&&(t=e('label[for="'+s+'"]')),t.length?t:null},refresh:function(){var e=this.realElement.is(":checked"),t=this.realElement.is(":disabled");this.fakeElement.toggleClass(this.options.checkedClass,e).toggleClass(this.options.uncheckedClass,!e).toggleClass(this.options.disabledClass,t),this.labelElement&&this.labelElement.toggleClass(this.options.labelActiveClass,e)},destroy:function(){this.options.wrapNative?this.realElement.insertBefore(this.fakeElement).css({position:"",width:"",height:"",opacity:"",margin:""}):this.realElement.removeClass(this.options.hiddenClass),this.fakeElement.off("jcf-pointerdown",this.onPress),this.fakeElement.remove(),this.doc.off("jcf-pointerup",this.onRelease),this.realElement.off({focus:this.onFocus,click:this.onRealClick})}}})}(jcf);


/* mask input*/
(function(e){function t(){var e=document.createElement("input"),t="onpaste";return e.setAttribute(t,""),"function"==typeof e[t]?"paste":"input"}var n,a=t()+".mask",r=navigator.userAgent,i=/iphone/i.test(r),o=/android/i.test(r);e.mask={definitions:{9:"[0-9]",a:"[A-Za-z]","*":"[A-Za-z0-9]"},dataName:"rawMaskFn",placeholder:""},e.fn.extend({caret:function(e,t){var n;if(0!==this.length&&!this.is(":hidden"))return"number"==typeof e?(t="number"==typeof t?t:e,this.each(function(){this.setSelectionRange?this.setSelectionRange(e,t):this.createTextRange&&(n=this.createTextRange(),n.collapse(!0),n.moveEnd("character",t),n.moveStart("character",e),n.select())})):(this[0].setSelectionRange?(e=this[0].selectionStart,t=this[0].selectionEnd):document.selection&&document.selection.createRange&&(n=document.selection.createRange(),e=0-n.duplicate().moveStart("character",-1e5),t=e+n.text.length),{begin:e,end:t})},unmask:function(){return this.trigger("unmask")},mask:function(t,r){var c,l,s,u,f,h;return!t&&this.length>0?(c=e(this[0]),c.data(e.mask.dataName)()):(r=e.extend({placeholder:e.mask.placeholder,completed:null},r),l=e.mask.definitions,s=[],u=h=t.length,f=null,e.each(t.split(""),function(e,t){"?"==t?(h--,u=e):l[t]?(s.push(RegExp(l[t])),null===f&&(f=s.length-1)):s.push(null)}),this.trigger("unmask").each(function(){function c(e){for(;h>++e&&!s[e];);return e}function d(e){for(;--e>=0&&!s[e];);return e}function m(e,t){var n,a;if(!(0>e)){for(n=e,a=c(t);h>n;n++)if(s[n]){if(!(h>a&&s[n].test(R[a])))break;R[n]=R[a],R[a]=r.placeholder,a=c(a)}b(),x.caret(Math.max(f,e))}}function p(e){var t,n,a,i;for(t=e,n=r.placeholder;h>t;t++)if(s[t]){if(a=c(t),i=R[t],R[t]=n,!(h>a&&s[a].test(i)))break;n=i}}function g(e){var t,n,a,r=e.which;8===r||46===r||i&&127===r?(t=x.caret(),n=t.begin,a=t.end,0===a-n&&(n=46!==r?d(n):a=c(n-1),a=46===r?c(a):a),k(n,a),m(n,a-1),e.preventDefault()):27==r&&(x.val(S),x.caret(0,y()),e.preventDefault())}function v(t){var n,a,i,l=t.which,u=x.caret();t.ctrlKey||t.altKey||t.metaKey||32>l||l&&(0!==u.end-u.begin&&(k(u.begin,u.end),m(u.begin,u.end-1)),n=c(u.begin-1),h>n&&(a=String.fromCharCode(l),s[n].test(a)&&(p(n),R[n]=a,b(),i=c(n),o?setTimeout(e.proxy(e.fn.caret,x,i),0):x.caret(i),r.completed&&i>=h&&r.completed.call(x))),t.preventDefault())}function k(e,t){var n;for(n=e;t>n&&h>n;n++)s[n]&&(R[n]=r.placeholder)}function b(){x.val(R.join(""))}function y(e){var t,n,a=x.val(),i=-1;for(t=0,pos=0;h>t;t++)if(s[t]){for(R[t]=r.placeholder;pos++<a.length;)if(n=a.charAt(pos-1),s[t].test(n)){R[t]=n,i=t;break}if(pos>a.length)break}else R[t]===a.charAt(pos)&&t!==u&&(pos++,i=t);return e?b():u>i+1?(x.val(""),k(0,h)):(b(),x.val(x.val().substring(0,i+1))),u?t:f}var x=e(this),R=e.map(t.split(""),function(e){return"?"!=e?l[e]?r.placeholder:e:void 0}),S=x.val();x.data(e.mask.dataName,function(){return e.map(R,function(e,t){return s[t]&&e!=r.placeholder?e:null}).join("")}),x.attr("readonly")||x.one("unmask",function(){x.unbind(".mask").removeData(e.mask.dataName)}).bind("focus.mask",function(){clearTimeout(n);var e;S=x.val(),e=y(),n=setTimeout(function(){b(),e==t.length?x.caret(0,e):x.caret(e)},10)}).bind("blur.mask",function(){y(),x.val()!=S&&x.change()}).bind("keydown.mask",g).bind("keypress.mask",v).bind(a,function(){setTimeout(function(){var e=y(!0);x.caret(e),r.completed&&e==x.val().length&&r.completed.call(x)},0)}),y()}))}})})(jQuery);


!function(e){e.addModule(function(e){"use strict";return{name:"Number",selector:'input[type="number"]',options:{realElementClass:"jcf-real-element",fakeStructure:'<span class="jcf-number"><span class="jcf-btn-inc"></span><span class="jcf-btn-dec"></span></span>',btnIncSelector:".jcf-btn-inc",btnDecSelector:".jcf-btn-dec",pressInterval:150},matchElement:function(e){return e.is(this.selector)},init:function(){this.initStructure(),this.attachEvents(),this.refresh()},initStructure:function(){this.page=e("html"),this.realElement=e(this.options.element).addClass(this.options.realElementClass),this.fakeElement=e(this.options.fakeStructure).insertBefore(this.realElement).prepend(this.realElement),this.btnDec=this.fakeElement.find(this.options.btnDecSelector),this.btnInc=this.fakeElement.find(this.options.btnIncSelector),this.initialValue=parseFloat(this.realElement.val())||0,this.minValue=parseFloat(this.realElement.attr("min")),this.maxValue=parseFloat(this.realElement.attr("max")),this.stepValue=parseFloat(this.realElement.attr("step"))||1,this.minValue=isNaN(this.minValue)?-(1/0):this.minValue,this.maxValue=isNaN(this.maxValue)?1/0:this.maxValue,isFinite(this.maxValue)&&(this.maxValue-=(this.maxValue-this.minValue)%this.stepValue)},attachEvents:function(){this.realElement.on({focus:this.onFocus}),this.btnDec.add(this.btnInc).on("jcf-pointerdown",this.onBtnPress)},onBtnPress:function(e){var t,s=this;this.realElement.is(":disabled")||(t=this.btnInc.is(e.currentTarget),s.step(t),clearInterval(this.stepTimer),this.stepTimer=setInterval(function(){s.step(t)},this.options.pressInterval),this.page.on("jcf-pointerup",this.onBtnRelease))},onBtnRelease:function(){clearInterval(this.stepTimer),this.page.off("jcf-pointerup",this.onBtnRelease)},onFocus:function(){this.fakeElement.addClass(this.options.focusClass),this.realElement.on({blur:this.onBlur,keydown:this.onKeyPress})},onBlur:function(){this.fakeElement.removeClass(this.options.focusClass),this.realElement.off({blur:this.onBlur,keydown:this.onKeyPress})},onKeyPress:function(e){38!==e.which&&40!==e.which||(e.preventDefault(),this.step(38===e.which))},step:function(e){var t=parseFloat(this.realElement.val()),s=t||0,i=this.stepValue*(e?1:-1),n=isFinite(this.minValue)?this.minValue:this.initialValue-Math.abs(s*this.stepValue),a=Math.abs(n-s)%this.stepValue;a?e?s+=i-a:s-=a:s+=i,s<this.minValue?s=this.minValue:s>this.maxValue&&(s=this.maxValue),s!==t&&(this.realElement.val(s).trigger("change"),this.refresh())},refresh:function(){var e=this.realElement.is(":disabled"),t=parseFloat(this.realElement.val());this.fakeElement.toggleClass(this.options.disabledClass,e),this.btnDec.toggleClass(this.options.disabledClass,t===this.minValue),this.btnInc.toggleClass(this.options.disabledClass,t===this.maxValue)},destroy:function(){this.realElement.removeClass(this.options.realElementClass).insertBefore(this.fakeElement),this.fakeElement.remove(),clearInterval(this.stepTimer),this.page.off("jcf-pointerup",this.onBtnRelease),this.realElement.off({keydown:this.onKeyPress,focus:this.onFocus,blur:this.onBlur})}}})}(jcf);


//select
!function(e){e.addModule(function(t,s){"use strict";function i(e){this.options=t.extend({wrapNative:!0,wrapNativeOnMobile:!0,fakeDropInBody:!0,useCustomScroll:!0,flipDropToFit:!0,maxVisibleItems:10,fakeAreaStructure:'<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',fakeDropStructure:'<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',optionClassPrefix:"jcf-option-",selectClassPrefix:"jcf-select-",dropContentSelector:".jcf-select-drop-content",selectTextSelector:".jcf-select-text",dropActiveClass:"jcf-drop-active",flipDropClass:"jcf-drop-flipped"},e),this.init()}function o(e){this.options=t.extend({wrapNative:!0,useCustomScroll:!0,fakeStructure:'<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',selectClassPrefix:"jcf-select-",listHolder:".jcf-list-wrapper"},e),this.init()}function n(e){this.options=t.extend({holder:null,maxVisibleItems:10,selectOnClick:!0,useHoverClass:!1,useCustomScroll:!1,handleResize:!0,multipleSelectWithoutKey:!1,alwaysPreventMouseWheel:!1,indexAttribute:"data-index",cloneClassPrefix:"jcf-option-",containerStructure:'<span class="jcf-list"><span class="jcf-list-content"></span></span>',containerSelector:".jcf-list-content",captionClass:"jcf-optgroup-caption",disabledClass:"jcf-disabled",optionClass:"jcf-option",groupClass:"jcf-optgroup",hoverClass:"jcf-hover",selectedClass:"jcf-selected",scrollClass:"jcf-scroll-active"},e),this.init()}var l={name:"Select",selector:"select",options:{element:null,multipleCompactStyle:!1},plugins:{ListBox:o,ComboBox:i,SelectList:n},matchElement:function(e){return e.is("select")},init:function(){this.element=t(this.options.element),this.createInstance()},isListBox:function(){return this.element.is("[size]:not([jcf-size]), [multiple]")},createInstance:function(){this.instance&&this.instance.destroy(),this.isListBox()&&!this.options.multipleCompactStyle?this.instance=new o(this.options):this.instance=new i(this.options)},refresh:function(){var e=this.isListBox()&&this.instance instanceof i||!this.isListBox()&&this.instance instanceof o;e?this.createInstance():this.instance.refresh()},destroy:function(){this.instance.destroy()}};t.extend(i.prototype,{init:function(){this.initStructure(),this.bindHandlers(),this.attachEvents(),this.refresh()},initStructure:function(){this.win=t(s),this.doc=t(document),this.realElement=t(this.options.element),this.fakeElement=t(this.options.fakeAreaStructure).insertAfter(this.realElement),this.selectTextContainer=this.fakeElement.find(this.options.selectTextSelector),this.selectText=t("<span></span>").appendTo(this.selectTextContainer),h(this.fakeElement),this.fakeElement.addClass(r(this.realElement.prop("className"),this.options.selectClassPrefix)),this.realElement.prop("multiple")&&this.fakeElement.addClass("jcf-compact-multiple"),this.options.isMobileDevice&&this.options.wrapNativeOnMobile&&!this.options.wrapNative&&(this.options.wrapNative=!0),this.options.wrapNative?this.realElement.prependTo(this.fakeElement).css({position:"absolute",height:"100%",width:"100%"}).addClass(this.options.resetAppearanceClass):(this.realElement.addClass(this.options.hiddenClass),this.fakeElement.attr("title",this.realElement.attr("title")),this.fakeDropTarget=this.options.fakeDropInBody?t("body"):this.fakeElement)},attachEvents:function(){var e=this;this.delayedRefresh=function(){setTimeout(function(){e.refresh(),e.list&&(e.list.refresh(),e.list.scrollToActiveOption())},1)},this.options.wrapNative?this.realElement.on({focus:this.onFocus,change:this.onChange,click:this.onChange,keydown:this.delayedRefresh}):(this.realElement.on({focus:this.onFocus,change:this.onChange,keydown:this.onKeyDown}),this.fakeElement.on({"jcf-pointerdown":this.onSelectAreaPress}))},onKeyDown:function(e){13===e.which?this.toggleDropdown():this.dropActive&&this.delayedRefresh()},onChange:function(){this.refresh()},onFocus:function(){this.pressedFlag&&this.focusedFlag||(this.fakeElement.addClass(this.options.focusClass),this.realElement.on("blur",this.onBlur),this.toggleListMode(!0),this.focusedFlag=!0)},onBlur:function(){this.pressedFlag||(this.fakeElement.removeClass(this.options.focusClass),this.realElement.off("blur",this.onBlur),this.toggleListMode(!1),this.focusedFlag=!1)},onResize:function(){this.dropActive&&this.hideDropdown()},onSelectDropPress:function(){this.pressedFlag=!0},onSelectDropRelease:function(e,t){this.pressedFlag=!1,"mouse"===t.pointerType&&this.realElement.focus()},onSelectAreaPress:function(e){var s=!this.options.fakeDropInBody&&t(e.target).closest(this.dropdown).length;s||e.button>1||this.realElement.is(":disabled")||(this.selectOpenedByEvent=e.pointerType,this.toggleDropdown(),this.focusedFlag||("mouse"===e.pointerType?this.realElement.focus():this.onFocus(e)),this.pressedFlag=!0,this.fakeElement.addClass(this.options.pressedClass),this.doc.on("jcf-pointerup",this.onSelectAreaRelease))},onSelectAreaRelease:function(e){this.focusedFlag&&"mouse"===e.pointerType&&this.realElement.focus(),this.pressedFlag=!1,this.fakeElement.removeClass(this.options.pressedClass),this.doc.off("jcf-pointerup",this.onSelectAreaRelease)},onOutsideClick:function(e){var s=t(e.target),i=s.closest(this.fakeElement).length||s.closest(this.dropdown).length;i||this.hideDropdown()},onSelect:function(){this.refresh(),this.realElement.prop("multiple")?this.repositionDropdown():this.hideDropdown(),this.fireNativeEvent(this.realElement,"change")},toggleListMode:function(e){this.options.wrapNative||(e?this.realElement.attr({size:4,"jcf-size":""}):this.options.wrapNative||this.realElement.removeAttr("size jcf-size"))},createDropdown:function(){this.dropdown&&(this.list.destroy(),this.dropdown.remove()),this.dropdown=t(this.options.fakeDropStructure).appendTo(this.fakeDropTarget),this.dropdown.addClass(r(this.realElement.prop("className"),this.options.selectClassPrefix)),h(this.dropdown),this.realElement.prop("multiple")&&this.dropdown.addClass("jcf-compact-multiple"),this.options.fakeDropInBody&&this.dropdown.css({position:"absolute",top:-9999}),this.list=new n({useHoverClass:!0,handleResize:!1,alwaysPreventMouseWheel:!0,maxVisibleItems:this.options.maxVisibleItems,useCustomScroll:this.options.useCustomScroll,holder:this.dropdown.find(this.options.dropContentSelector),multipleSelectWithoutKey:this.realElement.prop("multiple"),element:this.realElement}),t(this.list).on({select:this.onSelect,press:this.onSelectDropPress,release:this.onSelectDropRelease})},repositionDropdown:function(){var e,t,s,i=this.fakeElement.offset(),o=this.fakeElement[0].getBoundingClientRect(),n=o.width||o.right-o.left,l=this.fakeElement.outerHeight(),r=this.dropdown.css("width",n).outerHeight(),h=this.win.scrollTop(),a=this.win.height(),c=!1;i.top+l+r>h+a&&i.top-r>h&&(c=!0),this.options.fakeDropInBody&&(s="static"!==this.fakeDropTarget.css("position")?this.fakeDropTarget.offset().top:0,this.options.flipDropToFit&&c?(t=i.left,e=i.top-r-s):(t=i.left,e=i.top+l-s),this.dropdown.css({width:n,left:t,top:e})),this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass,this.options.flipDropToFit&&c)},showDropdown:function(){this.realElement.prop("options").length&&(this.dropdown||this.createDropdown(),this.dropActive=!0,this.dropdown.appendTo(this.fakeDropTarget),this.fakeElement.addClass(this.options.dropActiveClass),this.refreshSelectedText(),this.repositionDropdown(),this.list.setScrollTop(this.savedScrollTop),this.list.refresh(),this.win.on("resize",this.onResize),this.doc.on("jcf-pointerdown",this.onOutsideClick))},hideDropdown:function(){this.dropdown&&(this.savedScrollTop=this.list.getScrollTop(),this.fakeElement.removeClass(this.options.dropActiveClass+" "+this.options.flipDropClass),this.dropdown.removeClass(this.options.flipDropClass).detach(),this.doc.off("jcf-pointerdown",this.onOutsideClick),this.win.off("resize",this.onResize),this.dropActive=!1,"touch"===this.selectOpenedByEvent&&this.onBlur())},toggleDropdown:function(){this.dropActive?this.hideDropdown():this.showDropdown()},refreshSelectedText:function(){var e,s=this.realElement.prop("selectedIndex"),i=this.realElement.prop("options")[s],o=i?i.getAttribute("data-image"):null,n="",l=this;this.realElement.prop("multiple")?(t.each(this.realElement.prop("options"),function(e,t){t.selected&&(n+=(n?", ":"")+t.innerHTML)}),n||(n=l.realElement.attr("placeholder")||""),this.selectText.removeAttr("class").html(n)):i?this.currentSelectedText===i.innerHTML&&this.currentSelectedImage===o||(e=r(i.className,this.options.optionClassPrefix),this.selectText.attr("class",e).html(i.innerHTML),o?(this.selectImage||(this.selectImage=t("<img>").prependTo(this.selectTextContainer).hide()),this.selectImage.attr("src",o).show()):this.selectImage&&this.selectImage.hide(),this.currentSelectedText=i.innerHTML,this.currentSelectedImage=o):(this.selectImage&&this.selectImage.hide(),this.selectText.removeAttr("class").empty())},refresh:function(){"none"===this.realElement.prop("style").display?this.fakeElement.hide():this.fakeElement.show(),this.refreshSelectedText(),this.fakeElement.toggleClass(this.options.disabledClass,this.realElement.is(":disabled"))},destroy:function(){this.options.wrapNative?this.realElement.insertBefore(this.fakeElement).css({position:"",height:"",width:""}).removeClass(this.options.resetAppearanceClass):(this.realElement.removeClass(this.options.hiddenClass),this.realElement.is("[jcf-size]")&&this.realElement.removeAttr("size jcf-size")),this.fakeElement.remove(),this.doc.off("jcf-pointerup",this.onSelectAreaRelease),this.realElement.off({focus:this.onFocus})}}),t.extend(o.prototype,{init:function(){this.bindHandlers(),this.initStructure(),this.attachEvents()},initStructure:function(){this.realElement=t(this.options.element),this.fakeElement=t(this.options.fakeStructure).insertAfter(this.realElement),this.listHolder=this.fakeElement.find(this.options.listHolder),h(this.fakeElement),this.fakeElement.addClass(r(this.realElement.prop("className"),this.options.selectClassPrefix)),this.realElement.addClass(this.options.hiddenClass),this.list=new n({useCustomScroll:this.options.useCustomScroll,holder:this.listHolder,selectOnClick:!1,element:this.realElement})},attachEvents:function(){var e=this;this.delayedRefresh=function(t){t&&(16===t.which||t.ctrlKey||t.metaKey||t.altKey)||(clearTimeout(e.refreshTimer),e.refreshTimer=setTimeout(function(){e.refresh(),e.list.scrollToActiveOption()},1))},this.realElement.on({focus:this.onFocus,click:this.delayedRefresh,keydown:this.delayedRefresh}),t(this.list).on({select:this.onSelect,press:this.onFakeOptionsPress,release:this.onFakeOptionsRelease})},onFakeOptionsPress:function(e,t){this.pressedFlag=!0,"mouse"===t.pointerType&&this.realElement.focus()},onFakeOptionsRelease:function(e,t){this.pressedFlag=!1,"mouse"===t.pointerType&&this.realElement.focus()},onSelect:function(){this.fireNativeEvent(this.realElement,"change"),this.fireNativeEvent(this.realElement,"click")},onFocus:function(){this.pressedFlag&&this.focusedFlag||(this.fakeElement.addClass(this.options.focusClass),this.realElement.on("blur",this.onBlur),this.focusedFlag=!0)},onBlur:function(){this.pressedFlag||(this.fakeElement.removeClass(this.options.focusClass),this.realElement.off("blur",this.onBlur),this.focusedFlag=!1)},refresh:function(){this.fakeElement.toggleClass(this.options.disabledClass,this.realElement.is(":disabled")),this.list.refresh()},destroy:function(){this.list.destroy(),this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass),this.fakeElement.remove()}}),t.extend(n.prototype,{init:function(){this.initStructure(),this.refreshSelectedClass(),this.attachEvents()},initStructure:function(){this.element=t(this.options.element),this.indexSelector="["+this.options.indexAttribute+"]",this.container=t(this.options.containerStructure).appendTo(this.options.holder),this.listHolder=this.container.find(this.options.containerSelector),this.lastClickedIndex=this.element.prop("selectedIndex"),this.rebuildList(),this.element.prop("multiple")&&(this.previousSelection=this.getSelectedOptionsIndexes())},attachEvents:function(){this.bindHandlers(),this.listHolder.on("jcf-pointerdown",this.indexSelector,this.onItemPress),this.listHolder.on("jcf-pointerdown",this.onPress),this.options.useHoverClass&&this.listHolder.on("jcf-pointerover",this.indexSelector,this.onHoverItem)},onPress:function(e){t(this).trigger("press",e),this.listHolder.on("jcf-pointerup",this.onRelease)},onRelease:function(e){t(this).trigger("release",e),this.listHolder.off("jcf-pointerup",this.onRelease)},onHoverItem:function(e){var t=parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));this.fakeOptions.removeClass(this.options.hoverClass).eq(t).addClass(this.options.hoverClass)},onItemPress:function(e){"touch"===e.pointerType||this.options.selectOnClick?(this.tmpListOffsetTop=this.list.offset().top,this.listHolder.on("jcf-pointerup",this.indexSelector,this.onItemRelease)):this.onSelectItem(e)},onItemRelease:function(e){this.listHolder.off("jcf-pointerup",this.indexSelector,this.onItemRelease),this.tmpListOffsetTop===this.list.offset().top&&this.listHolder.on("click",this.indexSelector,{savedPointerType:e.pointerType},this.onSelectItem),delete this.tmpListOffsetTop},onSelectItem:function(e){var s,i=parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute)),o=e.data&&e.data.savedPointerType||e.pointerType||"mouse";this.listHolder.off("click",this.indexSelector,this.onSelectItem),e.button>1||this.realOptions[i].disabled||(this.element.prop("multiple")?e.metaKey||e.ctrlKey||"touch"===o||this.options.multipleSelectWithoutKey?this.realOptions[i].selected=!this.realOptions[i].selected:e.shiftKey?(s=[this.lastClickedIndex,i].sort(function(e,t){return e-t}),this.realOptions.each(function(e,t){t.selected=e>=s[0]&&e<=s[1]})):this.element.prop("selectedIndex",i):this.element.prop("selectedIndex",i),e.shiftKey||(this.lastClickedIndex=i),this.refreshSelectedClass(),"mouse"===o&&this.scrollToActiveOption(),t(this).trigger("select"))},rebuildList:function(){var s=this,i=this.element[0];this.storedSelectHTML=i.innerHTML,this.optionIndex=0,this.list=t(this.createOptionsList(i)),this.listHolder.empty().append(this.list),this.realOptions=this.element.find("option"),this.fakeOptions=this.list.find(this.indexSelector),this.fakeListItems=this.list.find("."+this.options.captionClass+","+this.indexSelector),delete this.optionIndex;var o=this.options.maxVisibleItems,n=this.element.prop("size");n>1&&!this.element.is("[jcf-size]")&&(o=n);var l=this.fakeOptions.length>o;return this.container.toggleClass(this.options.scrollClass,l),l&&(this.listHolder.css({maxHeight:this.getOverflowHeight(o),overflow:"auto"}),this.options.useCustomScroll&&e.modules.Scrollable)?void e.replace(this.listHolder,"Scrollable",{handleResize:this.options.handleResize,alwaysPreventMouseWheel:this.options.alwaysPreventMouseWheel}):void(this.options.alwaysPreventMouseWheel&&(this.preventWheelHandler=function(e){var t=s.listHolder.scrollTop(),i=s.listHolder.prop("scrollHeight")-s.listHolder.innerHeight();(0>=t&&e.deltaY<0||t>=i&&e.deltaY>0)&&e.preventDefault()},this.listHolder.on("jcf-mousewheel",this.preventWheelHandler)))},refreshSelectedClass:function(){var e,t=this,s=this.element.prop("multiple"),i=this.element.prop("selectedIndex");s?this.realOptions.each(function(e,s){t.fakeOptions.eq(e).toggleClass(t.options.selectedClass,!!s.selected)}):(this.fakeOptions.removeClass(this.options.selectedClass+" "+this.options.hoverClass),e=this.fakeOptions.eq(i).addClass(this.options.selectedClass),this.options.useHoverClass&&e.addClass(this.options.hoverClass))},scrollToActiveOption:function(){var e=this.getActiveOptionOffset();"number"==typeof e&&this.listHolder.prop("scrollTop",e)},getSelectedOptionsIndexes:function(){var e=[];return this.realOptions.each(function(t,s){s.selected&&e.push(t)}),e},getChangedSelectedIndex:function(){var e=this.element.prop("selectedIndex"),s=this,i=!1,o=null;return this.element.prop("multiple")?(this.currentSelection=this.getSelectedOptionsIndexes(),t.each(this.currentSelection,function(e,t){!i&&s.previousSelection.indexOf(t)<0&&(0===e&&(i=!0),o=t)}),this.previousSelection=this.currentSelection,o):e},getActiveOptionOffset:function(){var e=this.getChangedSelectedIndex();if(null!==e){var t=this.listHolder.height(),s=this.listHolder.prop("scrollTop"),i=this.fakeOptions.eq(e),o=i.offset().top-this.list.offset().top,n=i.innerHeight();return o+n>=s+t?o-t+n:s>o?o:void 0}},getOverflowHeight:function(e){var t=this.fakeListItems.eq(e-1),s=this.list.offset().top,i=t.offset().top,o=t.innerHeight();return i+o-s},getScrollTop:function(){return this.listHolder.scrollTop()},setScrollTop:function(e){this.listHolder.scrollTop(e)},createOption:function(e){var t=document.createElement("span");t.className=this.options.optionClass,t.innerHTML=e.innerHTML,t.setAttribute(this.options.indexAttribute,this.optionIndex++);var s,i=e.getAttribute("data-image");return i&&(s=document.createElement("img"),s.src=i,t.insertBefore(s,t.childNodes[0])),e.disabled&&(t.className+=" "+this.options.disabledClass),e.className&&(t.className+=" "+r(e.className,this.options.cloneClassPrefix)),t},createOptGroup:function(e){var t,s,i=document.createElement("span"),o=e.getAttribute("label");return t=document.createElement("span"),t.className=this.options.captionClass,t.innerHTML=o,i.appendChild(t),e.children.length&&(s=this.createOptionsList(e),i.appendChild(s)),i.className=this.options.groupClass,i},createOptionContainer:function(){var e=document.createElement("li");return e},createOptionsList:function(e){var s=this,i=document.createElement("ul");return t.each(e.children,function(e,t){var o,n=s.createOptionContainer(t);switch(t.tagName.toLowerCase()){case"option":o=s.createOption(t);break;case"optgroup":o=s.createOptGroup(t)}i.appendChild(n).appendChild(o)}),i},refresh:function(){this.storedSelectHTML!==this.element.prop("innerHTML")&&this.rebuildList();var t=e.getInstance(this.listHolder);t&&t.refresh(),this.refreshSelectedClass()},destroy:function(){this.listHolder.off("jcf-mousewheel",this.preventWheelHandler),this.listHolder.off("jcf-pointerdown",this.indexSelector,this.onSelectItem),this.listHolder.off("jcf-pointerover",this.indexSelector,this.onHoverItem),this.listHolder.off("jcf-pointerdown",this.onPress)}});var r=function(e,t){return e?e.replace(/[\s]*([\S]+)+[\s]*/gi,t+"$1 "):""},h=function(){function t(e){e.preventDefault()}var s=e.getOptions().unselectableClass;return function(e){e.addClass(s).on("selectstart",t)}}();return l})}(jcf);