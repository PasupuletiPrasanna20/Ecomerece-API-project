
const cartItemsEl = document.getElementById("cartItems");
const productsTotalEl = document.getElementById("productsTotal");
const totalAmountEl = document.getElementById("totalAmount");
const itemCountEl = document.getElementById("itemCount");
const cartCountEl = document.getElementById("cart-count");
const shippingCost = 40;

/* Load Cart (called on page load and after qty changes) */
function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // remove any stale items that have qty <= 0 and persist cleaned cart
  cart = cart.filter(item => Number(item.quantity) > 0);
  localStorage.setItem("cart", JSON.stringify(cart));

  cartItemsEl.innerHTML = "";

  // total number of items (sum of quantities)
  const totalItems = cart.reduce((sum, it) => sum + Number(it.quantity), 0);

  // If cart is empty or totalItems === 0 → show empty message and reset totals
  if (cart.length === 0 || totalItems === 0) {
    cartItemsEl.innerHTML = `
       <div style="text-align:center; margin:40px 0;">
      <p style="font-size:20px; font-weight:600; margin-bottom:20px;">
        🛒 Your cart is empty
      </p>
      <a href="./product.html" 
         style="display:inline-block; padding:10px 20px; background:#000; color:#fff; 
                text-decoration:none; border-radius:5px;">
        Continue Shopping
      </a>
    </div>
    `;
    productsTotalEl.textContent = "0";
    totalAmountEl.textContent = "0";
    const shipEl = document.getElementById("shipping");
    if (shipEl) shipEl.textContent = "0";
    if (cartCountEl) cartCountEl.textContent = "0";
    if (itemCountEl) itemCountEl.textContent = "0";
    return;
  }

  // Otherwise render items
  let productsTotal = 0;

  cart.forEach((item) => {
    productsTotal += Number(item.price) * Number(item.quantity);

    const div = document.createElement("div");
    div.classList.add("cart-item");
    /* Note: put item.id in quotes so string ids also work */
    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-info">
        <h4>${item.title}</h4>
      </div>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="changeQty('${item.id}','dec')">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" onclick="changeQty('${item.id}','inc')">+</button>
        <p>${item.quantity} X <strong>$${(Number(item.price) * Number(item.quantity)).toFixed(2)}</strong></p>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });

  productsTotalEl.textContent = productsTotal.toFixed(2);
  const shipEl = document.getElementById("shipping");
  if (shipEl) shipEl.textContent = shippingCost;
  totalAmountEl.textContent = (productsTotal + shippingCost).toFixed(2);
  itemCountEl.textContent = totalItems;
  cartCountEl.textContent = totalItems;
}

/* Change quantity — keeps same name and signature as your HTML onclicks */
function changeQty(id, type) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart = cart.map(item => {
    if (item.id == id) { // use == so '1' and 1 both match
      if (type === "inc") item.quantity = Number(item.quantity) + 1;
      else item.quantity = Number(item.quantity) - 1;
    }
    return item;
  })
  // remove any items that reached 0 or below
  .filter(item => Number(item.quantity) > 0);

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

/* initialize on page load */
document.addEventListener("DOMContentLoaded", loadCart);
