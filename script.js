// Initialize an empty cart or load from local storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add a product to the cart
function addToCart(productName) {
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name: productName, quantity: 1 });
    }

    updateCartCount();
    saveCart();
    showNotification(`${productName} has been added to your cart!`);
}

// Function to update the cart count display
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = cartCount;
}

// Function to save the cart to local storage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to display the cart items in a modal
function displayCart() {
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item.name} (Quantity: ${item.quantity})</span>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    cartModal.style.display = 'block'; // Show the modal
}

// Function to remove an item from the cart
function removeFromCart(index) {
    cart.splice(index, 1); // Remove the item from the cart
    updateCartCount();
    saveCart();
    displayCart(); // Refresh the cart display
}

// Function to close the cart modal
function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

// Function to show notifications
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event listener for the contact form submission
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    alert(`Thank you, ${name}! Your message has been sent.`);
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);
    this.reset();
});

// Add an event listener to the cart icon to display cart items
document.getElementById('cart-icon').addEventListener('click', displayCart);

// Add an event listener to close the cart modal
document.getElementById('close-cart').addEventListener('click', closeCart);

// Update cart count on page load
updateCartCount();

function calculateTotal() {
    const product1Price = parseFloat(document.getElementById('product1').value) || 0;
    const quantity1 = parseInt(document.getElementById('quantity1').value) || 0;
    
    const product2Price = parseFloat(document.getElementById('product2').value) || 0;
    const quantity2 = parseInt(document.getElementById('quantity2').value) || 0;

    const total = (product1Price * quantity1) + (product2Price * quantity2);
    
    document.getElementById('totalPrice').innerText = `Total Price: $${total.toFixed(2)}`;
}

document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', calculateTotal);
});