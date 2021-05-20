const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const baseOptions = {
  discriminatorKey: '__type',
  collection: 'user',
};

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    verify: {
      type: Boolean,
      required: true,
    },
    verifyHash: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
  },
  baseOptions
);

const User = mongoose.model('user', UserSchema, 'user');

module.exports = User;
