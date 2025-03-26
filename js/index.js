// Акардион для FAQ
document.addEventListener("DOMContentLoaded", () => {
  // Находим все элементы с классом .faq__head__content (заголовки для каждого вопроса)
  document.querySelectorAll(".faq__head__content").forEach((item) => {
    item.addEventListener("click", () => {
      let parent = item.parentElement; // Получаем родительский элемент (контейнер для вопроса)
      let isActive = parent.classList.toggle("active"); // Переключаем класс "active" для активации / деактивации

      let img = item.querySelector("img"); // Находим изображение внутри заголовка

      img.style.opacity = "0"; // Скрываем текущее изображение с плавным эффектом
      setTimeout(() => {
        // Меняем изображение после 350ms, когда оно скрыто
        img.src = isActive ? "./img/faq__close.png" : "./img/faq__open.png";
        img.style.opacity = "1"; // Показываем новое изображение с плавным эффектом
      }, 350);
    });
  });
});

// Функция для создания элементов товаров на странице
const createItem = (productsData) => {
  const container = document.querySelector(".products__list"); // Находим контейнер для вывода товаров

  // Проверка данных на корректность
  if (
    !productsData ||
    !productsData.data ||
    !productsData.data.products ||
    !productsData.data.products.edges
  ) {
    console.error("Ошибка: нет данных продуктов."); // Если данных нет — выводим ошибку
    return;
  }

  // Перебираем каждый товар в массиве products.edges
  productsData.data.products.edges.forEach((productEdge) => {
    const product = productEdge.node; // Получаем данные о товаре

    const productElement = document.createElement("li"); // Создаем элемент для товара
    productElement.classList.add("products__list__item"); // Добавляем класс для товара

    // Получаем ссылки на изображения товара
    const mainImage = product.images.edges[0]?.node.url; // Основное изображение
    const hoverImage = product.images.edges[1]?.node.url; // Изображение для hover

    // Вставляем разметку товара в элемент
    productElement.innerHTML = `
      <div class="products__list-img">
        <img 
          src="${mainImage}" 
          alt="${product.images.edges[0]?.node.altText || ""}" 
          class="product-image"
          data-hover="${hoverImage}" />
        ${
          hoverImage
            ? `<img src="${hoverImage}" class="product-image product-image-hover" alt="hover image" />`
            : ""
        }
      </div>
      <div class="products__list__content">
        <h3 class="product__list-title">${product.title}</h3>
        <p class="product__list-text">${product.description}</p>
        <div class="products__list__content__wraps">
            ${
              product.variants.edges[0]?.node.compareAtPrice?.amount != null
                ? `<span class="compare-price">${product.variants.edges[0]?.node.compareAtPrice.amount} ${product.variants.edges[0]?.node.compareAtPrice.currencyCode}</span>`
                : ""
            }
            <span>
                ${product.variants.edges[0]?.node.price.amount} ${
      product.variants.edges[0]?.node.price.currencyCode
    }
            </span>
        </div>
      </div>
    `;

    // Получаем элементы изображения
    const imageElement = productElement.querySelector(".product-image");
    const hoverImageElement = productElement.querySelector(
      ".product-image-hover"
    );

    // Добавляем обработчики событий для hover-эффекта (смена изображений)
    if (hoverImageElement) {
      imageElement.addEventListener("mouseenter", () => {
        // Когда пользователь наводит на изображение, показываем hover-изображение
        hoverImageElement.style.opacity = 1;
        imageElement.style.opacity = 0;
      });

      imageElement.addEventListener("mouseleave", () => {
        // Когда пользователь убирает указатель, возвращаем основное изображение
        hoverImageElement.style.opacity = 0;
        imageElement.style.opacity = 1;
      });
    }

    // Добавляем созданный элемент товара в контейнер
    container.appendChild(productElement);
  });
};

// Запрос на получение данных продуктов с API
const query = `
  {
    products(first: 10) {
      edges {
        node {
          title
          description
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
                compareAtPrice{
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

// Функция для выполнения запроса и получения данных
const fetchProducts = async () => {
  try {
    const response = await fetch(
      "https://tsodykteststore.myshopify.com/api/2023-01/graphql.json", // URL API Shopify
      {
        method: "POST", // Метод POST для GraphQL запроса
        headers: {
          "Content-Type": "application/json", // Указываем тип контента
          "X-Shopify-Storefront-Access-Token":
            "7e174585a317d187255660745da44cc7", // Токен для доступа к API
        },
        body: JSON.stringify({ query }), // Передаем запрос в теле запроса
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`); // Если запрос не успешен, выводим ошибку
    }

    const data = await response.json(); // Получаем данные из ответа
    // Проверяем, что data.products существует
    if (
      !data ||
      !data.data ||
      !data.data.products ||
      !data.data.products.edges
    ) {
      throw new Error("Ответ не содержит ожидаемые данные."); // Если данных нет, выводим ошибку
    }

    console.log("Ответ от Shopify:", data.data.products.edges); // Логируем полученные данные
    createItem(data); // Передаем данные в функцию для создания элементов товаров
  } catch (error) {
    console.error("Ошибка запроса:", error); // Логируем ошибку в случае неудачи
  }
};

// Вызываем функцию для загрузки товаров
fetchProducts();
