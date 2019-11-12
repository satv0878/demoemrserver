var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

/**
 * Create database scheme for notes
 */
const DeviceSchema = new Schema({
    name: {
        type: String,
    },
    orgid: {
        type: Number,
    },
    ip: {
        type: String,
    },
    mac: {
        type: String,
    },
    serial: {
        type: String,
        unique: true, 
        index: true,
        required: true, 
        uniqueCaseInsensitive: true 
    }
});


DeviceSchema.plugin(uniqueValidator);

var Device = mongoose.model('Device', DeviceSchema);

module.exports = Device
