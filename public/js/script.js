console.log("JS Connected!");

// Function to add item to cart
async function addToCart(productId, itemName, itemPrice) {
    const quantity = 1; // You can adjust this if needed

    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }),
        });

        if (!response.ok) {
            throw new Error(`Error adding item to cart: ${response.statusText}`);
        }

        // Update UI or show a success message
        console.log('Item added to cart successfully');
    } catch (error) {
        console.error('Error adding item to cart:', error);
    }
}

// Function to fetch cart items and update UI
async function fetchCartItems() {
    try {
        const response = await fetch('/api/cart');

        if (!response.ok) {
            throw new Error('Error fetching cart items');
        }

        const cartItems = await response.json();
        // Update UI with cart items
        console.log('Cart Items:', cartItems);
    } catch (error) {
        console.error('Error:', error);
    }
}


// Function to set up buttons
function setupButtons() {
    // Select all buttons with the class 'add-to-cart-btn' and attach a click event listener
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            const itemName = button.getAttribute('data-item-name');
            const itemPrice = button.getAttribute('data-item-price');
            addToCart(productId, itemName, itemPrice);
        });
    });
}

// Function to toggle the cart visibility
function toggleCart() {
    const cartTab = document.querySelector('.cartTab');
    cartTab.classList.toggle('showCart');
}

// Call the fetchCartItems function and setup the Add to Cart buttons
// once the DOM content has been fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }

    // Set up other things, such as add-to-cart buttons
    setupButtons();
    fetchCartItems();
});

// Export the functions that need to be accessible from other scripts
export { addToCart, fetchCartItems };

document.getElementById('loginForm').onsubmit = async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        // Send login information to server
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        // Check if the response is ok (status 200-299)
        if (response.ok) {
            // Login successful
            closeModal(); // Close the login modal
            console.log('Login Success');
            // Optionally perform additional actions, such as redirecting to another page
        } else {
            // Login failed
            const errorData = await response.json();
            console.error('Login Error:', errorData.error);
            // Display error message to the user (e.g., near the login form)
            // Example: document.getElementById('loginError').innerText = errorData.error;
        }
    } catch (error) {
        // Error while communicating with the server
        console.error('Login Error:', error);
        // Display a generic error message to the user
        // Example: document.getElementById('loginError').innerText = 'An error occurred. Please try again later.';
    }
};