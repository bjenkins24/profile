import $ from 'jquery';
import waypoints from '../../../../node_modules/waypoints/lib/noframework.waypoints';
import inview from '../../../../node_modules/waypoints/lib/shortcuts/inview';
import smoothScroll from 'jquery-smooth-scroll';
import MobileMenu from "./MobileMenu";

class Navigation {
    constructor() {
        this.siteHeader = $('.site-header');
        this.profileSection = $('.profile');
        this.pageSections = $('.page-section');
        this.headerLinks = $(".site-header__menu-content a");
        this.downArrow = $( ".large-hero__arrow-box" );

        this.siteHeader.after("<div class='site-header__placeholder'></div>");
        this.navPlaceholder = $(".site-header__placeholder");
        this.init();
    }

    init() {
        this.mobileMenu = new MobileMenu();
        this.events();

        this.addSmoothScrolling();

        this.headerStickyOnLoad();

        this.headerStickyWaypoint();
        
        this.addHeaderColorWaypoint();
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
        this.siteHeader.addClass('site-header--fixed');
        this.navPlaceholder.addClass("site-header__placeholder--is-visible");
    }

    headerStickyOnLoad() {
        let scrollPosition = $(window).scrollTop();
        let downArrowPosition = this.downArrow.offset().top;
        if ( scrollPosition > downArrowPosition ) {
            this.addHeaderColor();
            this.makeHeaderSticky();
        }
    } 

    headerStickyWaypoint() {
        let that = this;
        new Waypoint.Inview({
            element: that.downArrow[0],
            exited: function(direction) {
                if(direction == 'down') {
                    that.makeHeaderSticky();
                }
            },
            enter: function(direction) {
                if(direction == 'up') {
                    that.removeSticky();
                }
            }
        });
    }
    
    removeSticky() {
        this.mobileMenu.closeMenu();
        this.siteHeader.removeClass('site-header--fixed');
        this.navPlaceholder.removeClass("site-header__placeholder--is-visible");
    }

    addHeaderColor() {
        this.siteHeader.addClass('site-header--gray');
    }

    addHeaderColorWaypoint() {
        let that = this;
        new Waypoint({
            element: that.downArrow[0],
            handler: function(direction) {
                if (direction == 'down') {
                    that.addHeaderColor();
                } 
            },
            offset: "13%"
        });
    }

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
