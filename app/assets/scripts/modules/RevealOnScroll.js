import $ from 'jquery';
import waypoints from '../../../../node_modules/waypoints/lib/noframework.waypoints';

class RevealOnScroll {
    constructor(els, offset) {
        this.itemsToReveal = els;
        this.hideInitially();
        this.createWaypoints(offset);
    }

    hideInitially() {
        this.itemsToReveal.addClass('reveal-item');
    }

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
                offset: offset
            });
        });
    }

    removeRevealItem(currentItem) {
        $( currentItem ).one( "transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", 
            function() {
                $( currentItem ).removeClass('reveal-item reveal-item--is-visible');
            }
        );    
    }
}

export default RevealOnScroll;