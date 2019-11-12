var express = require('express');
var router = express.Router();


// Require controller modules.
var device_controller = require('../controllers/deviceController');
var measurement_controller = require('../controllers/measurementController');
var patient_controller = require('../controllers/patientController');
var user_controller = require('../controllers/userController');


//// GET catalog home page.
//router.get('/', device_controller.index);
//
//// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
//router.get('/device/create', device_controller.device_create_get);

//// POST request for creating Book.
router.post('/device/create', device_controller.device_create_post);
//
//// GET request to delete Book.
//router.get('/device/:id/delete', device_controller.device_delete_get);
//
//// POST request to delete Book.
//router.post('/device/:id/delete', device_controller.device_delete_post);
//
//// GET request to update Book.
//router.get('/device/:id/update', device_controller.device_update_get);
//
//// POST request to update Book.
//router.post('/device/:id/update', device_controller.device_update_post);
//
//// GET request for one Book.
router.get('/device/:id', device_controller.device_detail);
//
//// GET request for list of all Book items.
router.get('/devices', device_controller.device_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display measurement).
//router.get('/measurement/create', measurement_controller.measurement_create_get);

//// POST request for creating Author.
router.post('/measurement/create', measurement_controller.measurement_create_post);
//
//// GET request to delete Author.
//router.get('/measurement/:id/delete', measurement_controller.measurement_delete_get);
//
//// POST request to delete Author.
//router.post('/measurement/:id/delete', measurement_controller.measurement_delete_post);
//
//// GET request to update Author.
//router.get('/measurement/:id/update', measurement_controller.measurement_update_get);
//
//// POST request to update Author.
//router.post('/measurement/:id/update', measurement_controller.measurement_update_post);
//
//// GET request for one Author.
////router.get('/measurement/:id', measurement_controller.measurement_detail);
//
//// GET request for list of all Authors.
router.get('/last100measurements', measurement_controller.measurement_100list);

router.get('/measurement/:id', measurement_controller.measurement_by_patient);



router.get('/measurements', measurement_controller.measurement_list);

/// GENRE ROUTES ///

//// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
//router.get('/patient/create', patient_controller.patient_create_get);
//
////POST request for creating Genre.
router.post('/patient/create', patient_controller.patient_create_post);
//
//// GET request to delete Genre.
//router.get('/patient/:id/delete', patient_controller.patient_delete_get);
//
//// POST request to delete Genre.
router.post('/patient/:id/delete', patient_controller.patient_delete_post);
//
//// GET request to update Genre.
//router.get('/patient/:id/update', patient_controller.patient_update_get);
//
//// POST request to update Genre.
router.post('/patient/:id/update', patient_controller.patient_update_post);
//
//// GET request for one Genre.
router.get('/patient/:id', patient_controller.patient_detail);
//
//// GET request for list of all Genre.
router.get('/patients', patient_controller.patient_list);
//
/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
//router.get('/user/create', user_controller.user_create_get);
//
//// POST request for creating BookInstance. 
router.post('/user/create', user_controller.user_create_post);
//
//// GET request to delete BookInstance.
//router.get('/user/:id/delete', user_controller.user_delete_get);
//
//// POST request to delete BookInstance.
//router.post('/user/:id/delete', user_controller.user_delete_post);
//
//// GET request to update BookInstance.
//router.get('/user/:id/update', user_controller.user_update_get);
//
//// POST request to update BookInstance.
//router.post('/user/:id/update', user_controller.user_update_post);
//
//// GET request for one BookInstance.
router.get('/user/:id', user_controller.user_detail);
//
//// GET request for list of all BookInstance.
router.get('/users', user_controller.user_list);

module.exports = router;