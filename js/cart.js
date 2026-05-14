// Cart Management Module
let cart = [];

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('quickbite_cart', JSON.stringify(cart));
  updateCartUI();
}

// Load cart from localStorage
function loadCart() {
  const saved = localStorage.getItem('quickbite_cart');
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch(e) { 
      cart = []; 
    }
  } else {
    cart = [];
  }
  updateCartUI();
}

// Update cart display
function updateCartUI() {
  const cartItemsDiv = document.getElementById('cartItemsList');
  const totalSpan = document.getElementById('cartTotalPrice');
  const countBadge = document.getElementById('cartCountBadge');
  let total = 0;
  let itemCount = 0;
  
  if (!cartItemsDiv) return;
  
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `<div class="text-center text-muted py-5">
      <i class="fas fa-shopping-basket fa-3x mb-2"></i>
      <p>Your cart is empty. Add delicious items!</p>
    </div>`;
    totalSpan.innerText = `$0.00`;
    if(countBadge) countBadge.innerText = '0';
    return;
  }
  
  let html = '';
  cart.forEach((item, idx) => {
    total += item.price * item.quantity;
    itemCount += item.quantity;
    html += `
      <div class="card mb-2 border-0 shadow-sm rounded-4 p-2">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-0 fw-bold">${item.itemName}</h6>
            <small class="text-muted">${item.restoName}</small>
            <div class="mt-1">
              <span class="fw-semibold">$${item.price.toFixed(2)}</span> x ${item.quantity}
            </div>
          </div>
          <div class="d-flex gap-2 align-items-center">
            <button class="btn btn-sm btn-outline-secondary rounded-circle incQtyBtn" data-idx="${idx}">
              <i class="fas fa-plus"></i>
            </button>
            <span class="fw-bold">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-danger rounded-circle decQtyBtn" data-idx="${idx}">
              <i class="fas fa-minus"></i>
            </button>
            <button class="btn btn-sm text-danger removeItemBtn" data-idx="${idx}">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  cartItemsDiv.innerHTML = html;
  totalSpan.innerText = `$${total.toFixed(2)}`;
  if(countBadge) countBadge.innerText = itemCount;
  
  // Attach cart item event listeners
  attachCartItemEvents();
}

// Attach events to cart item buttons
function attachCartItemEvents() {
  document.querySelectorAll('.incQtyBtn').forEach(btn => {
    btn.removeEventListener('click', handleIncQty);
    btn.addEventListener('click', handleIncQty);
  });
  
  document.querySelectorAll('.decQtyBtn').forEach(btn => {
    btn.removeEventListener('click', handleDecQty);
    btn.addEventListener('click', handleDecQty);
  });
  
  document.querySelectorAll('.removeItemBtn').forEach(btn => {
    btn.removeEventListener('click', handleRemoveItem);
    btn.addEventListener('click', handleRemoveItem);
  });
}

function handleIncQty(e) {
  let idx = e.currentTarget.getAttribute('data-idx');
  if (idx !== null && cart[idx]) {
    cart[idx].quantity += 1;
    saveCart();
  }
}

function handleDecQty(e) {
  let idx = e.currentTarget.getAttribute('data-idx');
  if (idx !== null && cart[idx]) {
    if (cart[idx].quantity > 1) {
      cart[idx].quantity -= 1;
    } else {
      cart.splice(idx, 1);
    }
    saveCart();
  }
}

function handleRemoveItem(e) {
  let idx = e.currentTarget.getAttribute('data-idx');
  if (idx !== null) {
    cart.splice(idx, 1);
    saveCart();
  }
}

// Add item to cart
function addToCart(restaurant, itemObj) {
  const existingIndex = cart.findIndex(
    cartItem => cartItem.restoId === restaurant.id && cartItem.itemName === itemObj.name
  );
  
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      restoId: restaurant.id,
      restoName: restaurant.name,
      itemName: itemObj.name,
      price: itemObj.price,
      quantity: 1
    });
  }
  saveCart();
  showToast(`🍕 ${itemObj.name} added to cart!`);
}

// Show toast notification
function showToast(msg) {
  const toastEl = document.getElementById('liveToast');
  const msgSpan = document.getElementById('toastMsg');
  if (msgSpan) msgSpan.innerText = msg;
  const bsToast = new bootstrap.Toast(toastEl, { delay: 1800 });
  bsToast.show();
}

// Clear cart
function clearCart() {
  cart = [];
  saveCart();
}