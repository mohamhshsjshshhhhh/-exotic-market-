const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// البيانات المؤقتة (في الواقع استخدم قاعدة بيانات)
let products = [
    { id: 1, name: "QC Link Premium", price: 15, type: "qc", desc: "رابط QC سريع وآمن لسيرفرات الديسكورد" },
    { id: 2, name: "Discord Invite Pro", price: 8, type: "invite", desc: "رابط دعوة دائم لأي سيرفر" },
    { id: 3, name: "Vanity URL", price: 25, type: "vanity", desc: "رابط مخصص قصير لسيرفرك" },
    { id: 4, name: "QC Link Gold", price: 20, type: "qc", desc: "رابط QC ذهبي مع مميزات إضافية" },
    { id: 5, name: "Bulk Invites (10)", price: 50, type: "invite", desc: "10 روابط دعوة بسعر مميز" }
];

let orders = [];
let users = [];

// APIs

// جلب كل المنتجات
app.get('/api/products', (req, res) => {
    res.json(products);
});

// إضافة منتج جديد (للأدمن)
app.post('/api/products', (req, res) => {
    const product = { 
        id: Date.now(), 
        ...req.body 
    };
    products.push(product);
    res.json(product);
});

// حذف منتج
app.delete('/api/products/:id', (req, res) => {
    products = products.filter(p => p.id != req.params.id);
    res.json({ success: true });
});

// إنشاء طلب جديد
app.post('/api/orders', (req, res) => {
    const order = { 
        id: Date.now(), 
        ...req.body, 
        date: new Date().toISOString(),
        status: 'pending'
    };
    orders.push(order);
    
    // إرسال تنبيه للديسكورد (اختياري)
    console.log('🛒 طلب جديد:', order);
    
    res.json(order);
});

// جلب الطلبات
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// تسجيل مستخدم جديد
app.post('/api/auth/register', (req, res) => {
    const user = { 
        id: Date.now(), 
        ...req.body 
    };
    users.push(user);
    res.json(user);
});

// تسجيل دخول
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// خدمة الصفحة الرئيسية (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Exotic Market running on port ${PORT}`);
    console.log(`📎 Local: http://localhost:${PORT}`);
});
