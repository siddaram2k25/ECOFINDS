// Products functionality - Updated to handle images
/*document.addEventListener('DOMContentLoaded', function() {
    // Initialize products if not exists
    if (!localStorage.getItem('products')) {
        const sampleProducts = [
            {
                id: '1',
                title: 'Vintage Denim Jacket',
                description: 'A classic vintage denim jacket in excellent condition. Perfect for casual outings.',
                price: 35.99,
                category: 'clothing',
                image: 'placeholder',
                sellerId: '1',
                date: '2023-05-15'
            },
            {
                id: '2',
                title: 'Wooden Coffee Table',
                description: 'Handcrafted wooden coffee table with a minimalist design. Great for small spaces.',
                price: 75.50,
                category: 'furniture',
                image: 'placeholder',
                sellerId: '2',
                date: '2023-06-20'
            }
        ];
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
    
    // Display products
    displayProducts();
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            displayProducts(this.value);
        });
    }
    
    // Category filter functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle active class
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter by category
            const category = this.getAttribute('data-category');
            displayProducts('', category);
        });
    });
    
    // Display product detail if on product detail page
    if (window.location.pathname.includes('product-detail.html')) {
        displayProductDetail();
    }
});

// Function to display products - Updated to handle images
function displayProducts(searchTerm = '', category = 'all') {
    const productsContainer = document.getElementById('productsContainer');
    const myListingsContainer = document.getElementById('myListingsContainer');
    
    if (!productsContainer && !myListingsContainer) return;
    
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    let filteredProducts = [...products];
    
    // Apply search filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Apply category filter
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => 
            product.category === category
        );
    }
    
    // Check if we're on my-listings page
    if (myListingsContainer) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            myListingsContainer.innerHTML = '<p>Please log in to view your listings.</p>';
            return;
        }
        
        // Filter products by current user
        filteredProducts = filteredProducts.filter(product => 
            product.sellerId === currentUser.id
        );
    }
    
    // Display products
    const container = productsContainer || myListingsContainer;
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<p class="text-center">No products found.</p>';
        return;
    }
    
    container.innerHTML = filteredProducts.map(product => {
        // Handle image display
        let imageHtml = '';
        if (product.image && product.image !== 'placeholder') {
            imageHtml = `<img src="${product.image}" alt="${product.title}" style="width: 100%; height: 200px; object-fit: cover;">`;
        } else {
            imageHtml = `
                <div class="product-img">
                    <i class="fas fa-image"></i>
                </div>
            `;
        }
        
        return `
            <div class="product-card">
                ${imageHtml}
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-category">${product.category}</p>
                    <div class="product-actions">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-block">View Details</a>
                        ${myListingsContainer ? `
                            <div class="mt-1">
                                <button class="btn btn-outline edit-product" data-id="${product.id}">Edit</button>
                                <button class="btn btn-accent delete-product" data-id="${product.id}">Delete</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners for edit and delete buttons
    if (myListingsContainer) {
        const editButtons = document.querySelectorAll('.edit-product');
        const deleteButtons = document.querySelectorAll('.delete-product');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                // For simplicity, we'll just alert
                alert('Edit functionality would open a form for product ' + productId);
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this product?')) {
                    // Get products from localStorage
                    const products = JSON.parse(localStorage.getItem('products')) || [];
                    
                    // Filter out the deleted product
                    const updatedProducts = products.filter(p => p.id !== productId);
                    
                    // Save to localStorage
                    localStorage.setItem('products', JSON.stringify(updatedProducts));
                    
                    // Refresh the display
                    displayProducts();
                }
            });
        });
    }
}

// Function to display product detail - Updated to handle images
function displayProductDetail() {
    const productDetailContainer = document.getElementById('productDetail');
    if (!productDetailContainer) return;
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        productDetailContainer.innerHTML = '<p>Product not found.</p>';
        return;
    }
    
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        productDetailContainer.innerHTML = '<p>Product not found.</p>';
        return;
    }
    
    // Handle image display
    let imageHtml = '';
    if (product.image && product.image !== 'placeholder') {
        imageHtml = `<img src="${product.image}" alt="${product.title}" style="width: 100%; height: 400px; object-fit: cover;">`;
    } else {
        imageHtml = `
            <div class="product-detail-img">
                <i class="fas fa-image"></i>
            </div>
        `;
    }
    
    // Display product detail
    productDetailContainer.innerHTML = `
        <div class="product-detail">
            ${imageHtml}
            <div class="product-detail-info">
                <h1 class="product-detail-title">${product.title}</h1>
                <p class="product-detail-price">$${product.price.toFixed(2)}</p>
                <span class="product-detail-category">${product.category}</span>
                <p class="product-detail-description">${product.description}</p>
                <button class="btn btn-accent add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
    
    // Add to cart functionality
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Please log in to add items to your cart.');
                window.location.href = 'login.html';
                return;
            }
            
            // Get cart from localStorage or initialize
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.productId === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    productId: product.id,
                    quantity: 1,
                    addedDate: new Date().toISOString()
                });
            }
            
            // Save to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            alert('Product added to cart!');
        });
    }
}
*/document.addEventListener('DOMContentLoaded', function() {
    loadProducts();

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            loadProducts(this.value);
        });
    }

    // Category filter functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            loadProducts('', category);
        });
    });

    // Display product detail if on product detail page
    if (window.location.pathname.includes('product-detail.html')) {
        displayProductDetail();
    }
});

// Load products from backend
async function loadProducts(searchTerm = '', category = 'all') {
    const productsContainer = document.getElementById('productsContainer');
    const myListingsContainer = document.getElementById('myListingsContainer');
    if (!productsContainer && !myListingsContainer) return;

    let url = '/api/products';
    const params = [];
    if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
    if (category && category !== 'all') params.push(`category=${encodeURIComponent(category)}`);
    if (params.length) url += '?' + params.join('&');

    const res = await fetch(url);
    let products = await res.json();

    // If on my-listings page, filter by current user
    if (myListingsContainer) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            myListingsContainer.innerHTML = '<p>Please log in to view your listings.</p>';
            return;
        }
        products = products.filter(product => product.user_id === currentUser.id);
    }

    const container = productsContainer || myListingsContainer;
    if (!products.length) {
        container.innerHTML = '<p class="text-center">No products found.</p>';
        return;
    }

    container.innerHTML = products.map(product => {
        let imageHtml = product.image_url
            ? `<img src="${product.image_url}" alt="${product.title}" style="width: 100%; height: 200px; object-fit: cover;">`
            : `<div class="product-img"><i class="fas fa-image"></i></div>`;
        return `
            <div class="product-card">
                ${imageHtml}
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-category">${product.category_id}</p>
                    <div class="product-actions">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-block">View Details</a>
                        ${myListingsContainer ? `
                            <div class="mt-1">
                                <button class="btn btn-outline edit-product" data-id="${product.id}">Edit</button>
                                <button class="btn btn-accent delete-product" data-id="${product.id}">Delete</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Edit/Delete event listeners (for my listings)
    if (myListingsContainer) {
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', function() {
                alert('Edit functionality would open a form for product ' + this.getAttribute('data-id'));
            });
        });
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', async function() {
                if (confirm('Are you sure you want to delete this product?')) {
                    await fetch(`/api/products/${this.getAttribute('data-id')}`, { method: 'DELETE' });
                    loadProducts();
                }
            });
        });
    }
}

// Product detail page
async function displayProductDetail() {
    const productDetailContainer = document.getElementById('productDetail');
    if (!productDetailContainer) return;
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) {
        productDetailContainer.innerHTML = '<p>Product not found.</p>';
        return;
    }
    const res = await fetch(`/api/products/${productId}`);
    const product = await res.json();
    if (!product) {
        productDetailContainer.innerHTML = '<p>Product not found.</p>';
        return;
    }
    let imageHtml = product.image_url
        ? `<img src="${product.image_url}" alt="${product.title}" style="width: 100%; height: 400px; object-fit: cover;">`
        : `<div class="product-detail-img"><i class="fas fa-image"></i></div>`;
    productDetailContainer.innerHTML = `
        <div class="product-detail">
            ${imageHtml}
            <div class="product-detail-info">
                <h1 class="product-detail-title">${product.title}</h1>
                <p class="product-detail-price">$${product.price.toFixed(2)}</p>
                <span class="product-detail-category">${product.category_id}</span>
                <p class="product-detail-description">${product.description}</p>
                <button class="btn btn-accent add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Please log in to add items to your cart.');
                window.location.href = 'login.html';
                return;
            }
            await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: currentUser.id, product_id: product.id, quantity: 1 })
            });
            alert('Product added to cart!');
        });
    }
}