var express = require('express');
var router = express.Router();

// Home page route.

// Handle Production
// static Folder
//app.use(express.static(__dirname + './server/public/'))

// Handle SPA
router.get('/', (req, res) => res.sendFile(__dirname+ '../server/public/index.html'))

module.exports = router;