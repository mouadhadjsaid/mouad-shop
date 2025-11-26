// Check if user is logged in
window.addEventListener('load', () => {
    if (localStorage.getItem('adminLoggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
    loadProducts();
    updateStats();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    document.getElementById('editProductForm').addEventListener('submit', handleEditProduct);
    document.getElementById('searchProducts').addEventListener('input', filterProducts);
    document.getElementById('filterCategory').addEventListener('change', filterProducts);
}

// Show/Hide sections
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    // Show selected section
    if (sectionName === 'products') {
        document.getElementById('products-section').classList.add('active');
    } else if (sectionName === 'add') {
        document.getElementById('add-section').classList.add('active');
    } else if (sectionName === 'stats') {
        document.getElementById('stats-section').classList.add('active');
    } else if (sectionName === 'settings') {
        document.getElementById('settings-section').classList.add('active');
    }
    
    // Mark nav item as active
    event.target.classList.add('active');
}

// Handle add product
function handleAddProduct(e) {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value.trim();
    const emoji = document.getElementById('productEmoji').value.trim() || '📦';
    const description = document.getElementById('productDescription').value.trim();

    if (!name || !price) {
        alert('الرجاء إدخال اسم المنتج والسعر');
        return;
    }

    const products = JSON.parse(localStorage.getItem('mouadShopProducts') || '[]');
    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        category: category || 'عام',
        image: emoji,
        description: description,
        currency: 'دينار'
    };

    products.push(newProduct);
    localStorage.setItem('mouadShopProducts', JSON.stringify(products));
    
    document.getElementById('addProductForm').reset();
    loadProducts();
    updateStats();
    
    alert('✓ تمت إضافة المنتج بنجاح!');
    showSection('products');
    document.querySelector('.nav-item').click();
}

// Load and display products
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('mouadShopProducts') || '[]');
    const tableBody = document.getElementById('productsTableBody');
    const emptyState = document.getElementById('emptyState');

    tableBody.innerHTML = '';

    if (products.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span style="font-size: 24px;">${product.image}</span></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.description || '-'}</td>
            <td><strong>${product.price}</strong> ${product.currency}</td>
            <td>${product.category || 'عام'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="openEditModal(${product.id})">تعديل</button>
                    <button class="btn btn-delete" onclick="deleteProduct(${product.id})">حذف</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Filter products
function filterProducts() {
    const searchTerm = document.getElementById('searchProducts').value.toLowerCase();
    const selectedCategory = document.getElementById('filterCategory').value;
    const products = JSON.parse(localStorage.getItem('mouadShopProducts') || '[]');
    const tableBody = document.getElementById('productsTableBody');
    const emptyState = document.getElementById('emptyState');

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    tableBody.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    filtered.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span style="font-size: 24px;">${product.image}</span></td>
            <td><strong>${product.name}</strong></td>
            <td>${product.description || '-'}</td>
            <td><strong>${product.price}</strong> ${product.currency}</td>
            <td>${product.category || 'عام'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="openEditModal(${product.id})">تعديل</button>
                    <button class="btn btn-delete" onclick="deleteProduct(${product.id})">حذف</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Open edit modal
function openEditModal(productId) {
    const products = JSON.parse(localStorage.getItem('mouadShopProducts') || '[]');
    const product = products.find(p => p.id === productId);

    if (product) {
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductCategory').value = product.category || '';
        document.getElementById('editProductEmoji').value = product.image;
        document.getElementById('editProductDescription').value = product.description || '';

        document.getElementById('editModal').classList.add('show');
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
}

// Handle edit product
function handleEditProduct(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('editProductId').value);
    const name = document.getElementById('editProductName').value.trim();
    const price = parseFloat(document.getElementById('editProductPrice').value);
    const category = document.getElementById('editProductCategory').value.trim();
    const emoji = document.getElementById('editProductEmoji').value.trim();
    const description = document.getElementById('editProductDescription').value.trim();

    const products = JSON.parse(localStorage.getItem('mouadShopProducts') || '[]');
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex !== -1) {
        products[productIndex].name = name;
        products[productIndex].price = price;
        products[productIndex].category = category || products[productIndex].category;
        products[productIndex].image = emoji || products[productIndex].image;
        products[productIndex].description = description;

        localStorage.setItem('mouadShopProducts', JSON.stringify(products));
        closeEditModal();
        loadProducts();
        updateStats();
        alert('✓ تم تعديل المنتج بنجاح!');
    }
}

// Delete product
function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        const products = JSON.parse(localStorage.getItem('mouadShopProducts') || '[]');
        const filtered = products.filter(p => p.id !== productId);
        localStorage.setItem('mouadShopProducts', JSON.stringify(filtered));
        loadProducts();
        updateStats();
        alert('✓ تم حذف المنتج!');
    }
}

// Update stats
function updateStats() {
    const products = JSON.parse(localStorage.getItem('mouadShopProducts') || '[]');
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
    const avgPrice = totalProducts > 0 ? (totalValue / totalProducts).toFixed(2) : 0;
    const maxPrice = totalProducts > 0 ? Math.max(...products.map(p => p.price)) : 0;

    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalValue').textContent = totalValue.toFixed(2) + ' د';
    document.getElementById('avgPrice').textContent = avgPrice + ' د';
    document.getElementById('maxPrice').textContent = maxPrice.toFixed(2) + ' د';
}

// Clear all products
function clearAllProducts() {
    if (confirm('⚠️ سيتم حذف جميع المنتجات! هل أنت متأكد؟')) {
        localStorage.setItem('mouadShopProducts', JSON.stringify([]));
        loadProducts();
        updateStats();
        alert('✓ تم حذف جميع المنتجات!');
    }
}

// Export products
function exportProducts() {
    const products = JSON.parse(localStorage.getItem('mouadShopProducts') || '[]');
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mouad-shop-products-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('✓ تم تصدير البيانات!');
}

// Save settings
function saveSettings() {
    const whatsapp = document.getElementById('whatsappNumber').value;
    const facebook = document.getElementById('facebookLink').value;
    
    localStorage.setItem('shopWhatsapp', whatsapp);
    localStorage.setItem('shopFacebook', facebook);
    
    alert('✓ تم حفظ الإعدادات!');
}

// Logout
function logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'login.html';
    }
}
