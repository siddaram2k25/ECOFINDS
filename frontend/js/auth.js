
// Auth functionality for login and registration

/*document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('register.html')) {
        if (currentUser) {
            window.location.href = 'index.html';
        }
    }
    
    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user with matching credentials
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Set current user in localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirect to home page
                window.location.href = 'index.html';
            } else {
                alert('Invalid email or password. Please try again.');
            }
        });
    }
    
    // Registration form handling
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if email already exists
            if (users.some(user => user.email === email)) {
                alert('Email already registered!');
                return;
            }
            
            // Create new user object
            const newUser = {
                id: Date.now().toString(),
                username,
                email,
                password,
                joinDate: new Date().toISOString(),
                bio: '',
                location: ''
            };
            
            // Add to users array
            users.push(newUser);
            
            // Save to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
});
*/
document.addEventListener('DOMContentLoaded', function() {
    // Redirect if already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if ((window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) && currentUser) {
        window.location.href = 'index.html';
    }

    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    window.location.href = 'index.html';
                } else {
                    alert(data.message || 'Invalid email or password.');
                }
            } catch {
                alert('Login failed.');
            }
        });
    }

    // Registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    alert('Registration successful! Please login.');
                    window.location.href = 'login.html';
                } else {
                    alert(data.message || 'Registration failed!');
                }
            } catch {
                alert('Registration failed.');
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }
});