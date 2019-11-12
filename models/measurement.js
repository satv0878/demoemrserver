var mongoose = require('mongoose');


var Schema = mongoose.Schema;
/**
 * Create database scheme for notes
 */
const MeasurementSchema = new Schema({
    type: {
        type: String,
        //enum:['Height', 'Weight', 'Blood Pressure'],
        required: [true, "Type is needed"], 
    },
    value: {
        type: String,
        required: "Measurement value required as Number"
    },
    unit: {
        type: String,
    },
    precision: {
        type: Number,
    },
    date: {
        type: Date,
        default: new Date
    }, 
    device: {
        type: Schema.Types.ObjectId, 
        ref: 'Device', 
        required: true
    }, 
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient' , 

    }, 
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    measurement_bundle_id: {
        type: String
    }, 
    message:{
        type: String, 
        required: [true, "Data can be imported via HL7 message only. "]
    }
});

module.exports= mongoose.model('Measurement', MeasurementSchema);