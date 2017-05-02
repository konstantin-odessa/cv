export class Slider {
    constructor(element, opts) {
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
    };

    init() {
        this.build();
        this.events()
    }

    build() {
        this.content
            .addClass('slider__slide-item');

        this.slidesWrapper = this.content.parent()
            .addClass('slider__slides-wrapper');

        this.sliderContainer = this.slidesWrapper
            .wrap('<div class="slider__container" />')
            .parent()
            .css('max-width', this.settings.containerMaxWidth);

        this.updateDimensions();

        for (var i = 0; i < this.length; i++) {
            this.navMenu.eq(i).attr('data-slider-target', this.settings.idPrefix + '-' + i);
            this.content.eq(i).attr('data-slider-id', this.settings.idPrefix + '-' + i);
        }
        this.navMenu.eq(0).addClass('active');
        this.content.eq(0).addClass('active');
    };

    events() {
        $(window).on('resize', this.updateDimensions.bind(this));
        this.navMenu.on('click', this.goToSlide);
    };

    goToSlide(event) {
        event.preventDefault();
        var link = $(event.target).closest('[data-slider-target]'),
            id = link.attr('data-slider-target'),
            slide = $('[data-slider-id="' + id + '"]');
            this.slidePos = slide.index();
        if (link.hasClass(this.settings.activeClass)) {
            return;
        }
        link
            .addClass('active')
            .siblings().removeClass('active');
        this.moveSlides();
    }

    moveSlides() {
        var slideOffset = this.settings.slideWidth * this.slidePos;
        this.slidesWrapper.css('left', -slideOffset + 'px');
    }

    updateDimensions() {
        this.settings.slideWidth = this.sliderContainer.width();
        this.overallSlidesWidth = this.settings.slideWidth * this.content.length;
        this.content.css('width', this.settings.slideWidth + 'px');
        this.slidesWrapper.css('width', this.overallSlidesWidth + 'px');
        this.moveSlides();
    }
}