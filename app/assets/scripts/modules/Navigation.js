import $ from 'jquery';

import '../../../../node_modules/waypoints/lib/noframework.waypoints';
import '../../../../node_modules/waypoints/lib/shortcuts/inview';

import 'jquery-smooth-scroll';
import MobileMenu from './MobileMenu';

/**
 * Navigation javascript including menu icon, sticky, and active sections
 */
class Navigation {

    /**
     * Constructor for Navigation
     */
    constructor() {
        this.siteHeader = $('.site-header');
        this.profileSection = $('.profile');
        this.pageSections = $('.page-section');
        this.headerLinks = $('.site-header__menu-content a');
        this.downArrow = $('.large-hero__arrow-box');

        this.siteHeader.after('<div class="site-header__placeholder"></div>');
        this.navPlaceholder = $('.site-header__placeholder');
        this.init();
    }

    /**
     * Initialize navigation called in the constructor
     */
    init() {
        this.mobileMenu = new MobileMenu();
        this.events();

        this.addSmoothScrolling();

        this.headerStickyOnLoad();

        this.headerStickyWaypoint();

        this.addHeaderColorWaypoint();
        this.removeHeaderColorWaypoint();

        this.createPageSectionWaypoints();
    }

    /**
     * Dom events
     */
    events() {
        this.downArrow.click(this.scrollToProfile.bind(this));
        this.headerLinks.click(this.mobileMenu.closeMenu.bind(this.mobileMenu));
    }

    /**
     * Scroll to the profile section - for use with the down arrow
     */
    scrollToProfile() {
        $('html, body').animate({
            scrollTop: this.profileSection.offset().top,
        }, 900);
    }

    /**
     * Add smooth scrolling to the hashes in the navigation
     * The -56 offset is to give padding for the sticky navigation
     */
    addSmoothScrolling() {
        let headerHeight = -56;
        this.headerLinks.smoothScroll({offset: headerHeight});
    }

    /**
     * Add the classes to make the header sticky - including making the
     * placeholder visible
     */
    makeHeaderSticky() {
        this.siteHeader.addClass('site-header--fixed');
        this.navPlaceholder.addClass('site-header__placeholder--is-visible');
    }

    /**
     * Make the header sticky on load if it should be sticky
     */
    headerStickyOnLoad() {
        let scrollPosition = $(window).scrollTop();
        let downArrowPosition = this.downArrow.offset().top;
        if (scrollPosition > downArrowPosition) {
            this.addHeaderColor();
            this.makeHeaderSticky();
        }
    }

    /**
     * Make a waypoint to make the header sticky - this uses the inview shortcut
     * of waypoints make the header sticky when the arrow is exited and stop it
     * from being sticky when the arrow is entered on the way back up
     */
    headerStickyWaypoint() {
        let that = this;
        new Waypoint.Inview({
            element: that.downArrow[0],
            exited: function(direction) {
                if (direction === 'down') {
                    that.makeHeaderSticky();
                }
            },
            enter: function(direction) {
                if (direction === 'up') {
                    that.removeSticky();
                }
            },
        });
    }

    /**
     * Remove the sticky header when needed. Also closed the mobile menu if open
     */
    removeSticky() {
        this.mobileMenu.closeMenu();
        this.siteHeader.removeClass('site-header--fixed');
        this.navPlaceholder.removeClass('site-header__placeholder--is-visible');
    }

    /**
     * Add the color class to the header
     */
    addHeaderColor() {
        this.siteHeader.addClass('site-header--gray');
    }

    /**
     * Add the waypoint for when to add the color. This will happen BEFORE the
     * arrow is reached
     */
    addHeaderColorWaypoint() {
        let that = this;
        new Waypoint({
            element: that.downArrow[0],
            handler: function(direction) {
                if (direction === 'down') {
                    that.addHeaderColor();
                }
            },
            offset: '13%',
        });
    }

    /**
     * add waypoint for removing the header color. This will happen BEFORE the
     * arrow is reached
     * @param {type} name - comment
     */
    removeHeaderColorWaypoint() {
        let that = this;
        new Waypoint({
            element: that.downArrow[0],
            handler: function(direction) {
                if (direction === 'up') {
                    that.siteHeader.removeClass('site-header--gray');
                }
            },
            offset: '13%',
        });
    }

    /**
     * Create waypoints for page sections to change the active
     * section in the nav
     */
    createPageSectionWaypoints() {
        let that = this;
        this.pageSections.each(function() {
            let currentPageSection = this;
            new Waypoint({
                element: currentPageSection,
                handler: function(direction) {
                    if (direction === 'down') {
                        let matchingHeaderLink =
                            currentPageSection
                            .getAttribute('data-matching-link');
                        that.headerLinks.removeClass('is-current-link');
                        $(matchingHeaderLink).addClass('is-current-link');
                    }
                },
                offset: '18%',
            });

            new Waypoint({
                element: currentPageSection,
                handler: function(direction) {
                    if (direction === 'up') {
                        let matchingHeaderLink =
                            currentPageSection
                            .getAttribute('data-matching-link');
                        that.headerLinks.removeClass('is-current-link');
                        $(matchingHeaderLink).addClass('is-current-link');
                    }
                },
                offset: '-40%',
            });
        });
    }
}

export default Navigation;
