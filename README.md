# ECOFINDS
Empowering Sustainable Consumption through a Second-Hand Marketplace
🌱 EcoFinds – Sustainable Product Marketplace

EcoFinds is a full-stack web application that connects eco-friendly product sellers with buyers.
Built using Node.js, Express, MySQL, and a frontend (HTML/CSS/JS or React), it provides secure authentication, product management, and category-based browsing.

🚀 Features

🔐 User Authentication – JWT-based secure login & signup

📦 Product Management – Create, Read, Update, Delete (CRUD) products

🏷 Category Filtering & Search – Find products easily

🖼 Image Uploads (with placeholders)

🌍 REST API for seamless frontend-backend integration

📊 MySQL Database for structured data storage

🛠 Tech Stack

Frontend

HTML, CSS, JavaScript (or React if extended)

Backend

Node.js + Express

MySQL (with mysql2 or sequelize)

JWT Authentication

dotenv, cors, bcrypt, multer

📂 Project Structure
EcoFinds/
│── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── productController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── routes/
│   │   └── productRoutes.js
│   ├── server.js
│   └── .env
│
│── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
│── README.md
│── package.json

⚙️ Setup & Installation
1️⃣ Clone Repository
git clone https://github.com/siddaram2k25/ecofinds.git
cd ecofinds

2️⃣ Backend Setup
cd backend
npm install


Create .env file in backend/ folder:

PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=ecofinds
JWT_SECRET=your_secret_key


Start backend:

node server.js


Server runs on 👉 http://localhost:5000/

3️⃣ Database Setup

Run the following SQL commands in MySQL:

CREATE DATABASE ecofinds;

USE ecofinds;

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT,
  price DECIMAL(10,2),
  image VARCHAR(255),
  user_id INT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

4️⃣ Frontend Setup

Open frontend/index.html in browser.
Ensure API calls point to http://localhost:5000/api/products.

📡 API Endpoints
Method	Endpoint	Description
GET	/api/products	Fetch all products
GET	/api/products/:id	Fetch product by ID
POST	/api/products	Add new product (auth)
PUT	/api/products/:id	Update product (auth)
DELETE	/api/products/:id	Delete product (auth)
