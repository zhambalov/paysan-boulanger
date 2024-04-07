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

// Function to toggle the cart visibility
function toggleCart() {
    const cartTab = document.querySelector('.cartTab');
    document.body.classList.toggle('showCart');
}

// Initial fetch of cart items when the page loads
fetchCartItems();
