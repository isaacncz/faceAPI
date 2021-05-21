var express = require('express');
var router = express.Router();

var controller = require('../controllers/performanceController');

// a simple test url to check that all of our files are communicating correctly.
router.get('/', controller.test);

router.get('/getAll', controller.getAllPerformance);

router.put('/update/:id', controller.updateOneById);

router.post('/create', controller.createNewPerformance);

// router.delete('/delete/:id', controller.deleteOneById);

module.exports = router;
