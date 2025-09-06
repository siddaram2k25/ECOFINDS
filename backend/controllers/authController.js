const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword]);
    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) return res.status(400).json({ msg: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user[0].password);
    if (!valid) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user[0].id, username: user[0].username, email: user[0].email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
