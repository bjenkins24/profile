import $ from 'jquery';

/**
 * Create tooltips on hover and tap on mobile
 */
class Tooltip {

    /**
     * Tooltip constructor
     */
    constructor() {
        this.tooltip = $('.tooltip');
        this.events();
    }

    /**
     * DOM events
     */
    events() {
        this.tooltip.mouseenter(this.createTooltip.bind(this));
        this.tooltip.mouseleave(this.removeTooltip);
    }

    /**
     * Create random so we can remove the correct tooltip later
     * @return {String} - random id
     */
    createId() {
        return Math.random().toString(36).substring(7);
    }

    /**
     * Actually create the tooltip
     * @param {Object} e - event
     * @return {Boolean} If there is no tip then it won't create one
     */
    createTooltip(e) {
        let tooltipId = this.createId();
        let tooltip =
            $(`
              <div class="tooltip__content"
              data-matching-tooltip="${tooltipId}"></div>
            `);

        let target = $(e.currentTarget);
        let tip = target.attr('title');

        if (!tip || tip === '') {
            return false;
        }

        target.removeAttr('title');
        target.attr('data-matching-tooltip', tooltipId);

        tooltip.css('opacity', 1).html(tip).appendTo('body');
        tooltip.click(this.removeTooltip);

        this.initTooltip(tooltip, target);
    }

    /**
     * Init the tooltip in the correct place
     * @param {Object} tooltip - the actual tooltip tooltip__content
     * @param {Object} target - the target is the element that fired the tooltip
     */
    initTooltip(tooltip, target) {
        if ($(window).width() < tooltip.outerWidth() * 1.5) {
            // On small screens make the tooltip bigger
            if ($(window).width() < 800) {
              tooltip.css('max-width', $(window).width() / 1.4);
            } else {
              tooltip.css('max-width', $(window).width() / 3);
            }
        } else {
            tooltip.css('max-width', 340);
        }

        let posLeft = target.offset().left +
            (target.outerWidth() / 2) -
            (tooltip.outerWidth() / 2);

        let posTop = target.offset().top - tooltip.outerHeight() - 20;

        if (posLeft < 0) {
            posLeft = target.offset().left + target.outerWidth() / 2 - 20;
            tooltip.addClass('left');
        } else {
            tooltip.removeClass('left');
        }

        if (posLeft + tooltip.outerWidth() > $(window).width()) {
            posLeft = target.offset().left -
                tooltip.outerWidth() +
                target.outerWidth() /
                2 +
                20;

            tooltip.addClass('right');
        } else {
            tooltip.removeClass('right');
        }

        if (posTop < 0) {
            posTop = target.offset().top + target.outerHeight();
            tooltip.addClass('top');
        } else {
            tooltip.removeClass('top');
        }

        tooltip.css({left: posLeft, top: posTop})
           .animate({top: '+=10', opacity: 1}, 50);
    }

    /**
     * Remove the actual tooltip
     * @param {type} name - comment
     */
    removeTooltip() {
        let target = $(this);

        let tooltipId = target.attr('data-matching-tooltip');

        let tooltip =
            $(`.tooltip__content[data-matching-tooltip="${tooltipId}"]`);
        let tooltipEvent = $(`.tooltip[data-matching-tooltip="${tooltipId}"]`);

        let tip = tooltip.html();

        tooltip.animate({top: '-=10', opacity: 0}, 350, () => {
            tooltip.remove();
        });

        target.attr('title', tip);
    }

}

export default Tooltip;
