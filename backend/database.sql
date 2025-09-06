-- === Fresh setup for Ecofinds ===
-- Paste this whole block into your MySQL client

-- 1) Create clean database
DROP DATABASE IF EXISTS ecofinds;
CREATE DATABASE ecofinds CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecofinds;

-- 2) Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3) Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Helpful indexes
CREATE INDEX idx_products_name ON products (name);

-- 4) Orders table (use this instead of purchases)
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',  -- e.g., Pending, Shipped, Delivered, Cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user   FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_orders_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 5) Order status history (optional, for tracking changes)
CREATE TABLE order_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_history_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6) (Optional) Sample data to test quickly
INSERT INTO users (name, email, password, phone) VALUES
('Alice', 'alice@example.com', 'password123', '1234567890'),
('Bob', 'bob@example.com', 'password456', '9876543210');

INSERT INTO products (name, description, price, stock) VALUES
('Eco Bag',  'Reusable eco-friendly bag', 10.50, 50),
('Solar Lamp','Portable solar lamp',      25.00, 20);

INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES
(1, 1, 2, 21.00, 'Pending'),
(2, 2, 1, 25.00, 'Pending');

-- 7) Quick views to verify
-- SHOW TABLES;
-- SELECT * FROM users;
-- SELECT * FROM products;
-- SELECT * FROM orders;
