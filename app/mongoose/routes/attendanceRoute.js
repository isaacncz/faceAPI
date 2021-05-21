var express = require('express');
var router = express.Router();

var controller = require('../controllers/attendanceController');

// a simple test url to check that all of our files are communicating correctly.
router.get('/', controller.test);

router.get('/getAll', controller.getAllAttendance);

router.put('/update/:id', controller.updateOneById);

router.post('/create', controller.createNewAttendance);

router.get('/get', controller.getAttendanceWithPerformance);

module.exports = router;
