import { Slider } from './slider';
import { FadeSwitcher } from './fadeswitcher';

$.fn.Slider = function (opts) {
    return this.each(function (index, el) {
        el.Slider = new Slider(el, opts);
    })
};

$.fn.Fade = function (opts) {
    return this.each(function (index, el) {
        el.Fade = new FadeSwitcher(el, opts);
    })
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