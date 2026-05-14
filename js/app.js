// Main Application Controller

// Render restaurants with cards
function renderRestaurants(filterText = "") {
  const container = document.getElementById('restaurantsContainer');
  let filtered = restaurantsData.filter(r => 
    r.name.toLowerCase().includes(filterText.toLowerCase()) || 
    r.cuisine.toLowerCase().includes(filterText.toLowerCase())
  );
  
  if (!container) return;
  container.innerHTML = '';
  
  filtered.forEach(rest => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    
    let itemsHtml = `<div class="mt-3"><strong class="small">Menu:</strong><ul class="list-unstyled mt-2">`;
    rest.items.forEach(item => {
      itemsHtml += `
        <li class="d-flex justify-content-between align-items-center mb-2">
          <span>
            ${item.name} 
            <span class="text-muted">$${item.price.toFixed(2)}</span>
            ${item.popularity ? `<small class="text-warning ms-1"><i class="fas fa-star"></i> ${item.popularity}%</small>` : ''}
          </span>
          <button class="btn btn-sm btn-primary-custom rounded-pill addItemBtn" 
                  data-rest='${JSON.stringify(rest)}' 
                  data-item='${JSON.stringify(item)}'>
            Add
          </button>
        </li>
      `;
    });
    itemsHtml += `</ul></div>`;
    
    col.innerHTML = `
      <div class="card card-restaurant h-100">
        <img src="${rest.image}" class="resto-img" alt="${rest.name}" loading="lazy">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <h5 class="card-title fw-bold">${rest.name}</h5>
            <span class="badge-ai"><i class="fas fa-fire"></i> Popular</span>
          </div>
          <p class="card-text text-muted small">
            <i class="fas fa-utensils"></i> ${rest.cuisine}
          </p>
          ${itemsHtml}
        </div>
      </div>
    `;
    container.appendChild(col);
  });
  
  // Attach event listeners for Add buttons
  document.querySelectorAll('.addItemBtn').forEach(btn => {
    btn.removeEventListener('click', handleAddToCart);
    btn.addEventListener('click', handleAddToCart);
  });
}

function handleAddToCart(e) {
  const restData = JSON.parse(e.currentTarget.getAttribute('data-rest'));
  const itemData = JSON.parse(e.currentTarget.getAttribute('data-item'));
  addToCart(restData, itemData);
}

// Cart sidebar functions
function openCart() {
  document.getElementById('cartSidebar').classList.add('cart-open');
  document.getElementById('cartOverlay').classList.add('show');
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('cart-open');
  document.getElementById('cartOverlay').classList.remove('show');
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  // Render initial data
  renderRestaurants();
  loadCart();
  
  // Search functionality
  const searchInput = document.getElementById('searchResto');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => renderRestaurants(e.target.value));
  }
  
  // Cart events
  document.getElementById('cartIconBtn')?.addEventListener('click', openCart);
  document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  
  // Explore button
  document.getElementById('exploreBtn')?.addEventListener('click', () => {
    document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' });
  });
  
  // AI Recommendation buttons
  document.getElementById('aiRecommendHeroBtn')?.addEventListener('click', displayAIRecommendation);
  document.getElementById('smartAIRecommendBtn')?.addEventListener('click', displayAIRecommendation);
  
  // Clear AI suggestion
  document.getElementById('clearSuggestionBtn')?.addEventListener('click', () => {
    document.getElementById('aiSuggestionResult').style.display = 'none';
  });
  
  // Checkout
  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast("Your cart is empty! Add some delicious food first.");
    } else {
      alert("✅ Order placed successfully! AI will optimize your delivery route.\nThank you for using QuickBite AI.");
      clearCart();
      closeCart();
      showToast("🎉 Order confirmed! Enjoy your meal.");
    }
  });
});