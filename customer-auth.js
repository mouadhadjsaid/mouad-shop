// Toggle between login and register
function toggleForms() {
    document.querySelector('.login-section').classList.toggle('active');
    document.querySelector('.register-section').classList.toggle('active');
}

// Continue as guest
function continueAsGuest() {
    localStorage.setItem('userType', 'guest');
    localStorage.setItem('guestSession', 'true');
    window.location.href = 'index.html';
}

// Handle Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('mouadShopUsers') || '[]');
    
    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
        errorDiv.textContent = '❌ البريد الإلكتروني غير مسجل!';
        errorDiv.style.display = 'block';
        return;
    }

    if (user.password !== password) {
        errorDiv.textContent = '❌ كلمة المرور غير صحيحة!';
        errorDiv.style.display = 'block';
        return;
    }

    // Login successful
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userType', 'customer');
    localStorage.removeItem('guestSession');
    
    errorDiv.style.display = 'none';
    alert('✓ مرحباً ' + user.name);
    window.location.href = 'index.html';
});

// Handle Register
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');

    // Get existing users
    const users = JSON.parse(localStorage.getItem('mouadShopUsers') || '[]');

    // Check if email exists
    if (users.find(u => u.email === email)) {
        errorDiv.textContent = '❌ هذا البريد مسجل بالفعل!';
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        createdAt: new Date().toISOString(),
        orders: []
    };

    // Add user to list
    users.push(newUser);
    localStorage.setItem('mouadShopUsers', JSON.stringify(users));

    // Clear form
    document.getElementById('registerForm').reset();
    
    errorDiv.style.display = 'none';
    successDiv.textContent = '✓ تم إنشاء الحساب بنجاح! جاري التحويل...';
    successDiv.style.display = 'block';

    // Login the new user
    setTimeout(() => {
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('userType', 'customer');
        window.location.href = 'index.html';
    }, 2000);
});
