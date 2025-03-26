// Акардион
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq__head__content").forEach((item) => {
    item.addEventListener("click", () => {
      let parent = item.parentElement;
      let isActive = parent.classList.toggle("active");

      let img = item.querySelector("img");

      img.style.opacity = "0"; 
      setTimeout(() => {
        img.src = isActive ? "./img/faq__close.png" : "./img/faq__open.png";
        img.style.opacity = "1"; 
      }, 300);
    });
  });
});

