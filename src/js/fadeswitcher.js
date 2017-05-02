export class FadeSwitcher {
    constructor(container, opts) {
        this.defaults = {
            content: '',
            fadeInterval: 2000
        };
        this.settings = $.extend({}, this, this.defaults, opts);
        this.container = $(container);
        this.content = this.container.find(this.settings.content);
        this.interval = (this.settings.fadeInterval * Math.random()) + this.settings.fadeInterval;
        this.init();
    }

    init() {
        this.content.parent().addClass('fade__content-container');
        this.content.addClass('fade__content-item');
        this.content.eq(0).addClass('active');

        var func = (() => {
            var pos = 0,
                length = this.content.length;
            return () => {
                if (pos === length) {
                    pos = 0;
                }
                this.content.removeClass('active');
                this.content.eq(pos++).addClass('active');
            }
        })();
        setInterval(func, this.interval)
    };

    toggleHandler(event) {
        event.preventDefault();
        var el = $(event.target)
            , id = el.attr('data-plugin-target');
        if (el.hasClass(this.settings.activeClass)) {
            return;
        }
        [].forEach.call(this.navMenu, function (navEl) {
            $(navEl).attr('data-plugin-target') == id ? $(navEl).addClass(this.settings.activeClass) : $(navEl).removeClass(this.settings.activeClass);
        }
            .bind(this));
        [].forEach.call(this.content, function (contentEl) {
            $(contentEl).attr('data-plugin-id') == id ? $(contentEl).addClass('active') : $(contentEl).removeClass('active');
        }
            .bind(this));
    }
}