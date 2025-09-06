const db = require('../config/db');

exports.createProduct = async (req, res) => {
  const { title, description, category_id, price } = req.body;
  try {
    await db.query(
      'INSERT INTO products (title, description, category_id, price, image, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, category_id, price, req.file ? req.file.filename : 'placeholder.jpg', req.user]
    );
    res.json({ msg: 'Product added successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getProducts = async (req, res) => {
  const { search, category } = req.query;
  let sql = 'SELECT p.*, c.name as category FROM products p JOIN categories c ON p.category_id = c.id WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND p.title LIKE ?';
    params.push(`%${search}%`);
  }
  if (category) {
    sql += ' AND c.name = ?';
    params.push(category);
  }

  const [products] = await db.query(sql, params);
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const [product] = await db.query(
    'SELECT p.*, c.name as category FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
    [req.params.id]
  );
  res.json(product[0]);
};

exports.updateProduct = async (req, res) => {
  const { title, description, category_id, price } = req.body;
  try {
    await db.query(
      'UPDATE products SET title=?, description=?, category_id=?, price=? WHERE id=? AND user_id=?',
      [title, description, category_id, price, req.params.id, req.user]
    );
    res.json({ msg: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id=? AND user_id=?', [req.params.id, req.user]);
    res.json({ msg: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
