const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Explicit path

const app = express();

// Debug: Check if env variables are loaded
console.log('All env vars:', process.env);
console.log('DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
console.log('DB_NAME:', process.env.DB_NAME || 'NOT SET');

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = require('./config/db');

// Test Route
app.get('/', (req, res) => {
  res.send('EcoFinds Backend is Running ✅');
});

// Routes
const productRoutes = require('./routes/productRoutes'); // ✅ FIXED import
app.use('/api/products', productRoutes); // ✅ Use API prefix

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Temporary in-memory cart storage (replace with database later)
let cart = [];

// Add to cart route
app.post('/api/cart/add', (req, res) => {
  const product = req.body;
  
  // Check if product already in cart
  const existingProduct = cart.find(item => item.id === product.id);
  
  if (existingProduct) {
    existingProduct.quantity += product.quantity || 1;
  } else {
    cart.push({
      ...product,
      quantity: product.quantity || 1
    });
  }
  
  res.json({ message: 'Product added to cart', cart });
});

// Get cart items
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

// Update cart item quantity
app.put('/api/cart/update/:id', (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  
  const product = cart.find(item => item.id === parseInt(id));
  if (product) {
    product.quantity = quantity;
    res.json({ message: 'Cart updated', cart });
  } else {
    res.status(404).json({ error: 'Product not found in cart' });
  }
});

// Remove from cart
app.delete('/api/cart/remove/:id', (req, res) => {
  const { id } = req.params;
  cart = cart.filter(item => item.id !== parseInt(id));
  res.json({ message: 'Product removed from cart', cart });
});

// Clear cart
app.delete('/api/cart/clear', (req, res) => {
  cart = [];
  res.json({ message: 'Cart cleared', cart });
});
const sampleProducts = require('./sample-products');

// Get sample products
app.get('/api/products', (req, res) => {
  res.json(sampleProducts);
});