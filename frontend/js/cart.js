// Cart functionality - Fixed checkout process with API calls
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Please log in to checkout.');
                window.location.href = 'login.html';
                return;
            }

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Your cart is empty.');
                return;
            }

            // Get products from localStorage
            const products = JSON.parse(localStorage.getItem('products')) || [];

            // Create order payload
            const order = {
                userId: currentUser.id,
                items: cart.map(item => {
                    const product = products.find(p => p.id === item.productId);
                    return {
                        productId: item.productId,
                        title: product ? product.title : 'Unknown Product',
                        price: product ? product.price : 0,
                        quantity: item.quantity,
                        image: product ? product.image : 'placeholder'
                    };
                }),
                date: new Date().toISOString(),
                status: 'completed',
                total: cart.reduce((total, item) => {
                    const product = products.find(p => p.id === item.productId);
                    return total + (product ? product.price * item.quantity : 0);
                }, 0)
            };

            try {
                // Send order to API
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order)
                });

                if (!response.ok) {
                    throw new Error('Failed to place order.');
                }

                // Clear cart
                localStorage.removeItem('cart');

                // Show success message and redirect to My Orders
                alert('Order placed successfully! You can view your order in My Orders.');
                window.location.href = 'my-orders.html';
            } catch (error) {
                alert('Error placing order: ' + error.message);
            }
        });
    }
});

// Function to display cart items
async function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalContainer = document.getElementById('cartTotal');

    if (!cartItemsContainer) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        if (cartTotalContainer) cartTotalContainer.classList.add('hidden');
        return;
    }

    // Fetch products from API
    let products = [];
    try {
        const response = await fetch('/api/products');
        if (response.ok) {
            products = await response.json();
            localStorage.setItem('products', JSON.stringify(products)); // Optionally cache
        } else {
            products = JSON.parse(localStorage.getItem('products')) || [];
        }
    } catch {
        products = JSON.parse(localStorage.getItem('products')) || [];
    }

    let total = 0;
    let html = '';

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            const itemTotal = product.price * item.quantity;
            total += itemTotal;

            // Handle image display
            let imageHtml = '';
            if (product.image && product.image !== 'placeholder') {
                imageHtml = `<img src="${product.image}" alt="${product.title}" style="width: 100%; height: 120px; object-fit: cover;">`;
            } else {
                imageHtml = `
                    <div class="cart-item-img">
                        <i class="fas fa-image"></i>
                    </div>
                `;
            }

            html += `
                <div class="cart-item">
                    ${imageHtml}
                    <div class="cart-item-info">
                        <h3 class="cart-item-title">${product.title}</h3>
                        <p class="cart-item-price">$${product.price.toFixed(2)}</p>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn decrease-quantity" data-id="${product.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn increase-quantity" data-id="${product.id}">+</button>
                            </div>
                            <button class="btn btn-accent remove-from-cart" data-id="${product.id}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    cartItemsContainer.innerHTML = html;

    // Display total
    if (cartTotalContainer) {
        cartTotalContainer.classList.remove('hidden');
        document.getElementById('subtotal').textContent = `$${total.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    // Add event listeners
    const decreaseButtons = document.querySelectorAll('.decrease-quantity');
    const increaseButtons = document.querySelectorAll('.increase-quantity');
    const removeButtons = document.querySelectorAll('.remove-from-cart');

    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            updateCartItemQuantity(productId, -1);
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            updateCartItemQuantity(productId, 1);
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeCartItem(productId);
        });
    });
}

// Function to update cart item quantity
function updateCartItemQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.productId === productId);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;

        // Remove item if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Optionally, send update to API
        fetch(`/api/cart`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cart)
        }).catch(() => {});

        // Refresh display
        displayCartItems();
    }
}

// Function to remove cart item
function removeCartItem(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter(item => item.productId !== productId);

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Optionally, send update to API
    fetch(`/api/cart`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCart)
    }).catch(() => {});

    // Refresh display
    displayCartItems();
}