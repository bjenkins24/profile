import $ from 'jquery';

class Lightbox {
    constructor() {
        this.clickedElement = $( ".lightbox" ); 

        this.overlayClass = "lightbox__overlay";
        this.leftArrowClass = this.overlayClass + "__left-arrow";
        this.rightArrowClass = this.overlayClass + "__right-arrow";
        this.overlay = $( "." + this.overlayClass);
        this.container = $("." + this.overlayClass + "__container" );

        // Html variables
        this.closeButtonHtml = 
            "<i class='fa fa-times " + this.overlayClass + "__close'></i>";
        this.leftArrowHtml = 
           "<div class='" + this.leftArrowClass + "'><i class='fa fa-angle-left'></i></div>";
        this.rightArrowHtml = 
            "<div class='" + this.rightArrowClass + "'><i class='fa fa-angle-right'></i></div>";
        this.navHtml = 
            "<ul class='" + this.overlayClass + "__container__nav'></ul>";

        this.events();
    } 

    events() {
        this.clickedElement.click(this.open.bind(this));
        this.overlay.click(this.close.bind(this));

        // Don't allow the lightbox to close on a click inside the container element
        this.container.click(this.stopPropagation);
    }

    stopPropagation(e) {
        e.stopPropagation();
    }

    getItem(target) {
        let whichLightbox = $(target).data( "lightbox" );
        return $( "." + this.overlayClass + "[data-lightbox='" + whichLightbox + "']" );
    }

    addRemoveCloseButton() {
        let closeButton = $( "." + this.overlayClass + "__close" );
        if ( closeButton.length === 0 ) {
            this.overlay.append( this.closeButtonHtml );
        } else {
            closeButton.fadeOut(400, function() {
                closeButton.remove();
            });
        }
    }

    addRemoveNav() {
        let nav = $( "." + this.overlayClass + "__container__nav" );
        if ( nav.length === 0 ) {

            $( "." + this.overlayClass + "--open" ).append(this.navHtml);
            
            nav = $( "." + this.overlayClass + "__container__nav" );

            $( "." + this.overlayClass + "--open ." + this.overlayClass + "__container" ).each(function(index, value) {
                    let name = $(value).data( "lightbox-name" );
                    let number = $(value).data( "lightbox-number" );
                    nav.append( "<li data-lightbox-number='" + number + "'>" + name + "</li>");
                }
            );

            nav.find( "li" ).click(this.clickNav.bind(this));

        } else {
            nav.fadeOut(400, function() {
                nav.remove();
            });
        }

    }

    clickNav(e) {
        let number = $(e.currentTarget).data( "lightbox-number" );
        this.switchImage(number);

        e.stopPropagation();
    }

    addRemoveArrows() {
        let leftArrow = $("." + this.overlayClass + "__left-arrow" );
        if ( leftArrow.length === 0 ) {
            this.overlay.append( this.leftArrowHtml );
            leftArrow = $("." + this.overlayClass + "__left-arrow" );

            // Add click event for left arrow - this doesn't work on .on in events because 
            // I have to stop propagation in order to not close lightbox
            leftArrow.click(this.leftImage.bind(this));
        } else {
            leftArrow.fadeOut(400, function() {
                leftArrow.remove();
            });
        }

        let rightArrow = $("." + this.overlayClass + "__right-arrow" );
        if ( rightArrow.length === 0 ) {
            this.overlay.append( this.rightArrowHtml );
            rightArrow = $("." + this.overlayClass + "__right-arrow" );

            // Add click event for right arrow - this doesn't work on .on in events because 
            // I have to stop propagation in order to not close lightbox
            rightArrow.click(this.rightImage.bind(this));
        } else {
            rightArrow.fadeOut(400, function() {
                rightArrow.remove();
            });
        }
    }

    addRemoveElements() {
        this.addRemoveCloseButton();
        this.addRemoveArrows();
        this.addRemoveNav();
    }

    open(e) {
        let item = this.getItem(e.currentTarget); 
        item.addClass( this.overlayClass + "--open" );

        this.addRemoveElements();

        $( "body" ).addClass( "no-scroll" );
        this.switchImage(1);
    }

    closeAllImages() {
        this.container.removeClass( this.overlayClass+"__container--open" );
        $( "ul." + this.overlayClass + "__container__nav li" )
            .removeClass( this.overlayClass + "__container__nav--active" );
    }

    leftImage(e) {
        let currentImage = $( "." + this.overlayClass + "__container--open" )
            .data( "lightbox-number" );
        let totalImages = $( "." +this.overlayClass + "--open ." + this.overlayClass + "__container" ).length;

        let nextImage;
        if( currentImage === 1 ) {
            nextImage = totalImages;
        } else {
            nextImage = currentImage-1;
        }

        this.switchImage( nextImage );
        e.stopPropagation();
    }

    rightImage(e) {
        let currentImage = $( "." + this.overlayClass + "__container--open" )
            .data( "lightbox-number" );
        let totalImages = $( "." +this.overlayClass + "--open ." + this.overlayClass + "__container" ).length;

        let nextImage;
        if( currentImage === totalImages ) {
            nextImage = 1;
        } else {
            nextImage = currentImage+1;
        }

        this.switchImage( nextImage );
        e.stopPropagation();
    }

    switchImage(number) {
        this.closeAllImages();

        $( "." + this.overlayClass + "__container[data-lightbox-number='" + number + "']" )
            .addClass( this.overlayClass + "__container--open" );

        this.switchNav(number); 
    }

    switchNav(number) {
        $( "." + this.overlayClass + "__container__nav li[data-lightbox-number='" + number + "']" )
            .addClass( this.overlayClass + "__container__nav--active" );
    }

    close(e) {
        this.addRemoveElements();

        $(e.currentTarget)
            .closest( "." + this.overlayClass )
            .removeClass( this.overlayClass + "--open");

        $( "body" ).removeClass( "no-scroll" );
        this.closeAllImages();
    }
}

export default Lightbox;