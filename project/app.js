const productContainer = document.getElementById("productContainer");
let allProducts = []; // store fetched products for filtering later

// Fetch products once
const fetchProducts = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    allProducts = data;
    displayProducts(allProducts); // show all initially
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

// Display products dynamically
function displayProducts(products) {
  productContainer.innerHTML = "";
  products.forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("product-card");

    // Short title (first 5 words)
    const shortTitle = product.title.split(" ").slice(0, 2).join(" ") + "...";

    // Short description (first 100 characters)
    const shortDesc = product.description.substring(0, 90)+"...";

    div.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${shortTitle}</h3>
      <p class="desc">${shortDesc}</p>
      <p class="price">$${product.price}</p>
      <button>Details</button>
      <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">
        Add to Cart
      </button>
    `;
    productContainer.appendChild(div);
  });
}


// Filter function
function filterProducts(category) {
  if (category === "all") {
    displayProducts(allProducts);
  } else {
    const filtered = allProducts.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
    displayProducts(filtered);
  }
}

// Add to cart (your existing function)
function addToCart(id, title, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, title, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

}

// Update cart count (your existing function)
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

// Initial load
fetchProducts();
updateCartCount();




