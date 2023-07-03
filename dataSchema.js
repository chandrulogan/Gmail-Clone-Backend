const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  to: {
    type: 'string',
    required: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value)
    },
    unique: true
  },
  subject: { type: 'string', required: true },
  text: { type: 'string', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = userSchema;
