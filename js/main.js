'use strict';


var detectIE = function () {

  var ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var msie = ua.indexOf('MSIE ');

  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
};


var crearCaptionLaCosta = function (item) {

  return [
    '<div class="row">',
    '<div class="col-3 col-sm-2">',
    '<img src="img/logo-la-costa.svg" alt="La Costa" width="100%"/>',
    '</div>',
    '<div class="col-9 col-sm-10">',
    item.caption,
    '<ul class="downloads">',
    '<li>',
    '<a class="btn btn-sm btn-outline-secondary" href="img/obras/la-costa/brochure.pdf">',
    '<span class="texto-largo">Descargar brochure</span>',
    '<span class="texto-corto">Brochure</span>',
    '</a>',
    '</li>',
    '<li>',
    '<a class="btn btn-sm btn-outline-secondary" href="img/obras/la-costa/master-plan.pdf">',
    '<span class="texto-largo">Descargar master plan</span>',
    '<span class="texto-corto">Plano</span>',
    '</a>',
    '</li>',
    '<li>',
    '<a class="btn btn-sm btn-outline-secondary" href="img/obras/la-costa/casas.pdf">',
    '<span class="texto-largo">Descargar casas</span>',
    '<span class="texto-corto">Casas</span>',
    '</a>',
    '</li>',
    '<li>',
    '<a class="btn btn-sm btn-outline-secondary" href="img/obras/la-costa/infografia.jpg">',
    '<span class="texto-largo">Infografía</span>',
    '<span class="texto-corto">infografia</span>',
    '</a>',
    '</li>',
    '<li>',
    '<a class="btn btn-sm btn-outline-secondary" href="https://goo.gl/maps/fMer4eMeL5q" target="_blank">',
    '<svg class="marker" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><path d="M256,0C149.969,0,64,85.969,64,192s160,320,192,320s192-213.969,192-320S362.031,0,256,0z M256,320 c-70.594,0-128-57.438-128-128S185.406,64,256,64s128,57.438,128,128S326.594,320,256,320z"/></svg>',
    '<span class="texto-largo">Ver mapa</span>',
    '<span class="texto-corto">Mapa</span>',
    '</a>',
    '</li>',
    '</ul>',
    '</div>',
    '</div>'
  ].join('')
};


var carouselIEHack = function ($carousel, $inner) {

  $carousel.on('slide.bs.carousel', function (e) {

    $inner.find('.carousel-item.active .carousel-caption').css({ opacity: 0 });
    $(e.relatedTarget).find('.carousel-caption').css({ opacity: 1 });
  });
};


$.fn.createCarousel = function (options) {

  var $carousel = $('<div id="' + options.id + '" class="carousel slide">');
  var $indicators = $('<ol class="carousel-indicators">');
  var $inner = $('<div class="carousel-inner" role="listbox">');
  var $prev = $('<a class="carousel-control-prev" href="#' + options.id + '" role="button" data-slide="prev">');
  var $next = $('<a class="carousel-control-next" href="#' + options.id + '" role="button" data-slide="next">');

  if (detectIE() !== false) {
    carouselIEHack($carousel, $inner);
  }

  $indicators.append(options.items.map(function (item, i) {

    var className = (i === 0) ? 'active' : '';

    return $('<li data-target="#' + options.id + '" data-slide-to="' + i + '" class="' + className + '"></li>');
  }));

  $inner.append(options.items.map(function (item, i) {

    var style = 'background-image: url(' + item.img + ');';
    var caption = (options.id === 'carousel-inicio') ? crearCaptionLaCosta(item) : item.caption;
    var className = 'carousel-item';

    if (i === 0) {
      className += ' active';
    }

    return $('<div class="' + className + '" style="' + style + '">')
      .append($('<div class="carousel-caption d-md-block rounded">')
      .append(caption));
  }));

  $prev.append([
    '<span class="carousel-control-prev-icon" aria-hidden="true"></span>',
    '<span class="sr-only">Previous</span>'
  ].join(''));

  $next.append([
    '<span class="carousel-control-next-icon" aria-hidden="true"></span>',
    '<span class="sr-only">Next</span>'
  ].join(''));

  if (options.indicators === true) {
    $carousel.append($indicators);
  }

  var hammer = new Hammer($carousel.get(0), {});

  hammer.on('swipeleft', $carousel.carousel.bind($carousel, 'next'));
  hammer.on('swiperight', $carousel.carousel.bind($carousel, 'prev'));

  $(this).append($carousel.append($inner, $prev, $next));

  if (options.id === 'carousel-inicio') {
    $carousel.carousel({ ride: true, interval: 5000 });
  }
};


// Start on DOM ready!
$(function () {

  $('#obras').createCarousel({
    id: 'carousel-obras',
    indicators: false,
    items: [
      {
        img: 'img/obras/parque-del-sur/vista-parque.jpg',
        caption: [
          '<h3>Parque del Sur 3</h3>',
          '<p>Calle José Sabobal 252 - Santiago de Surco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/barranco-lofts/sala.jpg',
        caption: [
          '<h3>Barranco Lofts</h3>',
          '<p>Jr. 28 de Julio 434 - Barranco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/parque-del-sur/mimbre.jpg',
        caption: [
          '<h3>Parque del Sur 2</h3>',
          '<p>Calle José Sabobal 236 - Santiago de Surco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/parque-del-sur/fachada.jpg',
        caption: [
          '<h3>Parque del Sur 2</h3>',
          '<p>Calle José Sabobal 236 - Santiago de Surco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/parque-del-sur/ecovista.jpg',
        caption: [
          '<h3>Parque del Sur 1</h3>',
          '<p>Calle José Sabobal 282 - Santiago de Surco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/winternitz/puerta-winternitz.jpg',
        caption: [
          '<h3>Winternitz</h3>',
          '<p>Calle Castilla La Vieja 124 - Santiago de Surco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/parque-del-sur/edificio.jpg',
        caption: [
          '<h3>Parque del Sur 3</h3>',
          '<p>Calle José Sabobal 252 - Santiago de Surco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/parque-del-sur/mascaras.jpg',
        caption: [
          '<h3>Parque del Sur 1</h3>',
          '<p>Calle José Sabobal 282 - Santiago de Surco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/barranco-lofts/cochera.jpg',
        caption: [
          '<h3>Barranco Lofts</h3>',
          '<p>Jr. 28 de Julio 434 - Barranco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/parque-del-sur/salados.jpg',
        caption: [
          '<h3>Parque del Sur 1</h3>',
          '<p>Calle José Sabobal 282 - Santiago de Surco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/parque-del-sur/dormitorio.jpg',
        caption: [
          '<h3>Parque del Sur 2</h3>',
          '<p>Calle José Sabobal 236 - Santiago de Surco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/barranco-lofts/panoramica.jpg',
        caption: [
          '<h3>Barranco Lofts</h3>',
          '<p>Jr. 28 de Julio 434 - Barranco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/parque-del-sur/mueble.jpg',
        caption: [
          '<h3>Parque del Sur 2</h3>',
          '<p>Calle José Sabobal 236 - Santiago de Surco.</p>'
        ].join('')
      },
      {
        img: 'img/obras/barranco-lofts/dormitorio.jpg',
        caption: [
          '<h3>Barranco Lofts</h3>',
          '<p>Jr. 28 de Julio 434 - Barranco.</p>'
        ].join('')
      }
    ]
  });


  $('#inicio').createCarousel({
    id: 'carousel-inicio',
    indicators: true,
    items: [
      {
        img: 'img/obras/la-costa/playa.jpg',
        caption: [
          '<h3>Campo y playa en un solo lugar</h3>',
          '<p>Nuevo condominio frente al mar de Cerro Azul.</p>'
        ].join('')
      },
      {
        img: 'img/obras/la-costa/piscina.jpg',
        caption: [
          '<h3>60% de áreas libres</h3>',
          '<p>Parques, jardines, piscina, malecón y club house para ',
          'disfrutar del entorno.</p>'
        ].join('')
      },
      {
        img: 'img/obras/la-costa/lotizacion.jpg',
        caption: [
          '<h3>107 lotes en la primera etapa</h3>',
          '<p>Terrenos desde $35,000. Lotes de 144 y 170m2.</p>'
        ].join('')
      },
      {
        img: 'img/obras/la-costa/casa-1.jpg',
        caption: [
          '<h3>Lejos del bullicio de la ciudad</h3>',
          '<p>Condominio frente al mar en Cerro Azul, Cañete. ',
          'Km 133 de la Panamericana Sur.</p>'
        ].join('')
      },
      {
        img: 'img/obras/la-costa/casa-2.jpg',
        caption: [
          '<h3>Casa 2</h3>',
          '<p>Contamos con 4 diseños de casas para su elección. '
        ].join('')
      }
    ]
  });


  $(document).scroll(function () {

    var $mainNav = $('#main-nav');
    var y = $(this).scrollTop();

    if (y < 100) {
      $mainNav.addClass('transparent-light');
    }
    else if ($mainNav.hasClass('transparent-light')) {
      $mainNav.removeClass('transparent-light');
    }
  });


  //
  // Redes sociales...
  //

  var socialIcons = {
    airbnb: '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414"><path d="M15.222 11.355c-.072-.2-.156-.396-.235-.577-.123-.277-.252-.556-.376-.825l-.008-.02c-1.108-2.404-2.296-4.84-3.533-7.24l-.054-.1c-.126-.246-.256-.5-.39-.75-.157-.29-.33-.598-.574-.885C9.524.34 8.795 0 8 0c-.796 0-1.524.34-2.052.96-.244.285-.418.593-.574.884-.135.252-.267.508-.394.755l-.05.094C3.696 5.094 2.507 7.53 1.4 9.932l-.018.035c-.12.265-.248.538-.368.81-.08.182-.163.376-.235.578-.21.59-.273 1.154-.19 1.725.17 1.192.97 2.214 2.084 2.667.415.168.855.253 1.308.253.14 0 .28-.008.42-.025.538-.062 1.08-.245 1.61-.543.648-.365 1.288-.9 1.988-1.665.7.765 1.34 1.3 1.99 1.665.53.298 1.07.48 1.607.543.14.017.282.025.42.025.454 0 .895-.085 1.308-.253 1.117-.453 1.916-1.475 2.087-2.667.08-.57.02-1.134-.19-1.725zm-.822 1.58c-.12.834-.678 1.548-1.46 1.864-.38.155-.8.21-1.225.16-.407-.047-.808-.184-1.225-.42-.577-.323-1.162-.822-1.82-1.554 1.048-1.294 1.702-2.485 1.944-3.548.11-.485.134-.944.07-1.364-.063-.406-.206-.774-.426-1.094C9.768 6.265 8.925 5.84 8 5.84c-.924 0-1.768.425-2.258 1.14-.22.32-.363.688-.425 1.093-.064.42-.04.88.07 1.364.24 1.063.895 2.255 1.942 3.55-.66.73-1.243 1.23-1.82 1.554-.417.236-.818.373-1.225.42-.425.05-.843-.005-1.226-.16-.782-.317-1.34-1.03-1.46-1.865-.058-.408-.013-.8.142-1.238.057-.16.124-.318.207-.506.116-.264.24-.534.36-.795l.017-.035c1.1-2.39 2.283-4.81 3.513-7.198l.05-.095c.124-.244.253-.496.384-.74.136-.25.273-.494.45-.705.337-.392.778-.6 1.276-.6.5 0 .94.208 1.274.6.18.21.316.454.45.706.13.24.26.49.384.73l.052.104c1.23 2.387 2.412 4.81 3.513 7.198l.01.022c.122.265.25.54.368.81.084.187.15.345.208.505.155.437.2.83.142 1.238zM8 12.19c-.866-1.102-1.422-2.123-1.617-2.98-.082-.36-.1-.69-.056-.98.04-.254.126-.48.258-.673.3-.435.828-.696 1.415-.696.587 0 1.116.262 1.415.697.133.193.22.42.258.672.045.29.026.622-.056.98-.195.858-.75 1.88-1.617 2.98z"/></svg>',
    facebook: '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414"><path d="M15.117 0H.883C.395 0 0 .395 0 .883v14.234c0 .488.395.883.883.883h7.663V9.804H6.46V7.39h2.086V5.607c0-2.066 1.262-3.19 3.106-3.19.883 0 1.642.064 1.863.094v2.16h-1.28c-1 0-1.195.476-1.195 1.176v1.54h2.39l-.31 2.416h-2.08V16h4.077c.488 0 .883-.395.883-.883V.883C16 .395 15.605 0 15.117 0" fill-rule="nonzero"/></svg>',
    tripadvisor: '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="1.414"><path d="M15.213 6.352c.187-.804.783-1.61.783-1.61h-2.674c-1.5-.97-3.32-1.483-5.34-1.483-2.093 0-3.984.525-5.475 1.5L0 4.762s.59.796.78 1.594C.292 7.02.002 7.834.002 8.718c0 2.21 1.798 4.005 4.007 4.005 1.262 0 2.388-.59 3.122-1.503l.853 1.277.86-1.288c.386.49.885.89 1.47 1.16.973.448 2.063.492 3.066.12 2.074-.766 3.138-3.076 2.37-5.146-.133-.364-.317-.695-.537-.992zm-2.113 5.38c-.8.297-1.67.263-2.446-.095-.55-.255-1.002-.654-1.326-1.15-.133-.2-.25-.415-.335-.647-.097-.263-.146-.535-.172-.81-.053-.554.028-1.116.267-1.635.358-.776.997-1.367 1.798-1.663 1.655-.61 3.497.24 4.108 1.893.61 1.654-.238 3.495-1.893 4.108zM6.656 10.51c-.576.848-1.548 1.408-2.648 1.408-1.764 0-3.2-1.437-3.2-3.197 0-1.766 1.437-3.2 3.2-3.2 1.763 0 3.198 1.434 3.198 3.2 0 .106-.02.208-.032.312-.054.54-.227 1.048-.518 1.476zM1.976 8.68c0 1.093.89 1.98 1.98 1.98 1.09 0 1.978-.887 1.978-1.98 0-1.09-.888-1.976-1.977-1.976-1.09 0-1.98.886-1.98 1.976zm8.03 0c0 1.093.886 1.98 1.978 1.98 1.09 0 1.976-.887 1.976-1.98 0-1.09-.886-1.976-1.976-1.976-1.09 0-1.98.886-1.98 1.976zm-7.347 0c0-.714.583-1.295 1.298-1.295.715 0 1.295.582 1.295 1.295 0 .717-.58 1.3-1.295 1.3s-1.3-.583-1.3-1.3zm8.027 0c0-.714.582-1.295 1.298-1.295.714 0 1.294.582 1.294 1.295 0 .717-.58 1.3-1.295 1.3-.716 0-1.298-.583-1.298-1.3zM7.983 3.958c1.44 0 2.74.26 3.887.775-.422.012-.848.087-1.265.24-1.004.37-1.805 1.11-2.25 2.083-.204.44-.32.906-.355 1.377-.146-2.05-1.835-3.676-3.912-3.718 1.147-.49 2.465-.757 3.895-.757z"/></svg>'
  };

  $('.social-icon').each(function () {

    var $el = $(this);
    var site = $el.attr('class').split(' ').reduce(function (memo, className) {

      var matches = /^social-icon-([a-z]+)$/.exec(className);
      if (matches && matches.length > 1) {
        return matches[1];
      }

      return memo;
    }, null);

    if (!site || !socialIcons[site]) {
      return;
    }

    $el.html(socialIcons[site]);
  });



  //
  // Intercepta clicks en menu principal para hacer scroll animado hasta la
  // sección correspondiente.
  //
  $(document).on('click', '.navbar a', function (e) {

    var $a = $(e.currentTarget);
    var href = $a.attr('href');

    // We only care about "fragments"...
    if (href.charAt(0) !== '#') {
      return;
    }

    // Hack to close navbar dropdown when liks are clicked
    var $collapse = $a.parents('.navbar-collapse.show');

    if ($collapse.length) {
      $collapse.collapse('hide');
    }

    $('html, body').animate({
      scrollTop: $(href).offset().top
    }, 1500, 'swing');

    return false;
  });



  //
  // Tracker de Google Analytics
  //
  (function (i,s,o,g,r,a,m) {

    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {

      (i[r].q = i[r].q || []).push(arguments);
    },
    i[r].l = 1 * new Date();
    a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a,m);
  })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-98284474-1', 'auto');
  ga('send', 'pageview');
});
