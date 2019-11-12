var Device = require('../models/device')


// Display list of all Devices.
exports.device_list = async function(req, res) {
    try {
        const devices = await Device.find()
        res.json(devices)
      } catch (err) {
          res.status(500).json({ message: err.message })
      }
};

// Display detail page for a specific Device.
exports.device_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: device detail: ' + req.params.id);
};

// Display device create form on GET.
exports.device_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Device create GET');
};

// Handle Device create on POST.
exports.device_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Device create POST');
};

// Display Device delete form on GET.
exports.device_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Device delete GET');
};

// Handle Device delete on POST.
exports.device_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Device delete POST');
};

// Display Device update form on GET.
exports.device_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Device update GET');
};

// Handle Device update on POST.
exports.device_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Device update POST');
};