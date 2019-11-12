var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

/**
 * Create database scheme for notes
 */
const PatientSchema = new Schema({
    patientId: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    ethnicity: {
        type: String,
    },
    gender: {
        type: String,
    }
});

// Virtual for author's URL
PatientSchema
.virtual('url')
.get(function () {
  return '/measure/patient/' + this._id;
});




PatientSchema.plugin(uniqueValidator);

var Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient