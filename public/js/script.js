console.log("JS Connected!");

// Make sure this function is defined
function closeModal() {
  document.getElementById('loginModal').style.display = 'none';
}

async function addToCart(productId, quantity) {
    try {
        // Construct the request body
        const requestBody = {
            productId: productId,
            quantity: quantity
        };

        // Make a fetch request to add the item to the cart
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Failed to add item to cart');
        }

        // Handle success response here

    } catch (error) {
        console.error('Error:', error);
        // Handle error
    }
}

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

  function setupButtons() {
    // Select all buttons with the class 'add-to-cart-btn' and attach a click event listener
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');
            const quantity = button.getAttribute('data-quantity'); // Get quantity from data attribute
            const itemName = button.getAttribute('data-item-name');
            const itemPrice = button.getAttribute('data-item-price');
            addToCart(productId, quantity);
        });
    });
  }

// Toggle cart visibility
function toggleCart() {
  document.body.classList.toggle('showCart');
}

// Event listener for cart icon
document.getElementById('cartIcon').addEventListener('click', toggleCart);

// Event listener for login form submission
document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  console.log('Attempting to log in with:', { username, password });
  try { 
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      closeModal();
      console.log('Login Success');
      // Redirect or update UI after successful login
    } else {
      if (response.headers.get("Content-Type").includes("application/json")) {
        const errorData = await response.json();
        console.error('Login Error:', errorData.error);
        // Display error message on the page
      } else {
        console.error('Login Error:', response.statusText);
        // Display error message on the page
      }
    }
  } catch (error) {
    console.error('Login Error:', error);
    // Display error message on the page
  }
});

setupButtons();