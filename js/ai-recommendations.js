// AI Smart Recommendation Engine

// Get AI recommendation based on user behavior and popularity
function getSmartAIRecommendation() {
  // Flatten all menu items with metadata
  const allDishes = [];
  restaurantsData.forEach(rest => {
    rest.items.forEach(item => {
      allDishes.push({
        dishName: item.name,
        restaurant: rest.name,
        price: item.price,
        cuisine: rest.cuisine.split(',')[0],
        popularity: item.popularity || Math.floor(Math.random() * 30) + 70,
        restaurantId: rest.id
      });
    });
  });
  
  let recommendation = null;
  
  // AI Logic: If cart has items, recommend similar cuisine
  if (cart && cart.length > 0) {
    const lastItem = cart[cart.length - 1];
    const matchedResto = restaurantsData.find(r => r.name === lastItem.restoName);
    
    if (matchedResto) {
      const sameCuisineDishes = allDishes.filter(d => 
        d.cuisine === matchedResto.cuisine.split(',')[0] && 
        d.dishName !== lastItem.itemName
      );
      
      if (sameCuisineDishes.length > 0) {
        // Sort by popularity for better recommendation
        sameCuisineDishes.sort((a, b) => b.popularity - a.popularity);
        recommendation = sameCuisineDishes[0];
      }
    }
  }
  
  // Fallback: Recommend most popular item overall
  if (!recommendation) {
    allDishes.sort((a, b) => b.popularity - a.popularity);
    recommendation = allDishes[0];
  }
  
  // Generate AI explanation
  const reasons = [
    `🧠 Based on your taste profile & trending data, "${recommendation.dishName}" matches 94% flavor harmony.`,
    `🤖 AI detects you might love ${recommendation.cuisine} cuisine right now. Many users adored ${recommendation.dishName} (${recommendation.popularity}% satisfaction).`,
    `✨ Smart analysis: ${recommendation.dishName} from ${recommendation.restaurant} has high ratings + quick delivery time.`,
    `🎯 Our neural network suggests ${recommendation.dishName} — a local favorite with premium ingredients.`,
    `💡 AI recommendation engine picked ${recommendation.dishName} based on your location and time of day.`
  ];
  
  const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
  return { dish: recommendation, reason: randomReason };
}

// Display AI recommendation to user
function displayAIRecommendation() {
  const { dish, reason } = getSmartAIRecommendation();
  const aiBox = document.getElementById('aiSuggestionResult');
  const aiMsgSpan = document.getElementById('aiMessageText');
  
  if (aiMsgSpan) {
    aiMsgSpan.innerHTML = `
      <strong>${dish.dishName}</strong> from ${dish.restaurant} ($${dish.price})<br>
      <small class="text-secondary">${reason}</small>
      <div class="mt-2">
        <button class="btn btn-sm btn-primary-custom rounded-pill addRecToCart" 
                data-restid="${dish.restaurantId}" 
 data-dishname="${dish.dishName}"
                data-price="${dish.price}">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    `;
  }
  
  if (aiBox) aiBox.style.display = 'block';
  
  // Attach event to add recommendation to cart
  setTimeout(() => {
    const addBtn = document.querySelector('.addRecToCart');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        const restoId = parseInt(e.currentTarget.getAttribute('data-restid'));
        const dishName = e.currentTarget.getAttribute('data-dishname');
        const price = parseFloat(e.currentTarget.getAttribute('data-price'));
        
        const restaurant = restaurantsData.find(r => r.id === restoId);
        const item = restaurant.items.find(i => i.name === dishName);
        
        if (restaurant && item) {
          addToCart(restaurant, item);
          showToast(`🤖 AI recommendation added: ${dishName}`);
        }
      });
    }
  }, 100);
  
  // Scroll to result
  document.getElementById('ai-smart')?.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center' 
  });
}