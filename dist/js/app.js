(function () {
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Slider = function () {
    function Slider(element, opts) {
        classCallCheck(this, Slider);

        this.defaults = {
            navMenu: '',
            content: '',
            idPrefix: 'slider-',
            containerMaxWidth: 600,
            speed: 400
        };
        this.settings = Object.assign({}, this.defaults, opts);
        this.navMenu = $(this.settings.navMenu);
        this.content = $(this.settings.content);
        this.length = this.navMenu.length;
        this.goToSlide = $.proxy(this.goToSlide, this);
        this.init();
    }

    createClass(Slider, [{
        key: 'init',
        value: function init() {
            this.build();
            this.events();
        }
    }, {
        key: 'build',
        value: function build() {
            this.content.addClass('slider__slide-item');

            this.slidesWrapper = this.content.parent().addClass('slider__slides-wrapper');

            this.sliderContainer = this.slidesWrapper.wrap('<div class="slider__container" />').parent().css('max-width', this.settings.containerMaxWidth);

            this.updateDimensions();

            for (var i = 0; i < this.length; i++) {
                this.navMenu.eq(i).attr('data-slider-target', this.settings.idPrefix + '-' + i);
                this.content.eq(i).attr('data-slider-id', this.settings.idPrefix + '-' + i);
            }
            this.navMenu.eq(0).addClass('active');
            this.content.eq(0).addClass('active');
        }
    }, {
        key: 'events',
        value: function events() {
            $(window).on('resize', this.updateDimensions.bind(this));
            this.navMenu.on('click', this.goToSlide);
        }
    }, {
        key: 'goToSlide',
        value: function goToSlide(event) {
            event.preventDefault();
            var link = $(event.target).closest('[data-slider-target]'),
                id = link.attr('data-slider-target'),
                slide = $('[data-slider-id="' + id + '"]');
            this.slidePos = slide.index();
            if (link.hasClass(this.settings.activeClass)) {
                return;
            }
            link.addClass('active').siblings().removeClass('active');
            this.moveSlides();
        }
    }, {
        key: 'moveSlides',
        value: function moveSlides() {
            var slideOffset = this.settings.slideWidth * this.slidePos;
            this.slidesWrapper.css('left', -slideOffset + 'px');
        }
    }, {
        key: 'updateDimensions',
        value: function updateDimensions() {
            this.settings.slideWidth = this.sliderContainer.width();
            this.overallSlidesWidth = this.settings.slideWidth * this.content.length;
            this.content.css('width', this.settings.slideWidth + 'px');
            this.slidesWrapper.css('width', this.overallSlidesWidth + 'px');
            this.moveSlides();
        }
    }]);
    return Slider;
}();

var FadeSwitcher = function () {
    function FadeSwitcher(container, opts) {
        classCallCheck(this, FadeSwitcher);

        this.defaults = {
            content: '',
            fadeInterval: 2000
        };
        this.settings = $.extend({}, this, this.defaults, opts);
        this.container = $(container);
        this.content = this.container.find(this.settings.content);
        this.interval = this.settings.fadeInterval * Math.random() + this.settings.fadeInterval;
        this.init();
    }

    createClass(FadeSwitcher, [{
        key: 'init',
        value: function init() {
            var _this = this;

            this.content.parent().addClass('fade__content-container');
            this.content.addClass('fade__content-item');
            this.content.eq(0).addClass('active');

            var func = function () {
                var pos = 0,
                    length = _this.content.length;
                return function () {
                    if (pos === length) {
                        pos = 0;
                    }
                    _this.content.removeClass('active');
                    _this.content.eq(pos++).addClass('active');
                };
            }();
            setInterval(func, this.interval);
        }
    }, {
        key: 'toggleHandler',
        value: function toggleHandler(event) {
            event.preventDefault();
            var el = $(event.target),
                id = el.attr('data-plugin-target');
            if (el.hasClass(this.settings.activeClass)) {
                return;
            }
            [].forEach.call(this.navMenu, function (navEl) {
                $(navEl).attr('data-plugin-target') == id ? $(navEl).addClass(this.settings.activeClass) : $(navEl).removeClass(this.settings.activeClass);
            }.bind(this));
            [].forEach.call(this.content, function (contentEl) {
                $(contentEl).attr('data-plugin-id') == id ? $(contentEl).addClass('active') : $(contentEl).removeClass('active');
            }.bind(this));
        }
    }]);
    return FadeSwitcher;
}();

$.fn.Slider = function (opts) {
    return this.each(function (index, el) {
        el.Slider = new Slider(el, opts);
    });
};

$.fn.Fade = function (opts) {
    return this.each(function (index, el) {
        el.Fade = new FadeSwitcher(el, opts);
    });
};

$(document).ready(function () {
    $('.cv__portfolio-container').Slider({
        navMenu: '.cv-portfolio__page-item',
        content: '.cv-portfolio__item',
        idPrefix: 'cv-portfolio'
    });

    $('.cv-portfolio-item__slides-list').Fade({
        content: '.cv-portfolio-item__slides-item'
    });
});

}());

//# sourceMappingURL=maps/app.js.map
