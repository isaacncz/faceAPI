const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  name: {
    // required: true,
    type: String,
  },
  emotion: {
    // required: true,
    type: String,
  },
  filename: [
    {
      required: true,
      type: String,
    },
  ],
  fileId: [
    {
      required: true,
      type: String,
    },
  ],
  createdAt: {
    default: Date.now(),
    type: Date,
  },
  ts: {
    // default: Date.now(),
    type: Date,
  },
});

module.exports = mongoose.model('image', ImageSchema, 'images');
