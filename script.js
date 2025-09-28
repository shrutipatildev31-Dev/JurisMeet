document.addEventListener("DOMContentLoaded", function () {
  const carouselItems = document.querySelectorAll(".carousel-item");
  const carouselDots = document.querySelectorAll(".carousel-dot");
  const prevButton = document.querySelector(".carousel-prev");
  const nextButton = document.querySelector(".carousel-next");
  let currentIndex = 0;
  let interval;
  function showSlide(index) {
    carouselItems.forEach((item, i) => {
      item.classList.remove("active", "opacity-100");
      item.classList.add("opacity-0");
      if (i === index) {
        item.classList.add("active");
        setTimeout(() => item.classList.add("opacity-100"), 50);
      }
    });
    carouselDots.forEach((dot, i) => {
      dot.classList.remove("active", "bg-white");
      dot.classList.add("bg-white/50");
      if (i === index) {
        dot.classList.add("active", "bg-white");
        dot.classList.remove("bg-white/50");
      }
    });
    currentIndex = index;
  }
  function nextSlide() {
    const newIndex = (currentIndex + 1) % carouselItems.length;
    showSlide(newIndex);
  }
  function prevSlide() {
    const newIndex =
      (currentIndex - 1 + carouselItems.length) % carouselItems.length;
    showSlide(newIndex);
  }
  function startCarousel() {
    interval = setInterval(nextSlide, 5000);
  }
  function stopCarousel() {
    clearInterval(interval);
  }
  nextButton.addEventListener("click", () => {
    stopCarousel();
    nextSlide();
    startCarousel();
  });
  prevButton.addEventListener("click", () => {
    stopCarousel();
    prevSlide();
    startCarousel();
  });
  carouselDots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      stopCarousel();
      showSlide(i);
      startCarousel();
    });
  });
  showSlide(0);
  startCarousel();
  // Sticky nav logic
  const header = document.querySelector("header");
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (window.scrollY > lastScrollY) {
      header.classList.remove("h-24");
      header.classList.add("h-20", "shadow-md");
    } else {
      if (window.scrollY === 0) {
        header.classList.remove("h-20", "shadow-md");
        header.classList.add("h-24");
      }
    }
    lastScrollY = window.scrollY;
  });
});
