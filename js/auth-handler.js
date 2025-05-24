// const baseUrl = "http://localhost:3000";
const baseUrl = "http://localhost:3000";

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

async function loginUser(email, password) {
    try {
        const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error);
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to notes page
        window.location.href = 'notes.html';
    } catch (error) {
        alert(error.message);
    }
}

async function registerUser(firstName, email, password) {
    try {
        const response = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, email, password })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error);
        }

        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to notes page
        window.location.href = 'notes.html';
    } catch (error) {
        alert(error.message);
    }
}

function validateLoginForm(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    if (!validatePassword(password)) {
        alert('Password must be at least 6 characters long');
        return false;
    }
    
    loginUser(email, password);
    return false;
}

function validateRegisterForm(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (firstName.trim().length < 2) {
        alert('First name must be at least 2 characters long');
        return false;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    if (!validatePassword(password)) {
        alert('Password must be at least 6 characters long');
        return false;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }
    
    registerUser(firstName, email, password);
    return false;
}

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !window.location.href.includes('login.html') && !window.location.href.includes('register.html')) {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    console.log("222222222222222");
    
    // Clear authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    window.location.href = 'login.html';
}
// Call checkAuth when page loads
window.addEventListener('load', checkAuth);
