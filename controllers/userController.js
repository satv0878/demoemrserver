var Users = require("../models/user");
const validator = require("express-validator");

// Display list of all Users.
exports.user_list = async function(req, res) {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Display detail page for a specific User.
exports.user_detail = function(req, res) {
  res.send("NOT IMPLEMENTED: User detail: " + req.params.id);
};

// Display User create form on GET.
exports.user_create_get = function(req, res) {
  res.send("NOT IMPLEMENTED: User create GET");
};

// Handle User create on POST.

exports.user_create_post = [
  // Validate that the name field is not empty.
  validator
    .body("userId", "User Id required")
    .isLength({ min: 1 })
    .trim(),

  // Sanitize (escape) the name field.
  validator.sanitizeBody("userId").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
    } else {
      // Create a Patient object with escaped and trimmed data.
      var user = new User({
        userId: req.body.patientId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.ethnicity
      });

      // Data from form is valid.
      // Check if User with same name already exists.
      User.findOne({ userId: req.body.userId }).exec(function(err, found_user) {
        if (err) {
          return next(err);
        }

        if (found_user) {
          // User exists, redirect to its detail page.
          res.status(500).json({ error: "User exists already" });
        } else {
          user.save(function(err) {
            if (err) {
              return next(err);
            } else res.sendStatus(200);
            // User saved. Redirect to User detail page.
          });
        }
      });
    }
  }
];

// Display User delete form on GET.
exports.user_delete_get = function(req, res) {
  res.send("NOT IMPLEMENTED: User delete GET");
};

// Handle User delete on POST.
exports.user_delete_post = function(req, res) {
  res.send("NOT IMPLEMENTED: User delete POST");
};

// Display User update form on GET.
exports.user_update_get = function(req, res) {
  res.send("NOT IMPLEMENTED: User update GET");
};

// Handle User update on POST.
exports.user_update_post = function(req, res) {
  res.send("NOT IMPLEMENTED: User update POST");
};
