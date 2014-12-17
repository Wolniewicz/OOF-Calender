var express = require('express');
var router = express.Router();

// GET OOF LIST
router.get('/ooflist', function(req, res) {
    var db = req.db;
    db.collection('ooflist').find().toArray(function (err, items) {
        res.json(items);
    });
});

// GET SINGLE OOF
router.get('/ooflist/:id', function(req, res) {
    var db = req.db;
	var oofToReturn = req.params.id;
    db.collection('ooflist').findById(oofToReturn, function(err, result){
		res.json(result);
	});
});

// POST OOF
router.post('/addoof', function(req, res) {
	var db = req.db;
	db.collection('ooflist').insert(req.body, function(err, result){
		res.send(
			(err === null) ? {msg:''} : {msg:err}
			);
	});
});

// DELETE OOF
router.delete('/deleteoof/:id', function(req, res){
	var db = req.db;
	var oofToDelete = req.params.id;
	db.collection('ooflist').removeById(oofToDelete, function(err, result){
		res.send((result === 1) ? {msg:''} : {msg:'error: ' + err});
	});
});

router.put('/updateoof/:id', function(req, res){
	var db = req.db;
	var oofToUpdate = req.params.id;
	db.collection('ooflist').updateById(oofToUpdate, req.body, function(err, result){
		res.send((result === 1) ? {msg:''} : {msg:'error' + error});
	});
});

module.exports = router;