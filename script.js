// Cart functionality
let cart = [];
let cartTotal = 0;

// DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }

    // Cart modal functionality
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    
    if (cartIcon && cartModal && closeCart) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartModal.style.display = 'block';
        });
        
        closeCart.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
        
        // Close when clicking outside of modal
        window.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (name && email && subject && message) {
                // In a real app, you would send this data to a server
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showNotification('Please fill in all fields', 'error');
            }
        });
    }

    // Initialize product price selects
    updateProductPrice(1);
    updateProductPrice(2);
});

// Add to cart function from product cards
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification(`${productName} added to cart!`, 'success');
}

// Add calculated items to cart
function addCalculatedItemsToCart() {
    // Product 1
    const product1Select = document.getElementById('product1Select');
    const quantity1 = parseInt(document.getElementById('quantity1').value);
    
    if (product1Select.selectedIndex > 0 && quantity1 > 0) {
        const productName = product1Select.options[product1Select.selectedIndex].text.split(' ($')[0];
        const price = parseFloat(product1Select.value);
        
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += quantity1;
        } else {
            cart.push({
                name: productName,
                price: price,
                quantity: quantity1
            });
        }
    }
    
    // Product 2
    const product2Select = document.getElementById('product2Select');
    const quantity2 = parseInt(document.getElementById('quantity2').value);
    
    if (product2Select.selectedIndex > 0 && quantity2 > 0) {
        const productName = product2Select.options[product2Select.selectedIndex].text.split(' ($')[0];
        const price = parseFloat(product2Select.value);
        
        const existingItem = cart.find(item => item.name === productName);
        
        if (existingItem) {
            existingItem.quantity += quantity2;
        } else {
            cart.push({
                name: productName,
                price: price,
                quantity: quantity2
            });
        }
    }
    
    updateCartUI();
    showNotification('Items added to cart!', 'success');
    
    // Reset calculator
    document.getElementById('product1Select').selectedIndex = 0;
    document.getElementById('product2Select').selectedIndex = 0;
    document.getElementById('quantity1').value = 0;
    document.getElementById('quantity2').value = 0;
    document.getElementById('product1').value = 0;
    document.getElementById('product2').value = 0;
    calculateTotal();
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Calculate total quantity and price
    let totalQuantity = 0;
    let totalPrice = 0;
    
    cart.forEach(item => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
    });
    
    // Update cart count
    cartCount.textContent = totalQuantity;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        checkoutBtn.disabled = true;
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            
            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-item-btn" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        checkoutBtn.disabled = false;
    }
    
    // Update cart total
    cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Remove item from cart
function removeFromCart(index) {
    const removedItem = cart[index];
    cart.splice(index, 1);
    updateCartUI();
    showNotification(`${removedItem.name} removed from cart!`, 'info');
}

// Process checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // In a real app, you would redirect to checkout page or process payment
    showNotification('Proceeding to checkout...', 'success');
    
    // Clear cart
    cart = [];
    updateCartUI();
}

// Calculator functions
function updateProductPrice(num) {
    const select = document.getElementById(`product${num}Select`);
    const priceInput = document.getElementById(`product${num}`);
    
    if (select && priceInput) {
        priceInput.value = select.value || 0;
        calculateTotal();
    }
}

function incrementQuantity(num) {
    const quantityInput = document.getElementById(`quantity${num}`);
    
    if (quantityInput) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
        calculateTotal();
    }
}

function decrementQuantity(num) {
    const quantityInput = document.getElementById(`quantity${num}`);
    
    if (quantityInput && parseInt(quantityInput.value) > 0) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
        calculateTotal();
    }
}

function calculateTotal() {
    // Product 1
    const price1 = parseFloat(document.getElementById('product1').value) || 0;
    const quantity1 = parseInt(document.getElementById('quantity1').value) || 0;
    
    // Product 2
    const price2 = parseFloat(document.getElementById('product2').value) || 0;
    const quantity2 = parseInt(document.getElementById('quantity2').value) || 0;
    
    // Calculate total
    const total = (price1 * quantity1) + (price2 * quantity2);
    
    // Update UI
    document.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;
    
    // Enable/disable add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (addToCartBtn) {
        addToCartBtn.disabled = total <= 0;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    
    let icon;
    switch (type) {
        case 'success':
            icon = 'fas fa-check-circle';
            break;
        case 'error':
            icon = 'fas fa-exclamation-circle';
            break;
        default:
            icon = 'fas fa-info-circle';
    }
    
    notification.innerHTML = `
        <i class="${icon}"></i>
        <p>${message}</p>
    `;
    
    container.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            container.removeChild(notification);
        }, 500);
    }, 3000);
}

// Checkout button event
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});