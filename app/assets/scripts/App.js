import $ from 'jquery';
import Navigation from './modules/Navigation';
import Tooltip from './modules/Tooltip';
import RevealOnScroll from './modules/RevealOnScroll';
import ZoomHover from './modules/ZoomHover';
import Lightbox from './modules/Lightbox';

new Navigation();
new RevealOnScroll(
    $(`.abilities__list,
      .profile--reveal,
      .experience--reveal,
      .projects .row`),
    '100%');
new Tooltip();
new ZoomHover();
new Lightbox();
