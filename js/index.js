// Initialize an empty array to store cart items
let cartItems = [];

// Function to add items to the cart
function addToCart(itemId, itemName, itemPrice) {
    // Create a new object representing the item
    const newItem = {
        id: itemId,
        name: itemName,
        price: itemPrice
    };

    // Add the item to the cartItems array
    cartItems.push(newItem);

    // Update the cart display
    updateCartDisplay();
}

// Function to update the cart display
function updateCartDisplay() {
    const cartList = document.getElementById('cart-items');

    // Clear previous items from the list
    cartList.innerHTML = '';

    // Loop through each item in the cart and add it to the list
    cartItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        cartList.appendChild(listItem);
    });
}

// Function to toggle the cart visibility
function toggleCart() {
    const cartTab = document.querySelector('.cartTab');
    document.body.classList.toggle('showCart');
}
