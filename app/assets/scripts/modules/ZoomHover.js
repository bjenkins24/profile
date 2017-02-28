import $ from 'jquery';

/**
 * ZoomHover toggles the overflow value from a wrapper of the zoom-hover class
 * the overflow value must be visible for the zoom to overflow the wrapper div
 * but I don't want the wrapper div to forever have overflow visible
 */
class ZoomHover {

    /**
     * Constructor for zoomhover
     * @param {type} name - comment
     */
    constructor() {
        this.zoomHover = $('.zoom-hover');
        this.events();
    }

    /**
     * DOM events
     */
    events() {
        this.zoomHover.mouseenter(this.overflowVisible);
        this.zoomHover.mouseleave(this.overflowHidden);
    }

    /**
     * Make the overflow visible
     */
    overflowVisible() {
        $(this).closest('.wrapper')
            .addClass('wrapper--overflow-hidden-until-medium');
    }

    /**
     * Hide the overflow
     */
    overflowHidden() {
        let transitionEvents =
            `transitionend
            webkitTransitionEnd
            oTransitionEnd
            otransitionend
            MSTransitionEnd`;

        // This is an event listener that only happens when a css transition is
        // finished
        $('.zoom-hover__overlay').one(transitionEvents, () => {
            // If the element is currently hovered then we don't want to remove
            // the visible overflow
            if ($('.zoom-hover__overlay:hover').length === 0) {
                $('.wrapper--overflow-visible')
                    .removeClass('wrapper--overflow-hidden-until-medium');
            }

            // Remove the CSS transition listener - because if you don't then
            // the next time this fires it will remove the overflow on the
            // initial transition
            $('.zoom-hover__overlay').off(transitionEvents);
        });
    }

}

export default ZoomHover;
