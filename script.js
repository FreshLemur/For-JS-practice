/* Сховища браузера. Cookies, Local Storage, Session Storage. 
Які між ними різниця?

1. Різниця в максимальному розміру пам'яті, яке вони можуть зберігати / Capasity: 
Cookies: 4kb;
Local Storage: 5-10Mbs(в залежності від браузера, в хрому це 10);
Session Storage: 5Mbs.

2. Доступ / Accessibility:
Cookies: Можна достукатися у всіх вікнах;
Local Storage: Можна достукатися у всіх вікнах;
Session Storage: Приватне для кожного окремого вікна.

3. Expiration / Термін придатності:
Cookies: Встановлюється вручну;
Local Storage: Буквально ніколи не зникає, хіба що видалити в коді або в самому браузері;
Session Storage: До закриття вікна.

4. Чи додається в HTTP-запит / Passed in request:
Cookies: Додаються з кожним HTTP-запитом;
Local Storage: Не додаються;
Session Storage: Не додаються.

5. Сховище / Storage :
Cookies: Сховище браузера(в особливому випадку можливі сховища в базі даних (на сервері));
Local Storage: Сховище браузера;
Session Storage: Сховище браузера.

*/

/* Як працює Local Storage:
Тепер як вони працюють насправді, використання у нашому випадку, для того щоб зберігати товар при оновленні вікна.
Буде використовуватися Local Storage.

Є об'єкт localStorage, має кілька методів:

1. .setItem - задає елемент в Local storage
Синтаксис: localStorage.setItem("key", "value"), мається на увазі key як властивість, а value як значення, тобто вигляд буде:
localStorage.setItem("name", "Vitaly");
localStorage.setItem("age", 18);
Щоб побачити, треба відкрити вкладку Application, потім Local storage, адресу і буде це видно.

2. .getItem - знаходить елемент чи достукуєся до нього в Local Storage.
Синтаксис: 
localStorage.getItem("name") / Поверне "Vitaly";
localStorage.getItem("age") / Поверне 18; 
Тому що при 1 дії ми засетили ці значення в ці властивості.

3. .remove item - знаходить елемент і видаляє його.
Синтаксис: 
localStorage.removeItem("name"); - видаляє властивість name.
localStorage.removeItem("age") - видаляє властивість age.

4. .clear - видаляє всі елементи які були в Local storage.
Синтаксис: 
localStorage.clear()

Також є можливість видалити засечені дані у вікні Application, натиснувши на кнопу "Clear All", тобто вручну, без команд.
Якщо не видаляти дані з Local Storage, вони ніколи не зникнуть і будуть там вічно.
*/

const CART_PRODUCTS_LABEL = "cart-products";
// Якщо ми повторюємо в коді якесь значення кілька разів, то краще буде засунути його в змінну і використовувати змінну.
// Ми використовуємо стрінгове значення "cart-products" кілька разів, тому під нього була створена ця змінна.
// Конвенція при створенні таких змінних, які позначають стрігну - писати великими літерами, використовуєчи нижні риски.

const getProducts = async () => {
  const response = await fetch("https://fakestoreapi.com/products?limit=9");
  const products = await response.json();
  return products;
};

const renderProducts = async () => {
  const products = await getProducts();
  const container = document.querySelector(".products-container");
  for (const item of products) {
    // creating elements
    const productWrapper = document.createElement("li");
    const productImg = document.createElement("img");
    const productTitle = document.createElement("h4");
    const productDescription = document.createElement("p");
    const productPriceSection = document.createElement("section");
    const productPrice = document.createElement("span");
    const productBuyBtn = document.createElement("button");
    // setting values for elements
    productWrapper.classList.add("product-item");
    productPriceSection.classList.add("product-item-price");
    productImg.src = item.image;
    productTitle.innerText = item.title;
    productDescription.innerText = item.description;
    productPrice.innerText = `${item.price}$`;
    productBuyBtn.innerText = "Add to cart";
    productBuyBtn.addEventListener("click", () => addToCart(item));
    // appending elements inside the wrappers
    productPriceSection.append(productPrice, productBuyBtn);
    productWrapper.append(
      productImg,
      productTitle,
      productDescription,
      productPriceSection
    );
    container.append(productWrapper);
  }
};

const removeProductFromCart = (event) => {
  event.target.parentElement.parentElement.remove();
  const cartListItems = document.getElementsByClassName("cart-list-item");
  updateCartTotal();
  if (!cartListItems.length) {
    const cartListWrapper = document.querySelector(".cart-list-wrapper");
    const emptyCartTitle = document.querySelector(".cart-empty-title");
    cartListWrapper.style.display = "none";
    emptyCartTitle.style.display = "block";
  }
};

const addToCart = (product) => {
  const cartItems = document.getElementsByClassName("cart-list-item");
  for (const item of cartItems) {
    if (product.id === +item.getAttribute("id")) {
      const quantityInput = item.querySelector(
        ".cart-list-quantity-section > input"
      );
      quantityInput.value++;
      updateCartTotal();
      return;
    }
  }
  const cart = document.querySelector(".cart-list");
  const emptyCartTitle = document.querySelector(".cart-empty-title");
  const cartListWrapper = document.querySelector(".cart-list-wrapper");
  // creating elements
  const cartListItem = document.createElement("li");
  const cartListImgSection = document.createElement("section");
  const cartListPriceSection = document.createElement("section");
  const cartListQuantitySection = document.createElement("section");
  const image = document.createElement("img");
  const title = document.createElement("h4");
  const price = document.createElement("span");
  const quantity = document.createElement("input");
  const removeBtn = document.createElement("button");
  quantity.addEventListener("change", updateCartTotal);
  removeBtn.addEventListener("click", (event) =>
    removeProductFromCart(event, product)
  );
  // setting values
  cartListItem.classList.add("cart-list-item");
  cartListImgSection.classList.add(
    "cart-list-item-section",
    "cart-list-img-section"
  );
  cartListPriceSection.classList.add(
    "cart-list-item-section",
    "cart-list-price-section"
  );
  cartListQuantitySection.classList.add(
    "cart-list-item-section",
    "cart-list-quantity-section"
  );

  image.src = product.image;
  title.innerText = product.title;
  price.innerText = `${product.price}$`;
  quantity.type = "number";
  quantity.value = 1;
  quantity.min = 1;
  removeBtn.innerText = "REMOVE";
  emptyCartTitle.style.display = "none";
  cartListWrapper.style.display = "block";
  // appending values
  cartListImgSection.append(image, title);
  cartListPriceSection.appendChild(price);
  cartListQuantitySection.append(quantity, removeBtn);
  cartListItem.setAttribute("id", product.id);
  cartListItem.append(
    cartListImgSection,
    cartListPriceSection,
    cartListQuantitySection
  );
  cart.appendChild(cartListItem);
  updateCartTotal();
};

const renderCartItem = (product, inputNumber) => {
  const cart = document.querySelector(".cart-list");
  const emptyCartTitle = document.querySelector(".cart-empty-title");
  const cartListWrapper = document.querySelector(".cart-list-wrapper");
  // creating elements
  const cartListItem = document.createElement("li");
  const cartListImgSection = document.createElement("section");
  const cartListPriceSection = document.createElement("section");
  const cartListQuantitySection = document.createElement("section");
  const image = document.createElement("img");
  const title = document.createElement("h4");
  const price = document.createElement("span");
  const quantity = document.createElement("input");
  const removeBtn = document.createElement("button");
  quantity.addEventListener("change", () => getCartTotal(product));
  removeBtn.addEventListener("click", (event) =>
    removeProductFromCart(event, product)
  );
  // setting values
  cartListItem.classList.add("cart-list-item");
  cartListImgSection.classList.add(
    "cart-list-item-section",
    "cart-list-img-section"
  );
  cartListPriceSection.classList.add(
    "cart-list-item-section",
    "cart-list-price-section"
  );
  cartListQuantitySection.classList.add(
    "cart-list-item-section",
    "cart-list-quantity-section"
  );
  image.src = product.image;
  title.innerText = product.title;
  price.innerText = `${product.price}$`;
  quantity.type = "number";
  quantity.value = inputNumber || 1;
  quantity.min = 1;
  quantity.className = "quantity-input";
  removeBtn.innerText = "REMOVE";
  emptyCartTitle.style.display = "none";
  cartListWrapper.style.display = "block";
  // appending values
  cartListImgSection.append(image, title);
  cartListPriceSection.appendChild(price);
  cartListQuantitySection.append(quantity, removeBtn);
  cartListItem.setAttribute("id", product.id);
  cartListItem.append(
    cartListImgSection,
    cartListPriceSection,
    cartListQuantitySection
  );
  cart.appendChild(cartListItem);
};

const renderInitialCart = () => {
  const currentCartProructs = getCurrentCartItems();
  if (!currentCartProructs.length) { // Якщо currentCartProructs.length === 0, то ми просто не зайдемо далі і функція припиняє свою дію.
    return;
  }
  currentCartProructs.forEach((item) => renderCartItem(item, item.amount)); // Якщо if не спрацює, то ми перейдемо сюди. Ми пробігаємося по масиву currentCartProructs і для кожного елементу цього масиву викоикажмр функцію renderCartItem, передаючи їй 2 аргументи.
  getCartTotal(); // Для підрахування загальної суми.
};

const updateCartTotal = () => {
  const totalAmount = document.querySelector(".total-amount > span");
  const cartItems = document.getElementsByClassName("cart-list-item");
  let total = 0;
  for (const item of cartItems) {
    const price = item.querySelector(".cart-list-price-section > span");
    const quantity = item.querySelector(".cart-list-quantity-section > input");
    const currentAmount = parseFloat(price.innerText) * quantity.value;
    total += currentAmount;
  }
  totalAmount.innerText = `${total}$`;
};

const getCurrentCartItems = () => {
  JSON.parse(localStorage.getItem(CART_PRODUCTS_LABEL)) || [];
}
/* Або ми отримаємо масив вже готових, обраних користувачем елементів (CART_PRODUCTS_LABEL), або (||) буде повернено пустий масив.
Це робиться для уникнення помилок.

Ця функція написана на мові програмування JavaScript і виконує одну конкретну задачу - отримання поточного змісту кошика збереженого
в локальному сховищі браузера. Давайте докладніше розглянемо, що робить кожна частина цього коду:

const getCurrentCartItems = () => {: Визначається константа getCurrentCartItems, яка представляє собою стрілкову функцію без параметрів.

JSON.parse(localStorage.getItem(CART_PRODUCTS_LABEL)) || [];: Використовуючи localStorage.getItem(CART_PRODUCTS_LABEL), 
функція отримує значення, збережене в локальному сховищі браузера під певним міткою CART_PRODUCTS_LABEL. Це значення отримується у вигляді рядка.

Далі, JSON.parse() використовується для перетворення отриманого рядка у JavaScript об'єкт або масив
(залежно від того, що саме зберігалося в локальному сховищі). Якщо відсутнє збережене значення або воно не є валідним JSON, 
то JSON.parse поверне null.

Оператор || [] використовується для забезпечення того, що функція завжди повертає масив, 
навіть якщо збережене значення відсутнє або невірне. Це допомагає уникнути помилок, 
пов'язаних зі спробою роботи з null або undefined.

Отже, загальна мета цієї функції - отримати зміст кошика з локального сховища браузера та повернути його у вигляді масиву. 
*/
renderProducts();
