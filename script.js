// ==========================================
// 1. الثوابت والإعدادات الرئيسية
// ==========================================
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80";

// دالة لجلب رقم الواتساب الكامل المخفي من الـ HTML
function getWhatsAppNumber() {
    const bodyPhone = document.body ? document.body.getAttribute("data-whatsapp") : null;
    return bodyPhone || "962785522491";
}

// ==========================================
// 2. قائمة منتجات البوتيك (Boutique Items)
// ==========================================
const menuItems = [
    // فساتين وأطقم
    { id: 1, name: "فستان سهرة ساتان أنيق", category: "dresses", price: 35.00, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80" },
    { id: 2, name: "طقم كاجوال صيفي ناعم", category: "dresses", price: 28.00, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80" },
    { id: 3, name: "فستان ميد كلاسيك", category: "dresses", price: 32.50, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80" },
 
    // حقائب
    { id: 5, name: "حقيبة يد جلد طبيعي فاخرة", category: "bags", price: 22.00, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80" },
    { id: 6, name: "شنطة كروس أنيقة للمناسبات", category: "bags", price: 18.50, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80" },
    { id: 7, name: "حقيبة كلاسيك بيج", category: "bags", price: 25.00, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80" },

    // إكسسوارات ومجوهرات
    { id: 8, name: "سوارة وسلسلة مطلية بالذهب", category: "accessories", price: 12.00, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80" },
    { id: 9, name: "خاتم زركون تصميم ألمنيوم", category: "accessories", price: 8.50, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80" },
    { id: 10, name: "نظارة شمسية مودرن", category: "accessories", price: 15.00, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80" },
    { id: 11, name: "ساعة يد فاخرة سير روز جولد", category: "accessories", price: 29.00, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500&q=80" },

    // أحذية
    { id: 12, name: "حذاء كعب عالي للمناسبات", category: "shoes", price: 27.00, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80" },
    { id: 13, name: "سنيكرز مريح مودرن", category: "shoes", price: 23.00, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80" }
];

let cart = [];

// ==========================================
// 3. عرض المنتجات والفلترة
// ==========================================
function displayMenuItems(items) {
    const container = document.getElementById("menuContainer");
    if (!container) return;
    
    container.innerHTML = "";

    items.forEach(item => {
        const imgSrc = (item.image && item.image.trim() !== "") ? item.image : DEFAULT_IMAGE;

        const card = document.createElement("div");
        card.className = "menu-card";
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${imgSrc}" alt="${item.name}" class="item-img" loading="lazy" onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}';">
            </div>
            <div class="card-body">
                <h3>${item.name}</h3>
                <div class="card-footer-row">
                    <span class="item-price">${item.price.toFixed(2)} د.أ</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">إضافة للحقيبة +</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterCategory(category, event) {
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    if (category === 'all') {
        displayMenuItems(menuItems);
    } else {
        const filtered = menuItems.filter(item => item.category === category);
        displayMenuItems(filtered);
    }
}

// ==========================================
// 4. إدارة حقيبة التسوق
// ==========================================
function addToCart(id) {
    const item = menuItems.find(prod => prod.id === id);
    const cartItem = cart.find(prod => prod.id === id);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCartUI();
}

function changeQuantity(id, change) {
    const cartItem = cart.find(prod => prod.id === id);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(prod => prod.id !== id);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById("cartItemsContainer");
    const cartCount = document.getElementById("cartCount");
    const totalAmount = document.getElementById("totalAmount");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="empty-msg">حقيبة التسوق فارغة حالياً</p>`;
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            count += item.quantity;

            const cartRow = document.createElement("div");
            cartRow.className = "cart-item";
            cartRow.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">${itemTotal.toFixed(2)} د.أ</span>
                </div>
                <div class="quantity-controls">
                    <button onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            `;
            cartContainer.appendChild(cartRow);
        });
    }

    if (cartCount) cartCount.textContent = count;
    if (totalAmount) totalAmount.textContent = `${total.toFixed(2)} د.أ`;
}

function toggleCart() {
    const modal = document.getElementById("cartModal");
    if (modal) modal.classList.toggle("active");
}

function handlePaymentChange() {
    const paymentSelect = document.getElementById("paymentMethod");
    const cliqNotice = document.getElementById("cliqNotice");

    if (!paymentSelect || !cliqNotice) return;

    if (paymentSelect.value === "cliq") {
        cliqNotice.style.display = "block";
    } else {
        cliqNotice.style.display = "none";
    }
}

// دالة نسخ رقم CliQ الكامل (تنسخ الرقم الحقيقي المخفي)
function copyCliqNumber() {
    const cliqNumElem = document.getElementById("cliqNum");
    const bodyCliq = document.body ? document.body.getAttribute("data-cliq") : null;
    
    // يقرأ الرقم الكامل من data-full-num أو data-cliq أو الافتراضي
    const fullNumber = cliqNumElem ? (cliqNumElem.getAttribute("data-full-num") || bodyCliq) : "0785522491";
    
    navigator.clipboard.writeText(fullNumber).then(() => {
        alert("تم نسخ رقم CliQ بنجاح!");
    }).catch(() => {
        alert("رقم التحويل هو: " + fullNumber);
    });
}

// ==========================================
// 5. إرسال الطلب عبر الواتساب (باستخدام الرقم الكامل)
// ==========================================
function sendToWhatsApp() {
    if (cart.length === 0) {
        alert("حقيبة التسوق فارغة! يرجى اختيار المنتجات أولاً.");
        return;
    }

    const paymentSelect = document.getElementById("paymentMethod");
    let selectedPaymentText = "نقداً (عند الاستلام)";
    let isCliq = false;

    if (paymentSelect && paymentSelect.selectedIndex !== -1) {
        selectedPaymentText = paymentSelect.options[paymentSelect.selectedIndex].text;
        if (paymentSelect.value === "cliq") {
            isCliq = true;
        }
    }

    let message = "*تفاصيل الطلب:*\n";

    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${index + 1}. ${item.name} (عدد: ${item.quantity}) - ${itemTotal.toFixed(2)} د.أ\n`;
    });

    message += `\n💰 *المجموع الكلي:* ${total.toFixed(2)} د.أ\n`;
    message += `💳 *طريقة الدفع:* ${selectedPaymentText}\n\n`;

    if (isCliq) {
        message += "📌 *ملاحظة:* تم اختيار الدفع عبر CliQ. (يرجى إرفاق صورة وصل التحويل هنا لتأكيد الطلب/الحجز).\n";
    }

    const encodedMessage = encodeURIComponent(message);
    const targetPhone = getWhatsAppNumber();
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
}

// ==========================================
// 6. تهيئة البحث والصفحة
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const filtered = menuItems.filter(item => item.name.toLowerCase().includes(searchTerm));
            displayMenuItems(filtered);
        });
    }

    displayMenuItems(menuItems);
});