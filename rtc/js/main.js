jQuery(function($){

  $('input[placeholder], textarea[placeholder]').placeholder();


  $('.main-screen-news').viewportChecker({
      classToAdd: 'animate'
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


  $('.main-screen-news__close').click(function(){
   if($(this).parent().is('.main-screen-news--hide')){
    $(this).parent().removeClass('main-screen-news--hide');
   }else{
    $(this).parent().addClass('main-screen-news--hide');
   }
  });


  $('.menu-item__link--dd-open').click(function(){
   if($(this).parent().is('.menu-item--dd-opened')){
    $(this).parent().removeClass('menu-item--dd-opened');
   }else{
    $(this).parent().addClass('menu-item--dd-opened');
   }
  });


  $('.main-screen-topics__head').click(function(){
   if($(this).parent().is('.main-screen-topics--opened')){
    $(this).parent().removeClass('main-screen-topics--opened');
   }else{
    $(this).parent().addClass('main-screen-topics--opened');
   }
  });


  $('.info-slider--1').click(function(){
   $('.main-screen-slider1').addClass('main-screen-slider--opened');
  });

  $('.info-slider--2').click(function(){
   $('.main-screen-slider2').addClass('main-screen-slider--opened');
  });

  $('.info-slider--3').click(function(){
   $('.main-screen-slider3').addClass('main-screen-slider--opened');
  });

  $('.info-slider--4').click(function(){
   $('.main-screen-slider4').addClass('main-screen-slider--opened');
  });


  $('.info-slider').click(function(){
   $('#wrapper').removeClass('main-screen-wrapper');
   $('.main-screen-slider-wrap').addClass('main-screen-slider-wrap--hidd-nav');
  });


  $('.info-slider-close').click(function(){
   $('.main-screen-slider').removeClass('main-screen-slider--opened');
   $('#wrapper').addClass('main-screen-wrapper');
   $('.main-screen-slider-wrap').removeClass('main-screen-slider-wrap--hidd-nav');
  });




$('.main-screen-slider-nav a').click(function(){
   if($(this).parent().is('.active')){
    $(this).parent().removeClass('active');
   }else{
    $(this).parents().find('.main-screen-slider-nav li').removeClass('active');
    $(this).parent().addClass('active');
   }
  });


});



$(window).load(function() {
  $('.slider-proj').owlCarousel({
    loop: true,
    nav: true,
    dots: true,
    items: 3,
    margin: 8,
    autoplay: false,
    autoplayTimeout: 5000,
    mouseDrag: false
  });

  $('.slider-parter').owlCarousel({
    loop: true,
    nav: true,
    dots: true,
    items: 5,
    margin: 10,
    autoplay: false,
    autoplayTimeout: 5000,
    mouseDrag: false
  });




});

$( document ).ready(function() {
  var owl = $('.main-slider');
  owl.owlCarousel({
    loop: true,
    nav: false,
    dots: true,
    items: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    navSpeed: 1500,
    dotsSpeed: 1500,
    smartSpeed: 1500,
    dotsContainer: '.main-screen-slider-nav',
    autoplayTimeout: 20000,
    autoplayHoverPause: false,
    animateOut: 'fadeOut',
    mouseDrag: false
  })








  $('.info-slider-close').on('click',function(){
    owl.trigger('play.owl.autoplay',[20000])
  })

  $('.info-slider').on('click',function(){
      owl.trigger('stop.owl.autoplay')
  })


  owl.on('translate.owl.carousel',function(e){
    $('.owl-item video').each(function(){
      $(this).get(0).pause();
    });
  });
  owl.on('translated.owl.carousel',function(e){
    $('.owl-item.active video').get(0).play();
  })

  $('.owl-item .main-screen-slider').each(function(){
    var attr = $(this).attr('data-videosrc');
    if (typeof attr !== typeof undefined && attr !== false) {
      var videosrc = $(this).attr('data-videosrc');
      $(this).prepend('<video muted><source src="'+videosrc+'" type="video/mp4"></video>');
    }
  });
  $('.owl-item.active video').attr('autoplay',true).attr('loop',true);
});







//Plugin placeholder
(function(b,f,i){function l(){b(this).find(c).each(j)}function m(a){for(var a=a.attributes,b={},c=/^jQuery\d+/,e=0;e<a.length;e++)if(a[e].specified&&!c.test(a[e].name))b[a[e].name]=a[e].value;return b}function j(){var a=b(this),d;a.is(":password")||(a.data("password")?(d=a.next().show().focus(),b("label[for="+a.attr("id")+"]").attr("for",d.attr("id")),a.remove()):a.realVal()==a.attr("placeholder")&&(a.val(""),a.removeClass("placeholder")))}function k(){var a=b(this),d,c;placeholder=a.attr("placeholder");
b.trim(a.val()).length>0||(a.is(":password")?(c=a.attr("id")+"-clone",d=b("<input/>").attr(b.extend(m(this),{type:"text",value:placeholder,"data-password":1,id:c})).addClass("placeholder"),a.before(d).hide(),b("label[for="+a.attr("id")+"]").attr("for",c)):(a.val(placeholder),a.addClass("placeholder")))}var g="placeholder"in f.createElement("input"),h="placeholder"in f.createElement("textarea"),c=":input[placeholder]";b.placeholder={input:g,textarea:h};!i&&g&&h?b.fn.placeholder=function(){}:(!i&&g&&
!h&&(c="textarea[placeholder]"),b.fn.realVal=b.fn.val,b.fn.val=function(){var a=b(this),d;if(arguments.length>0)return a.realVal.apply(this,arguments);d=a.realVal();a=a.attr("placeholder");return d==a?"":d},b.fn.placeholder=function(){this.filter(c).each(k);return this},b(function(a){var b=a(f);b.on("submit","form",l);b.on("focus",c,j);b.on("blur",c,k);a(c).placeholder()}))})(jQuery,document,window.debug);