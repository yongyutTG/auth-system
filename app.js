const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const leaveRouter = require('./routes/leave');  //ใช้สำหรับลา   

const crypto = require('crypto');
const secretkey = crypto.randomBytes(32).toString('hex'); //คีย์ลับที่ปลอดภัย

app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: secretkey,
    resave: false,
    saveUninitialized: true,
    rolling: true,    // ต่ออายุ cookie ทุกครั้งที่มีการใช้งาน   
    cookie: {
        maxAge: 30 * 60 * 1000     // 30 นาที กำหนดเวลาหมดอายุของเซสชันเป็น 30 นาที (30 * 60 * 1000 มิลลิวินาที)
    }
}));

app.use('/', leaveRouter); // ใช้ router สำหรับเส้นทางหลัก



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
