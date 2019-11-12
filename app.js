var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
var moment = require("moment");
var sass = require('node-sass-middleware')


moment.locale("de");

var app = express();


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use(
  sass({
    src: __dirname, 
    dest: path.join(__dirname, "public"),
    debug: true
  })
);

var measureRouter = require("./routes/measure.js");
app.use("/measure", measureRouter);

// Handle Production
// static Folder
app.use(express.static(__dirname + "/server/public/"));

// Handle SPA
app.get("/", (req, res) =>
  res.sendFile(__dirname + "/server/public/index.html")
);

const port = process.env.PORT || 9006;

const server = app.listen(port, () =>
  console.log(`Server started on Port ${port}`)
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("404 Error Message: ");
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

////HL7 Server /////////////////////

var hl7 = require("simple-hl7");
const io = require("socket.io")(server);
var Measurement = require("./models/measurement.js");
var Device = require("./models/device.js");
var Patient = require("./models/patient.js");
var User = require("./models/user.js");

///////////////////SERVER/////////////////////
var hl7app = hl7.tcp();

hl7app.use(function(req, res, next) {
  //req.msg is the HL7 message
  console.log("******message received*****");
  console.log(req.msg.log());
  var data = req.msg.log();

  // Adding segment seperator is required
  var parser = new hl7.Parser({ segmentSeperator: "\n" });

  var msg = parser.parse(data);

  var pv1 = msg.getSegment("PV1");

  var pid = msg.getSegment("PID");
  var msh = msg.header;

  const patient = new Patient({
    patientId: pid.getComponent(3, 1),
    firstName: pid.getComponent(5, 2),
    lastName: pid.getComponent(5, 1),
    dateOfBirth: pid.getComponent(7, 1),
    ethnicity: pid.getComponent(10, 1),
    gender: pid.getComponent(8, 1)
  });

  // Array to check if dublicate serial numbers within one ORU messagr
  var obxDevices = [];
  var obxUsers = [];

  createUser(obxUsers, msg)
    .then(_ => createDevice(obxDevices, msg))
    .then(_ => createPatient(patient, msg))
    .then(_ =>
      createMeasurement(obxUsers, obxDevices, patient, msg, msh, data)
    ).then(_ =>
io.emit("MESSAGE", pid.getComponent(3, 1)))

  next();
});

hl7app.use(function(req, res, next) {
  console.log("******sending ack*****");
  res.end();
});

hl7app.use(function(err, req, res, next) {
  //error handler
  //standard error middleware would be
  console.log("******ERROR*****");
  console.log(err);
  var msa = res.ack.getSegment("MSA");
  msa.editField(1, "AR");
  res.ack.addSegment("ERR", err.message);
  res.end();
});
 
//Listen on port 5000
hl7app.start(5001);
///////////////////SERVER/////////////////////

////////////Mongo DB ////////////////////////

//Set up default mongoose connection
//var mongoDB = "mongodb://127.0.0.1:8677/DemoEMRdatabasetest";
var mongoDB = "mongodb://mongo:27017/DemoEMRdatabase";
mongoose
  .connect(mongoDB, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = app;

async function createPatient(patient, msg) {
  await Patient.findOne({ patientId: patient.patientId })
    .select("_id")
    .then(existingPatient => {
      if (existingPatient) {
        patient._id = existingPatient;
      } else {
        const newPatient = patient.save(function(err) {
         
        });
      }
    });

  return patient;
}

async function createDevice(obxDevices, msg) {
 
  for (var index = 0; index < msg.getSegments("OBX").length; index++) {
    

    const device = new Device({
      name: msg.getSegments("OBX")[index].getComponent(18, 1),
      orgid: msg.getSegments("OBX")[index].getComponent(18, 5),
      ip: msg.getSegments("OBX")[index].getComponent(18, 4),
      mac: msg.getSegments("OBX")[index].getComponent(18, 2),
      serial: msg.getSegments("OBX")[index].getComponent(18, 3)
    });

    //ad the device only if it has another serial number
    if (!obxDevices.some(x => x.serial == device.serial)) {
      obxDevices.push(device);
    }

    await Device.findOne({ serial: device.serial })
      .select("_id")
      .then(existingDevice => {
        if (existingDevice) {
          device._id = existingDevice;
        } else {
          const newDevice = device.save(function(err) {
            //if(err.name == 'ValidationError')
            //{
          

            //const doc1 =  Device.findOne({serial: device.serial}).select('_id')
            //const upd= Device.updateOne({_id: doc1['_id']},
            //{ip:device.ip, name:device.name},
            //{upsert: true},
            //function(err, doc){console.log(doc)}
            //)
          });
        }
      });
  }

  return obxDevices;
}

async function createUser(obxUsers, msg) {
  

  for (var index = 0; index < msg.getSegments("OBX").length; index++) {
    
    const user = new User({
      userId: msg.getSegments("OBX")[index].getComponent(16, 1),
      firstName: msg.getSegments("OBX")[index].getComponent(16, 3),
      lastName: msg.getSegments("OBX")[index].getComponent(16, 2),
      //dateOfBirth:msg.getSegments("OBX")[index].getComponent(16, 4),
      role: msg.getSegments("OBX")[index].getComponent(16, 7)
    });

    if (!obxUsers.some(x => x.userId == user.userId)) {
      obxUsers.push(user);
    }

    await User.findOne({ userId: user.userId })
      .select("_id")
      .then(existingUser => {
        if (existingUser) {
         
          user._id = existingUser;
        } else {
          const newUser = user.save(function(err) {
            if (err.name == "ValidationError") {
            
              const doc1 = User.findOne({ userId: user.userId }).select("_id");
              //const upd= User.updateOne({_id: doc1['_id']},
              //{firstName:user.firstName, lastName:user.lastName},
              //{upsert: true},
              //function(err, doc){console.log(doc)}
              //)
            }
          });
        }
      });
  }

  return obxUsers;
}

async function createMeasurement(
  obxUsers,
  obxDevices,
  patient,
  msg,
  msh,
  data
) {
  

  for (var index = 0; index < msg.getSegments("OBX").length; index++) {
    var userid = msg.getSegments("OBX")[index].getComponent(16, 1);
    var deviceid = msg.getSegments("OBX")[index].getComponent(18, 1);


    if (obxUsers.length == 1) {
      userid = obxUsers[0]._id;
    }

    

    if (obxDevices.length == 1) {
      deviceid = obxDevices[0]._id;
    }

    const measurement = new Measurement({
      type: msg.getSegments("OBX")[index].fields[2].value[0][0],
      value: msg.getSegments("OBX")[index].fields[4].value[0][0],
      unit: msg.getSegments("OBX")[index].fields[5].value[0][0],
      measurement_bundle_id: msh.getComponent(8, 1),
      // read device serial from field 18-3  obx msg.getSegments("OBX")[index]
      device: deviceid,
      patient: patient._id,
      user: userid,
      date: parseHL7Date(
        msg.getSegments("OBX")[index].fields[13].value[0][0].toString()
      ),
      message: data
    });

    const newMeasurement = measurement.save(function(err) {
      
    });
    //save the data only if the device doesn't exist yet
  }
}

function parseHL7Date(str) {
  moment.locale("de");
  return moment(str, "YYYYMMDDHHmmss").toDate();
}

function saveDevice(device, cb) {
  Device.find({ name: device.serial }, function(err, docs) {
    if (docs.length) {
      cb("device exists already", null);
    } else {
      device.save(function(err) {
        cb(err, device);
      });
    }
  });
}
