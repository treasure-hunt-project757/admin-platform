import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

/**
 * Swiper configuration options including navigation, pagination, scrollbar, and accessibility modules.
 * It enables autoplay with a delay, adjusts space between slides, and provides breakpoints for responsiveness.
 */
export const SwiperConfig = (directionType: "vertical" | "horizontal") => ({
  modules: [Navigation, Pagination, Scrollbar, A11y],
  direction: directionType, // Now correctly typed as "vertical" or "horizontal"
  initialSlide: 0,
  spaceBetween: 5,
  slidesPerView: "auto" as const,
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  allowTouchMove: true,
  breakpoints: {
    900: {
      autoplay: false,
      spaceBetween: 5,
      slidesPerView: "auto" as const,
    },
  },
  watchOverflow: true,
});
