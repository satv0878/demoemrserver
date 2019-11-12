const express = require("express");
const router = express.Router();
var async = require("async");
var Measurement = require("../models/measurement");
var Patient = require("../models/patient");

//// Display list of all Measurements.
exports.measurement_100list = async function(req, res) {
  try {
    const measurements = await Measurement.find()
      .sort({ _id: -1 })
      .limit(100)
      .populate("device")
      .populate("patient")
      .populate("user");
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.measurement_list = async function(req, res) {
  try {
    const measurements = await Measurement.find()
      .sort({ _id: -1 })
      .populate("device")
      .populate("patient")
      .populate("user");
    res.json(measurements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.measurement_by_patient = function(req, res, next) {
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
      if (err) {
        return next(err);
      }
      if (results.patients_measurements == null) {
        // No results.
        res.statusMessage = "No measurements found for this patient";
        res.status(404);
      }
      if (results.patients_measurements.length == 0) {
        // No results.
        res.statusMessage = "No measurements found for this patient";
        res.status(404);
      }
      if (results.patient == null) {
        // No results.
        res.statusMessage = "Patient doesn't exist";
        res.status(404);
      }
      // Successful, so render.
      res.json(results.patients_measurements);
    }
  );
};
////
//// Display detail page for a specific Measurement.
//exports.measurement_detail = function(req, res) {
//    res.send('NOT IMPLEMENTED: Measurement detail: ' + req.params.id);
//};
//
//// Display Measurement create form on GET.
//exports.measurement_create_get = function(req, res) {
//    res.send('NOT IMPLEMENTED: Measurement create GET');
//};
//
//// Handle Measurement create on POST.
exports.measurement_create_post = async function(req, res) {
  const measurement = new Measurement({
    type: req.body.type,
    value: req.body.value,
    unit: req.body.unit,
    precision: req.body.precision,
    date: req.body.date
  });

  try {
    const newMeasurement = await measurement.save();
    res.status(201).json(newMeasurement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//
//// Display Measurement delete form on GET.
//exports.measurement_delete_get = function(req, res) {
//    res.send('NOT IMPLEMENTED: Measurement delete GET');
//};
//
//// Handle Measurement delete on POST.
//exports.measurement_delete_post = function(req, res) {
//    res.send('NOT IMPLEMENTED: Measurement delete POST');
//};
//
//// Display Measurement update form on GET.
//exports.measurement_update_get = function(req, res) {
//    res.send('NOT IMPLEMENTED: Measurement update GET');
//};
//
//// Handle Measurement update on POST.
//exports.measurement_update_post = function(req, res) {
//    res.send('NOT IMPLEMENTED: Measurement update POST');
//};
