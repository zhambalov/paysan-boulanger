console.log("JS Connected!");

let globalUserId = null;

async function addToCart(productId, quantity) {
    if (!globalUserId) {
        console.error('User is not logged in.');
        return;
    }

    try {
        const requestBody = {
            userId: globalUserId,
            productId: productId,
            quantity: quantity
        };

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

        console.log('Item added to cart');
        await fetchCartItems(); 

    } catch (error) {
        console.error('Error:', error);
    }
}

function setupButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-product-id');

            const quantity = 1;
            addToCart(productId, quantity);
        });
    });
}

document.getElementById('checkoutButton').addEventListener('click', async () => {
    if (!globalUserId) {
        alert('You must be logged in to complete the order.');
        return;
    }

    try {
        const response = await fetch('/api/cart/complete-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: globalUserId })
        });

        if (response.ok) {
            console.log('Order completed successfully');

            document.querySelector('.cartItems').innerHTML = '';

            document.querySelector('.totalPrice').textContent = '$0.00';

            document.getElementById('successMessage').innerText = 'Order completed successfully!';
        } else {
            throw new Error('Failed to complete order');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


async function fetchCartItems() {
    if (!globalUserId) {
        console.error('User is not logged in.');
        return;
    }
    try {
        const response = await fetch(`/api/cart?userId=${globalUserId}`);
        if (!response.ok) {
            throw new Error('Error fetching cart items');
        }
        const cartItems = await response.json();
        const cartItemsContainer = document.querySelector('.cartItems');
        cartItemsContainer.innerHTML = ''; 

        let total = 0;
        cartItems.forEach(item => {
            total += item.QUANTITY * item.PRICE; 

            const listItem = document.createElement('li');
            listItem.textContent = `${item.NAME}, Quantity: ${item.QUANTITY}`;
            cartItemsContainer.appendChild(listItem);
        });

        total = 0;
        cartItems.forEach(item => {
            total += item.QUANTITY * item.PRICE; 
        });

        document.querySelector('.totalPrice').textContent = `$${total.toFixed(2)}`;

    } catch (error) {
        console.error('Error:', error);
    }
};

function toggleCart() {
    const cartTab = document.querySelector('.cartTab');
    cartTab.classList.toggle('hidden');
}

document.querySelector('.close').addEventListener('click', toggleCart);

document.getElementById('cartIcon').addEventListener('click', toggleCart);

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            globalUserId = data.userId;
            closeModal();
            console.log('Login Success');
        } else {
            const errorData = await response.json();
            console.error('Login Error:', errorData.error);

        }
    } catch (error) {
        console.error('Login Error:', error);
    }
});

function closeModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}


document.addEventListener('DOMContentLoaded', () => {
    setupButtons();
    fetchCartItems();
});

