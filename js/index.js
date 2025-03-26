// Акардион
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq__head__content").forEach((item) => {
    item.addEventListener("click", () => {
      let parent = item.parentElement;

      // Закрываем другие
      document.querySelectorAll(".faq__list__item").forEach((faq) => {
        if (faq !== parent) {
          faq.classList.remove("active");
          faq.querySelector("img").src = "./img/faq__open.png";
        }
      });

      // Переключаем активность
      let isActive = parent.classList.toggle("active");

      // Меняем картинку
      let img = item.querySelector("img");
      img.src = isActive ? "./img/faq__close.png" : "./img/faq__open.png";
    });
  });
});
