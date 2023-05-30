const mongoose = require("mongoose");
const { isEmail, isDate, isMobilePhone } = require("validator");

const appointmentSchema = new mongoose.Schema({
    email: {
    type: String,
    required: [true, "Please enter an email"],
    validate: [isEmail, "Please enter a valid email"],
    },
  date: {
    type: Date,
    required: [true, "Please enter a date"],
    validate: [isDate, "Please enter a valid date"],
  },
  time: {
    type: String,
    required: [true, "Please enter a time"],
  },
  phone: {
    type: String,
    required: [true, "Please enter a phone number"],
    validate: [isMobilePhone, "Please enter a valid phone number"],
  },
  serviceType: {
    type: String,
    required: [true, "Please enter a service type"],
  },
  description: {
    type: String,
    required: [true, "Please enter a description"],
  },
  status: {
    type: String,
  },
});
const Appointment = mongoose.model('appointments', appointmentSchema);

module.exports = Appointment;