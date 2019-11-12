var Patient = require("../models/patient");
var Measurement = require("../models/measurement");
const validator = require("express-validator");
var async = require('async');
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

// Display list of all Patients.
exports.patient_list = async function(req, res) {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Display detail page for a specific Patient.
exports.patient_detail = function(req, res, next) {
    
    async.parallel({
    patient: function(callback) {
        
      Patient.findById(req.params.id).exec(callback);
      console.log("test")}
    }, function(err, results) {
        console.log("test")
        if (err) { return next(err); }
        if (results.patient==null) { // No results.
            var err = new Error('Patient not found');
            err.status = 404;
            return next(err);
        }
        res.json(results.patient);
    }
  );
};

// Display Patient create form on GET.
exports.patient_create_get = function(req, res) {
  res.send("NOT IMPLEMENTED: Patient create GET");
};

// Handle Patient create on POST.
exports.patient_create_post = [
  // Validate that the name field is not empty.

  body("patientId", "Patient Id required")
    .isLength({ min: 1 })
    .trim(),

  // Sanitize (escape) the name field.
  sanitizeBody("patientId").escape(),

  //validator.
  body("firstName")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  //validator.
  body("lastName")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  //body("dateOfBirth", "Invalid date of birth")
  // .optional({ checkFalsy: true })
  // .isISO8601(),

  // Sanitize fields.
  sanitizeBody("firstName").escape(),
  sanitizeBody("lastName").escape(),
  //sanitizeBody("dateOfBirth").toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
    } else {
      // Create a Patient object with escaped and trimmed data.
      var patient = new Patient({
        patientId: req.body.patientId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        ethnicity: req.body.ethnicity,
        gender: req.body.gender
      });
      console.log(patient.patientId);

      // Data from form is valid.
      // Check if Genre with same name already exists.
      Patient.findOne({ patientId: req.body.patientId }).exec(function(
        err,
        found_patient
      ) {
        if (err) {
          return next(err);
        }
        if (found_patient) {
          // Genre exists, redirect to its detail page.
          res.status(500).json({ error: "Patient exists already" });
        } else {
          patient.save(function(err) {
            if (err) {
              return next(err);
            }
            //ToDo: send HL7 ADT
            else res.sendStatus(200);
            // Patient saved. Redirect to Patient detail page.
          });
        }
      });
    }
  }
];

// Display Patient delete form on GET.
exports.patient_delete_post = function(req, res, next) {

    async.parallel(
        {
            patient: function(callback) {
              Patient.findById(req.params.id).exec(callback);
            },
            patients_measurements: function(callback) {
              Measurement.find({ patient: req.params.id }).exec(callback);
            }
          },
    
     function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.patients_measurements.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.statusMessage = "Forbidden to delete this patient because measurements are associated with this patient ";
            res.status(403);
             
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
           
            Patient.findByIdAndRemove(req.params.id, function deletePatient(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.statusMessage = "Patient deleted";
                res.status(200);
               
            })
        }
    });
};

// Handle Patient delete on POST.
exports.patient_delete_get = function(req, res) {
  res.send("NOT IMPLEMENTED: Patient delete POST");
};

// Display Patient update form on GET.
exports.patient_update_get = function(req, res) {
  res.send("NOT IMPLEMENTED: Patient update GET");
};

// Handle Patient update on POST.
exports.patient_update_post =  [

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

    } else {

    var patient = new Patient({
        patientId: req.body.patientId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        ethnicity: req.body.ethnicity,
        gender: req.body.gender,
        _id:req.params.id
      });
      
      console.log(patient)

      console.log("find and create1")
      Patient.findByIdAndUpdate(req.params.id, patient, {}, function (err) {
        if (err) { return next(err); }
           // Successful - redirect to book detail page.
           res.sendStatus(200);
        });
        
    }
    
}
];
