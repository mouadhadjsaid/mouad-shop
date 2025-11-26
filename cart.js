// Initialize on page load
window.addEventListener('load', () => {
    displayUserInfo();
    loadCart();
    updateCartSummary();
});

// Display user info
function displayUserInfo() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userType = localStorage.getItem('userType');

    if (currentUser && userType === 'customer') {
        document.getElementById('userName').textContent = '👤 ' + currentUser.name;
        document.getElementById('logoutBtn').style.display = 'inline-block';
        document.getElementById('customerCard').style.display = 'block';
        document.getElementById('guestCard').style.display = 'none';
        
        document.getElementById('customerName').textContent = currentUser.name;
        document.getElementById('customerEmail').textContent = currentUser.email;
        document.getElementById('customerPhone').textContent = currentUser.phone;
        
        // Fill checkout form with user data
        document.getElementById('checkoutName').value = currentUser.name;
        document.getElementById('checkoutEmail').value = currentUser.email;
        document.getElementById('checkoutPhone').value = currentUser.phone;
    } else {
        document.getElementById('guestCard').style.display = 'block';
        document.getElementById('customerCard').style.display = 'none';
    }
}

// Load cart from localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('mouadShopCart') || '[]');
    const cartItemsDiv = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');

    if (cart.length === 0) {
        cartItemsDiv.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    cartItemsDiv.innerHTML = '';
    emptyCart.style.display = 'none';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-image">${item.image}</div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.description || 'منتج'}</p>
            </div>
            <div class="item-price">${item.price} د</div>
            <div class="item-quantity">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                <div class="qty-display">${item.quantity}</div>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">حذف</button>
            </div>
        `;
        cartItemsDiv.appendChild(cartItem);
    });
}

// Update quantity
function updateQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem('mouadShopCart') || '[]');
    const item = cart.find(i => i.id === productId);

    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        localStorage.setItem('mouadShopCart', JSON.stringify(cart));
        loadCart();
        updateCartSummary();
    }
}

// Remove from cart
function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('mouadShopCart') || '[]');
    const filtered = cart.filter(i => i.id !== productId);
    localStorage.setItem('mouadShopCart', JSON.stringify(filtered));
    loadCart();
    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('mouadShopCart') || '[]');
    
    const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    document.getElementById('itemsCount').textContent = itemsCount;
    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' د';
    document.getElementById('tax').textContent = tax.toFixed(2) + ' د';
    document.getElementById('total').textContent = total.toFixed(2) + ' د';
    document.getElementById('finalTotal').textContent = total.toFixed(2) + ' د';
}

// Apply promo code
function applyPromo() {
    const code = document.getElementById('promoCode').value.toUpperCase();
    
    // Simple promo codes
    const promoCodes = {
        'SAVE10': 0.10,
        'SAVE20': 0.20,
        'WELCOME': 0.05
    };

    if (promoCodes[code]) {
        localStorage.setItem('promoCode', code);
        localStorage.setItem('promoDiscount', promoCodes[code]);
        alert('✓ تم تطبيق الكود بنجاح! خصم ' + (promoCodes[code] * 100) + '%');
        updateCartSummary();
    } else {
        alert('❌ كود غير صحيح!');
    }
}

// Go to checkout
function goToCheckout() {
    const cart = JSON.parse(localStorage.getItem('mouadShopCart') || '[]');
    
    if (cart.length === 0) {
        alert('السلة فارغة!');
        return;
    }

    document.getElementById('checkoutModal').classList.add('show');
}

// Close checkout modal
function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('show');
}

// Handle checkout form
document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('checkoutName').value;
    const email = document.getElementById('checkoutEmail').value;
    const phone = document.getElementById('checkoutPhone').value;
    const city = document.getElementById('checkoutCity').value;
    const address = document.getElementById('checkoutAddress').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;

    const cart = JSON.parse(localStorage.getItem('mouadShopCart') || '[]');
    const cart2 = JSON.parse(localStorage.getItem('mouadShopCart') || '[]');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const order = {
        id: Date.now(),
        orderNumber: 'ORD' + Date.now(),
        customerName: name,
        email: email,
        phone: phone,
        city: city,
        address: address,
        payment: payment,
        items: cart,
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // Save order to current user if logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('mouadShopUsers') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            if (!users[userIndex].orders) {
                users[userIndex].orders = [];
            }
            users[userIndex].orders.push(order);
            localStorage.setItem('mouadShopUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
    }

    // Save order to all orders
    const allOrders = JSON.parse(localStorage.getItem('mouadShopOrders') || '[]');
    allOrders.push(order);
    localStorage.setItem('mouadShopOrders', JSON.stringify(allOrders));

    // Clear cart
    localStorage.setItem('mouadShopCart', JSON.stringify([]));

    closeCheckout();
    alert('✓ تم تأكيد طلبك بنجاح!\nرقم الطلب: ' + order.orderNumber + '\nسيتم التواصل معك قريباً.');
    
    // Redirect to home
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
});

// Login now
function loginNow() {
    window.location.href = 'customer-login.html';
}

// Logout
function logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        localStorage.removeItem('currentUser');
        localStorage.setItem('guestSession', 'true');
        window.location.reload();
    }
}

// Close modal on outside click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('checkoutModal');
    if (e.target === modal) {
        closeCheckout();
    }
});
