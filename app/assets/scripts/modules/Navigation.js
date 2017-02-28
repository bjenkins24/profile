import $ from 'jquery';
import waypoints from '../../../../node_modules/waypoints/lib/noframework.waypoints';
import smoothScroll from 'jquery-smooth-scroll';
import MobileMenu from "./MobileMenu";

class Navigation {
    constructor() {
        this.siteHeader = $('.site-header');
        this.profileSection = $('.profile');
        this.pageSections = $('.page-section');
        this.headerLinks = $(".site-header__menu-content a");
        this.downArrow = $( ".large-hero__arrow-box" );

        this.profileSection.before("<div class='site-header__placeholder'></div>");
        this.navPlaceholder = $(".site-header__placeholder");
        this.init();
    }

    init() {
        this.mobileMenu = new MobileMenu();
        this.events();

        this.addSmoothScrolling();
        this.makeHeaderSticky();
        
        this.addHeaderColor();
        this.removeHeaderColor();

        this.createPageSectionWaypoints();
    }

    events() {
        this.downArrow.click(this.scrollToProfile.bind(this));
        this.headerLinks.click(this.mobileMenu.closeMenu.bind(this.mobileMenu));
    }

    scrollToProfile() {
        $('html, body').animate({
            scrollTop: this.profileSection.offset().top
        }, 900);
    }

    addSmoothScrolling() {
        this.headerLinks.smoothScroll({offset: -56});
    }

    makeHeaderSticky() {
        let that = this;
        let removeStickyCounter = 0;
        new Waypoint({
            element: that.siteHeader[0],
            handler: function(direction) {
                if (direction == 'down') {
                    that.siteHeader.addClass('site-header--fixed');
                    that.navPlaceholder.addClass("site-header__placeholder--is-visible");

                    if (removeStickyCounter === 0) {
                        that.removeSticky();
                        removeStickyCounter = removeStickyCounter+1;
                    }

                } 
            }
        });
    }

    /** This happens at the bottom of the nav placeholder arrow. It can't be attached
    * to the site header because the site header is fixed at this point
    */
    removeSticky() {
        let that = this;
        new Waypoint({
            element: that.navPlaceholder[0],
            handler: function(direction) {
                if (direction == 'up') {
                    that.mobileMenu.closeMenu();
                    that.siteHeader.removeClass('site-header--fixed');
                    that.navPlaceholder.removeClass("site-header__placeholder--is-visible");
                } 
            }
        });
    }

    addHeaderColor() {
        let that = this;
        new Waypoint({
            element: that.downArrow[0],
            handler: function(direction) {
                if (direction == 'down') {
                    that.siteHeader.addClass('site-header--gray');
                } 
            },
            offset: "13%"
        });
    }

    /** This happens at the bottom of the nav placeholder. It can't be attached
    * to the site header because the site header is fixed at this point
    */
    removeHeaderColor() {
        let that = this;
        new Waypoint({
            element: that.downArrow[0],
            handler: function(direction) {
                if (direction == 'up') {
                    that.siteHeader.removeClass('site-header--gray');
                } 
            },
            offset: "13%"
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
