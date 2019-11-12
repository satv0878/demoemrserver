const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var helmet = require('helmet');
var routers = express.Router()
var mongoose = require('mongoose');
//const router = require("./routes")

// Database
//var mongoDB = 'mongodb://mongo:27017/demoemr';
//mongoose.connect(mongoDB, { useNewUrlParser: true })
//.then(() => console.log("MongoDB connected"))
//.catch(err => console.log(err))


const app = express();

app.use(helmet())

// GET home page.
//router.get('/', function(req, res) {
  //res.redirect('/measure');
//});

// Home page route.
routers.get('/', function (req, res) {
  res.send('Wiki home page');
})

routers.post('/about', function (req, res) {
  res.send("About this wiki");
})

// GET home page.
//routers.get('/', function(req, res) {
//  res.send('Hello World');
//});

//var measureRouter = require('../routes/measure');
//app.use('/measure', measureRouter)

// Middleware
app.use(bodyParser.json());
app.use(cors());

console.log(process.env.NODE_ENV)

// Handle Production
// static Folder
//app.use(express.static(__dirname + '/public/'))

// Handle SPA
//app.get('/index', (req, res) => res.sendFile(__dirname+ '/public/index.html'))


const port = process.env.PORT || 9006;

module.exports = routers;


const server = app.listen(port, () => console.log(`Server started on Port ${port}`));

////HL7 Server /////////////////////

var hl7 = require('simple-hl7');
const io = require('socket.io')(server);

///////////////////SERVER/////////////////////
var hl7app = hl7.tcp();

hl7app.use(function(req, res, next) {
  //req.msg is the HL7 message
  console.log('******message received*****')
  console.log(req.msg.log());

  io.emit('MESSAGE', req.msg.log())
  next();
})

hl7app.use(function(req, res, next){
  //res.ack is the ACK
  //acks are created automatically

  //send the res.ack back
  console.log('******sending ack*****')
  res.end()
})

hl7app.use(function(err, req, res, next) {
  //error handler
  //standard error middleware would be
  console.log('******ERROR*****')
  console.log(err);
  var msa = res.ack.getSegment('MSA');
  msa.editField(1, 'AR');
  res.ack.addSegment('ERR', err.message);
  res.end();
});

//Listen on port 5000
hl7app.start(5000);
///////////////////SERVER/////////////////////


