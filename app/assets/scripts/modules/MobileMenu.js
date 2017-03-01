import $ from 'jquery';

/**
 * Toggle the mobile menu and close it used in {@link Navigation}
 */
class MobileMenu {

    /**
     * Constructor for mobile menu
     */
    constructor() {
        this.siteHeader = $('.site-header');
        this.menuIcon = $('.site-header__menu-icon');
        this.menuContent = $('.site-header__menu-content');
        this.events();
    }

    /**
     * Events for MobileMenu
     */
    events() {
        this.menuIcon.click(this.toggleTheMenu.bind(this));
    }

    /**
     * Exclusively used in {@link Navigation.js}
     */
    closeMenu() {
        this.menuContent.removeClass('site-header__menu-content--is-visible');
        this.siteHeader.removeClass('site-header--is-expanded');
        this.menuIcon.removeClass('site-header__menu-icon--close-x');
    }

    /**
     * Toggle open and close the menu
     */
    toggleTheMenu() {
        this.menuContent.toggleClass('site-header__menu-content--is-visible');
        this.siteHeader.toggleClass('site-header--is-expanded');
        this.menuIcon.toggleClass('site-header__menu-icon--close-x');
    }

}

export default MobileMenu;
