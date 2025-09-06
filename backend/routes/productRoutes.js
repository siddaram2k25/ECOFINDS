const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.post('/', auth, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
