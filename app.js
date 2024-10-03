const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const authRouter = require('./routes/auth'); // ตรวจสอบเส้นทางของไฟล์ให้ถูกต้อง


app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 } // กำหนดเวลาหมดอายุของ session
}));

app.use('/', authRouter); // ใช้ router สำหรับเส้นทางหลัก

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
