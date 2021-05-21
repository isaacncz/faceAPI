const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const PerformanceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  metric: {
    type: String,
    required: true,
  },
  output: {
    type: Number,
    required: true,
  },
});

const Performance = mongoose.model(
  'performance',
  PerformanceSchema,
  'performance'
);

module.exports = Performance;
