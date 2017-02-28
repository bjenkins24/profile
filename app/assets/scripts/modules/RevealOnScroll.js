import $ from 'jquery';
import '../../../../node_modules/waypoints/lib/noframework.waypoints';

/**
 * Reveal certain elements on scroll for zoom fade effect
 */
class RevealOnScroll {

    /**
     * Constructor for RevealOnScroll
     * @param {Object} elements - All elements that will be revealed
     * @param {String} offset - the offset of when the items will be revealed
     */
    constructor(elements, offset) {
        this.itemsToReveal = elements;
        this.hideInitially();
        this.createWaypoints(offset);
    }

    /**
     * The items should be hid initially
     */
    hideInitially() {
        this.itemsToReveal.addClass('reveal-item');
    }

    /**
     * Actually create the waypoints with supplied offset
     * @param {String} offset - How far away the user will be before the item
     * is revealed
     */
    createWaypoints(offset) {
        let that = this;
        this.itemsToReveal.each(function() {
            let currentItem = this;
            new Waypoint({
                element: currentItem,
                handler: function() {
                    $(currentItem).addClass('reveal-item--is-visible');
                    that.removeRevealItem(currentItem);
                },
                offset: offset,
            });
        });
    }

    /**
     * Don't want the item to continue have the reveal-item class after it's
     * visible, because it will effect the CSS transition type. After the CSS
     * transition remove the reveal item classes
     * @param {String} currentItem - the selector for the current item being
     * removed
     */
    removeRevealItem(currentItem) {
        let transitionEvents =
            `transitionend
            webkitTransitionEnd
            oTransitionEnd
            otransitionend
            MSTransitionEnd`;

        $(currentItem).one(transitionEvents, () => {
            $(currentItem).removeClass('reveal-item reveal-item--is-visible');
        });
    }
}

export default RevealOnScroll;
