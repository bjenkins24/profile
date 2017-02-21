import $ from 'jquery';
import waypoints from '../../../../node_modules/waypoints/lib/noframework.waypoints';
import smoothScroll from 'jquery-smooth-scroll';

class Navigation {
    constructor() {
        this.siteHeader = $('.site-header');
        this.profileSection = $('.profile');
        this.pageSections = $('.page-section');
        this.headerLinks = $(".primary-nav a");
        this.downArrow = $( ".large-hero__arrow-box" );
        this.init();
    }

    init() {
        this.events();
        this.makeHeaderSticky();
        this.changeHeaderColor();
        this.addSmoothScrolling();
        this.createPageSectionWaypoints();
        this.immediatelyScrollToTop();
    }

    events() {
        this.downArrow.click(this.scrollToProfile.bind(this));
    }

    scrollToProfile() {
        $('html, body').animate({
            scrollTop: this.profileSection.offset().top
        }, 900);
    }

    immediatelyScrollToTop() {
        window.onbeforeunload = function () {
          window.scrollTo(0, 0);
        }
    }

    addSmoothScrolling() {
        this.headerLinks.smoothScroll();
    }


    changeHeaderColor() {
        let that = this;
        new Waypoint({
            element: that.siteHeader[0],
            handler: function(direction) {
                if (direction == 'down') {
                    that.siteHeader.addClass('site-header--gray');
                } else {
                    that.siteHeader.removeClass('site-header--gray');
                }
            },
            offset: "18%"
        });
    }

    makeHeaderSticky() {
        let that = this;
        new Waypoint({
            element: that.siteHeader[0],
            handler: function(direction) {
                if (direction == 'down') {
                    that.siteHeader.addClass('site-header--fixed');
                    that.profileSection.addClass('profile--t-full-margin');
                } else {
                    that.siteHeader.removeClass('site-header--fixed');
                    that.profileSection.removeClass('profile--t-full-margin');
                }
            }
        });
    }

    createPageSectionWaypoints() {
        let that = this;
        this.pageSections.each(function() {
            let currentPageSection = this;
            new Waypoint({
                element: currentPageSection,
                handler: function(direction) {
                    if(direction == 'down') {
                        let matchingHeaderLink = currentPageSection.getAttribute('data-matching-link');
                        that.headerLinks.removeClass('is-current-link');
                        $(matchingHeaderLink).addClass('is-current-link');
                    }
                },
                offset: "18%"
            });

            new Waypoint({
                element: currentPageSection,
                handler: function(direction) {
                    if(direction == 'up') {
                        let matchingHeaderLink = currentPageSection.getAttribute('data-matching-link');
                        that.headerLinks.removeClass('is-current-link');
                        $(matchingHeaderLink).addClass('is-current-link');
                    }
                },
                offset: "-40%"
            });
        });
    }
}

export default Navigation;
