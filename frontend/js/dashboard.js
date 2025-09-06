// Dashboard functionality - Fix for previous My orders display
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Populate profile form using API
    (async function() {
        const userProfile = await fetchUserProfile(currentUser.id);
        if (userProfile) {
            document.getElementById('username').value = userProfile.username || '';
            document.getElementById('email').value = userProfile.email || '';
            document.getElementById('bio').value = userProfile.bio || '';
            document.getElementById('location').value = userProfile.location || '';
        }
    })();

    // Update profile form handling
    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form values
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const bio = document.getElementById('bio').value;
            const location = document.getElementById('location').value;

            try {
                const response = await fetch(`/api/users/${currentUser.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, bio, location })
                });
                if (!response.ok) throw new Error('Failed to update profile');
                const updatedUser = await response.json();
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                alert('Profile updated successfully!');
            } catch (error) {
                alert('Error updating profile.');
                console.error(error);
            }
        });

        // Display previous orders
        displayPreviousOrders();
    }
});

// Function to fetch user profile from API
async function fetchUserProfile(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user profile');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Function to fetch orders from API
async function fetchUserOrders(userId) {
    try {
        const response = await fetch(`/api/orders?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Function to display previous orders
async function displayPreviousOrders() {
    const ordersContainer = document.getElementById('ordersContainer');
    if (!ordersContainer) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        ordersContainer.innerHTML = '<p class="text-center">User not found.</p>';
        return;
    }

    const userOrders = await fetchUserOrders(currentUser.id);

    if (userOrders.length === 0) {
        ordersContainer.innerHTML = '<p class="text-center">You have no previous orders.</p>';
        return;
    }

    // Sort orders by date (newest first)
    userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    let html = '';

    userOrders.forEach(order => {
        const orderDate = new Date(order.date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let orderTotal = 0;

        const itemsHtml = order.items.map(item => {
            const itemTotal = item.price * item.quantity;
            orderTotal += itemTotal;

            return `
                <div class="cart-item">
                    <div class="cart-item-img">
                        <i class="fas fa-image"></i>
                    </div>
                    <div class="cart-item-info">
                        <h3 class="cart-item-title">${item.title}</h3>
                        <p class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</p>
                        <p class="cart-item-total">Item Total: $${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
            `;
        }).join('');

        html += `
            <div class="purchase-card" style="background: white; border-radius: 10px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div class="purchase-header" style="border-bottom: 1px solid #eee; padding-bottom: 1rem; margin-bottom: 1rem;">
                    <h3>Order #${order.id.substring(0, 8)}</h3>
                    <p><strong>Date:</strong> ${orderDate}</p>
                    <p><strong>Status:</strong> <span style="color: #2E8B57;">${order.status}</span></p>
                </div>
                ${itemsHtml}
                <div class="purchase-total" style="border-top: 1px solid #eee; padding-top: 1rem; margin-top: 1rem; text-align: right;">
                    <p style="font-weight: bold; font-size: 1.2rem;">Order Total: $${orderTotal.toFixed(2)}</p>
                </div>
            </div>
        `;
    });

    ordersContainer.innerHTML = html;
}   
// Remove erroneous line and closing brace