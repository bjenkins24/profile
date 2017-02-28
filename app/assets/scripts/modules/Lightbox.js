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
        this.overlay = $(`.${this.overlayClass}`);
        this.leftArrowClass = `${this.overlayClass}__left-arrow`;
        this.rightArrowClass = `${this.overlayClass}__right-arrow`;
        this.containerClass = `${this.overlayClass}__container`;
        this.container = $(`.${this.containerClass}`);

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
            `<ul class="${this.overlayClass}__container__nav"></ul>`;

        this.events();
    }

    /**
     * DOM events
     */
    events() {
        this.clickedElement.click(this.open.bind(this));
        this.overlay.click(this.close.bind(this));
        $(window).resize(this.resizeDescription.bind(this));

        // If anything in the container is clicked it will NOT close
        this.container.click(
            (e) => {
                e.stopPropagation();
            }
        );
    }

    /**
     * Make sure the description is the correct height
     * Not too excited about this function - I feel like there's a better way
     * to do this with just css, but going to leave it here for now in favor of
     * time.
     */
    resizeDescription() {
        let openContainer = $(`.${this.containerClass}--open`);
        let image = openContainer
            .find(`.${this.containerClass}__image`);
        let nav = $(`.${this.containerClass}__nav`);

        let navHeight = nav.height();
        let windowHeight = $(window).height();
        let imageHeight = image.height();
        let descriptionTopBottomMargin = 25;

        let containerHeight = windowHeight-navHeight-descriptionTopBottomMargin;
        let descriptionHeight =
            containerHeight -
            imageHeight -
            descriptionTopBottomMargin;

        openContainer.css('height', `${containerHeight}px`);
        // Move the container up to make room for the upper navigation
        openContainer.css('margin-top', `${navHeight/1.5}px`);
        openContainer.find(`.${this.containerClass}__description`)
            .css('height', `${descriptionHeight}px`);
    }

    /**
     * Retrieve the correct lightbox
     * @param {Object} target
     * @return {Object}
     */
    getItem(target) {
        let whichLightbox = $(target).data('lightbox');
        return $(`.${this.overlayClass}[data-lightbox="${whichLightbox}"]`);
    }

    /**
     * Add or remove the close button depending on if it exists or not
     */
    addRemoveCloseButton() {
        let closeButton = $(`.${this.overlayClass}__close`);
        if (closeButton.length === 0) {
            this.overlay.append(this.closeButtonHtml);
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
            $(`.${this.overlayClass}--open`).append(this.navHtml);

            nav = $(`.${this.containerClass}__nav`);

            $(`.${this.overlayClass}--open .${this.overlayClass}__container`)
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
            this.overlay.append(this.leftArrowHtml);
            leftArrow = $(`.${this.overlayClass}__left-arrow`);

            // Add click event for left arrow - this doesn't work on .on in
            // events because I have to stop propagation in order to not close
            // the light box
            leftArrow.click(this.leftImage.bind(this));
        } else {
            leftArrow.fadeOut(400, function() {
                leftArrow.remove();
            });
        }

        let rightArrow = $(`.${this.overlayClass}__right-arrow`);
        if (rightArrow.length === 0) {
            this.overlay.append(this.rightArrowHtml);
            rightArrow = $(`.${this.overlayClass}__right-arrow`);

            // Add click event for right arrow - this doesn't work on .on in
            // events because I have to stop propagation in order to not close
            // the light box
            rightArrow.click(this.rightImage.bind(this));
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
        let item = this.getItem(e.currentTarget);
        item.addClass(`${this.overlayClass}--open`);

        this.addRemoveElements();

        $('body').addClass('no-scroll');
        this.switchImage(1);
    }

    /**
     * Close the images by removing the containter open class. This happens
     * before any images are opened
     */
    closeAllImages() {
        this.container.removeClass(`${this.containerClass}--open`);
        $(`ul.${this.containerClass}__nav li`)
            .removeClass(`${this.containerClass}__nav--active`);
    }

    /**
     * Go to the left image
     * @param {Object} e - event
     */
    leftImage(e) {
        let currentImage = $(`.${this.containerClass}--open`)
            .data('lightbox-number');
        let totalImages =
            $(`.${this.overlayClass}--open .${this.containerClass}`)
            .length;

        let nextImage;
        if (currentImage === 1) {
            nextImage = totalImages;
        } else {
            nextImage = currentImage-1;
        }

        this.switchImage(nextImage);
        e.stopPropagation();
    }

    /**
     * Go to the right image
     * @param {Object} e - event
     */
    rightImage(e) {
        let currentImage = $(`.${this.containerClass}--open`)
            .data('lightbox-number');
        let totalImages =
            $(`.${this.overlayClass}--open .${this.containerClass}`)
            .length;

        let nextImage;
        if (currentImage === totalImages) {
            nextImage = 1;
        } else {
            nextImage = currentImage+1;
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

        let nextImage =
            $(`.${this.containerClass}[data-lightbox-number="${number}"]`);

        nextImage.addClass(`${this.containerClass}--open`);

        this.resizeDescription();

        this.switchNav(number);
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
        this.addRemoveElements();

        $(e.currentTarget)
            .closest(`.${this.overlayClass}`)
            .removeClass(`${this.overlayClass}--open`);

        $('body').removeClass('no-scroll');
        this.closeAllImages();
    }
}

export default Lightbox;
