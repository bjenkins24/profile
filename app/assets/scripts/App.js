import $ from "jquery";
import Navigation from "./modules/Navigation";
import Tooltip from "./modules/Tooltip";
import RevealOnScroll from "./modules/RevealOnScroll";
import ZoomHover from "./modules/ZoomHover";
import Lightbox from "./modules/Lightbox";

const navigation = new Navigation();
new RevealOnScroll($( ".abilities__list li, .profile--reveal, .experience--reveal, .projects .row" ), "100%");
const toolTip = new Tooltip();
const zoomHover = new ZoomHover();
const lightbox = new Lightbox();
