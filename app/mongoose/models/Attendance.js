const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
  proba: {
    type: Number,
  },
  emotion: {
    type: String,
    required: true,
  },
});

const Attendance = mongoose.model(
  'attendanceList',
  AttendanceSchema,
  'attendanceList'
);

module.exports = Attendance;
