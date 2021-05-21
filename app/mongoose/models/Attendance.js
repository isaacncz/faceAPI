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
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  proba: {
    type: Number,
    required: true,
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
