var express = require('express');
var router = express.Router();

// GET USER
router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('ooflist').find().toArray(function (err, items) {
        res.json(items);
    });
});

module.exports = router;