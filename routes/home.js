// routes/home.js
const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { username: req.session.user });
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
