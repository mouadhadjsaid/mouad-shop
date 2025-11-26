// Initialize products from localStorage or use defaults
function initializeProducts() {
    const defaultProducts = [
        {
            id: 1,
            name: 'كتاب البرمجة',
            description: 'كتاب شامل عن البرمجة وأساسياتها',
            price: 25,
            currency: 'دينار',
            image: '📚',
            category: 'كتب'
        },
        {
            id: 2,
            name: 'دورة تعليم الويب',
            description: 'دورة متقدمة في تطوير تطبيقات الويب',
            price: 45,
            currency: 'دينار',
            image: '💻',
            category: 'دورات'
        },
        {
            id: 3,
            name: 'قلم ذكي',
            description: 'قلم ذكي للكتابة والرسم الرقمي',
            price: 35,
            currency: 'دينار',
            image: '✏️',
            category: 'أدوات'
        },
        {
            id: 4,
            name: 'سماعة رأس',
            description: 'سماعة رأس لاسلكية عالية الجودة',
            price: 55,
            currency: 'دينار',
            image: '🎧',
            category: 'الكترونيات'
        }
    ];

    if (!localStorage.getItem('mouadShopProducts')) {
        localStorage.setItem('mouadShopProducts', JSON.stringify(defaultProducts));
    }
}

// Load and display products
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('mouadShopProducts') || '[]');
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h3>لا توجد منتجات حالياً</h3>
                <p>تفضل بزيارة لوحة الإدارة لإضافة منتجات جديدة</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                ${product.image}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-footer">
                    <div>
                        <span class="product-price">${product.price}</span>
                        <span class="product-currency"> ${product.currency}</span>
                    </div>
                    <button class="product-action" onclick="addToCart(${product.id})">شراء</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add to cart (can be extended with actual cart functionality)
function addToCart(productId) {
    alert(`تمت إضافة المنتج #${productId} إلى السلة!`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeProducts();
    loadProducts();
});
