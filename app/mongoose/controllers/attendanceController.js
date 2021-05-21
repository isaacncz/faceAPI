var Attendance = require('../models/Attendance');
var Performance = require('../models/Performance');
var _ = require('lodash');
//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.send('this site is valid');
  console.log('this site is valid');
};

exports.createNewAttendance = async function (req, res) {
  var jsonFormat = new Attendance({
    id: req.body.id,
    name: req.body.name,
    date: req.body.date,
    action: req.body.action,
    timestamp: req.body.timestamp,
    emotion: req.body.emotion,
    proba: req.body.proba,
  });

  try {
    const data = await jsonFormat.save(jsonFormat);
    res.send(data);
    // console.log("Attendance were created successfully!");
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating.',
    });
  }
};

exports.getAllAttendance = async (req, res) => {
  const data = await Attendance.find({});

  try {
    if (data.length > 0) {
      res.send(data);
    } else res.status(404).send({ message: 'No data.' });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || 'Some error occurred while retrieving Attendance.',
    });
  }
};

exports.updateOneById = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Data to update can not be empty!',
    });
  }

  const id = req.params.id;
  const data = await Attendance.findByIdAndUpdate(id, req.body, {
    upsert: false,
    useFindAndModify: false,
    returnOriginal: false,
  });
  try {
    if (!data) {
      res.status(404).send({
        message: `Cannot update Attendance with id=${id}. Maybe Attendance was not found!`,
      });
    } else {
      res.send({
        message: 'Attendance was updated successfully.',
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Error updating Attendance with id=' + id,
    });
  }
};

exports.deleteOneById = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Attendance.findByIdAndRemove(id);
    if (!data) {
      res.status(404).send({
        message: `Cannot delete Attendance with id=${id}. Maybe Attendance was not found!`,
      });
    } else {
      res.send({
        message: 'Attendance was deleted successfully!',
      });
    }
  } catch (err) {
    res.status(500).send({
      message: 'Could not delete Attendance with id=' + id,
    });
  }
};

exports.getAttendanceWithPerformance = async (req, res) => {
  const date = req.query.date;
  const name = req.query.name;
  var condition = {};

  const s = date;
  const regex = new RegExp(s, 'i'); // i for case insensitive
  if (date != null && date != '') {
    condition['date'] = {
      $regex: regex,
    };
  }

  if (name != null && name != '') {
    condition['name'] = {
      $eq: name,
    };
  }

  // console.log(condition);
  try {
    try {
      var performanceData = await Performance.find(condition);
    } catch (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving.',
      });
    }

    condition['action'] = 'check-in';

    try {
      var attendanceData = await Attendance.find(condition);
    } catch (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving.',
      });
    }

    console.log(performanceData);
    console.log(attendanceData);

    var merge = _.map(performanceData, function (item) {
      return _.merge(item, _.find(attendanceData, { date: item.date }));
    });
    // const result = _.pickBy(merge, (value, key) => key.startsWith('n'));
    res.send(merge);
  } catch (err) {
    console.log(err);
  }
};
