import $ from 'jquery';

/**
 * Lightbox for showing popup with navigation
 */
class Lightbox {

    /**
     * Lightbox constructor
     */
    constructor() {
        this.clickedElement = $('.lightbox');

        this.overlayClass = 'lightbox__overlay';
        this.leftArrowClass = `${this.overlayClass}__left-arrow`;
        this.rightArrowClass = `${this.overlayClass}__right-arrow`;
        this.containerClass = `${this.overlayClass}__container`;
        this.itemClass = `${this.containerClass}__item`;

        // Html variables
        this.closeButtonHtml =
            `<i class="fa fa-times ${this.overlayClass}__close"></i>`;

        this.leftArrowHtml =
           `<div class="${this.leftArrowClass}">
                <i class="fa fa-angle-left"></i>
            </div>`;

        this.rightArrowHtml =
            `<div class="${this.rightArrowClass}">
                <i class="fa fa-angle-right"></i>
            </div>`;

        this.navHtml =
            `<ul class="${this.containerClass}__nav"></ul>`;

        this.events();
    }

    /**
     * DOM events
     */
    events() {
        this.clickedElement.click(this.open.bind(this));
        $(`.${this.overlayClass}`).click(this.close.bind(this));

        // If anything in the container is clicked it will NOT close
        $(`.${this.containerClass}`).click(
            (e) => {
                e.stopPropagation();
            }
        );
    }

    /**
     * The body is still scrollable on mobile even with overflow: hidden on the
     * body. It can't be scrollable so this prevents the body from scrolling on
     * mobile touchmove event, and also adds the overflow: hidden
     * @param {Boolean} status - if true then stop scroll - if false start
     * it again
     */
    stopBodyScrolling(status) {
        if (status === true) {
            $('body').addClass('no-scroll');
            document.body
                .addEventListener('touchmove', this.stopDefault, false);
        } else {
            $('body').removeClass('no-scroll');
            document.body
                .removeEventListener('touchmove', this.stopDefault, false);
        }
    }

    /**
     * Stop default behavior
     * @param {Object} e - event
     */
    stopDefault(e) {
        e.preventDefault();
    }

    /**
     * Retrieve the correct lightbox
     * @param {Object} target
     * @return {Object}
     */
    getLightbox(target) {
        let whichLightbox = $(target).data('lightbox');
        return $(`.${this.overlayClass}[data-lightbox="${whichLightbox}"]`);
    }

    /**
     * Retrieve the open lightbox
     * @return {Object} the lightbox element
     */
    getOpenLightbox() {
        return $(`.${this.overlayClass}--open`);
    }

    /**
     * Get the item object
     * @param {Number} number - The item number
     * @return {Object} - return the item object
     */
    getItem(number) {
        let lightbox = this.getOpenLightbox();
        return lightbox
            .find(`.${this.itemClass}[data-lightbox-number="${number}"]`);
    }

    /**
     * Add or remove the close button depending on if it exists or not
     */
    addRemoveCloseButton() {
        let closeButton = $(`.${this.overlayClass}__close`);
        if (closeButton.length === 0) {
            $(`.${this.overlayClass}`).append(this.closeButtonHtml);
        } else {
            closeButton.fadeOut(400, function() {
                closeButton.remove();
            });
        }
    }

    /**
     * Add or remove the top nav depending on if it exists or not
     */
    addRemoveNav() {
        let nav = $(`.${this.containerClass}__nav`);
        if (nav.length === 0) {
            $(`.${this.overlayClass}--open .${this.containerClass}`)
                .prepend(this.navHtml);

            nav = $(`.${this.containerClass}__nav`);

            $(`.${this.overlayClass}--open .${this.itemClass}`)
                .each(function(index, value) {
                    let name = $(value).data('lightbox-name');
                    let number = $(value).data('lightbox-number');
                    nav.append(
                        `<li data-lightbox-number="${number}">${name}</li>`
                    );
                }
            );

            nav.find('li').click(this.clickNav.bind(this));
        } else {
            nav.fadeOut(400, function() {
                nav.remove();
            });
        }
    }

    /**
     * Event when clicking on a link in the nav
     * @param {Object} e - event
     */
    clickNav(e) {
        let number = $(e.currentTarget).data('lightbox-number');
        this.switchImage(number);

        e.stopPropagation();
    }

    /**
     * Add or remove arrows depending on if they exist or not
     */
    addRemoveArrows() {
        let leftArrow = $(`.${this.overlayClass}__left-arrow`);
        if (leftArrow.length === 0) {
            $(`.${this.overlayClass}`).append(this.leftArrowHtml);
            leftArrow = $(`.${this.overlayClass}__left-arrow`);

            // Add click event for left arrow - this doesn't work on .on in
            // events because I have to stop propagation in order to not close
            // the light box
            leftArrow.click((e) => {
                this.arrowSwitch(e, 'left');
            });
        } else {
            leftArrow.fadeOut(400, function() {
                leftArrow.remove();
            });
        }

        let rightArrow = $(`.${this.overlayClass}__right-arrow`);
        if (rightArrow.length === 0) {
            $(`.${this.overlayClass}`).append(this.rightArrowHtml);
            rightArrow = $(`.${this.overlayClass}__right-arrow`);

            // Add click event for right arrow - this doesn't work on .on in
            // events because I have to stop propagation in order to not close
            // the light box
            rightArrow.click((e) => {
                this.arrowSwitch(e, 'right');
            });
        } else {
            rightArrow.fadeOut(400, function() {
                rightArrow.remove();
            });
        }
    }

    /**
     * Add or remove all elements in one method
     */
    addRemoveElements() {
        this.addRemoveCloseButton();
        this.addRemoveArrows();
        this.addRemoveNav();
    }

    /**
     * Open the lightbox
     * @param {Object} e - event
     */
    open(e) {
        let lightbox = this.getLightbox(e.currentTarget);
        lightbox.addClass(`${this.overlayClass}--open`);

        this.addRemoveElements();

        this.stopBodyScrolling(true);
        this.switchImage(1);
    }

    /**
     * Close the images by removing the containter open class. This happens
     * before any images are opened
     */
    closeAllImages() {
        $(`.${this.itemClass}`).removeClass(`${this.itemClass}--open`);
        $(`ul.${this.containerClass}__nav li`)
            .removeClass(`${this.containerClass}__nav--active`);
    }


    /**
     * Switch images with arrow click
     * @param {Object} e - event
     * @param {string} direction - left or right depending on which arrow
     */
    arrowSwitch(e, direction) {
        let currentImage = $(`.${this.itemClass}--open`)
            .data('lightbox-number');
        let totalImages =
            $(`.${this.overlayClass}--open .${this.itemClass}`)
            .length;

        let nextImage;
        if (direction === 'left') {
            if (currentImage === 1) {
                nextImage = totalImages;
            } else {
                nextImage = currentImage-1;
            }
        }
        if (direction === 'right') {
            if (currentImage === totalImages) {
                nextImage = 1;
            } else {
                nextImage = currentImage+1;
            }
        }

        this.switchImage(nextImage);
        e.stopPropagation();
    }

    /**
     * Switch to an image given an image number
     * @param {Number} number - the number of the image that is going to show
     */
    switchImage(number) {
        this.closeAllImages();

        let nextImage = this.getItem(number);

        nextImage.addClass(`${this.itemClass}--open`);

        this.lazyLoad(number);
        this.switchNav(number);
    }

    /**
     * Lazy load the images in the lightbox. This also loads the following
     * image at the same time to make sure there is no waiting for images
     * img elements MUST have at least a data-src attribute for this to work
     * @param {Number} number - The number of the item that is being targeted
     */
    lazyLoad(number) {
        for (let i = number; i < number+2; i++) {
            let item = this.getItem(i);
            let target = item.find('img');

            if (target.length > 0 &&
                target[0].hasAttribute('data-src')) {
                let sizes = target.data('sizes');
                let src = target.data('src');
                let srcSet = target.data('srcset');

                target.removeAttr('data-sizes');
                target.removeAttr('data-src');
                target.removeAttr('data-srcset');

                target.attr('sizes', sizes);
                target.attr('src', src);
                target.attr('srcset', srcSet);
            }
        }
    }

    /**
     * Activate the correct navigation
     * @param {Number} number - the number of the navigation being selected
     */
    switchNav(number) {
        $(`.${this.containerClass}__nav li[data-lightbox-number="${number}"]`)
            .addClass(`${this.containerClass}__nav--active`);
    }

    /**
     * Close the lightbox
     * @param {Object} e - event
     */
    close(e) {
        $(e.currentTarget)
            .closest(`.${this.overlayClass}`)
            .removeClass(`${this.overlayClass}--open`);

        this.addRemoveElements();

        this.stopBodyScrolling(false);
    }
}

export default Lightbox;
