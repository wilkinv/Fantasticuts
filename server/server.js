var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	  = require('passport');
var config      = require('./config/database'); // get db config file
var User        = require('./app/models/user'); // get the mongoose model
var Stylist     = require('./app/models/stylist');
var Appointment = require('./app/models/appointment');
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');
var fs          = require('fs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
app.use(morgan('dev'));
 
app.use(passport.initialize());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
 
// demo Route (GET http://localhost:8080)
app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});
 
// connect to database
mongoose.connect(config.database);
 
// pass passport for configuration
require('./config/passport')(passport);

fs.readFile('data.txt', function(err, data) {
  if (err) throw err;

  var newdata = data.toString().split('\n');

  for (var i = 0; i < newdata.length; i++) {
    var row = newdata[i].toString().split(',');
    var newStylist = new Stylist({
      name: row[0],
      phone_number: row[1],
      email: row[2],
      address: row[3],
      avg_rating: row[4],
      avg_price: row[5],
      style: row[6],
      location: [row[7], row[8]],
    });

    newStylist.save(function(err) {
      if (err) {

      } 
    });
  } 
});
 
// bundle our routes
var apiRoutes = express.Router();
 
// create a new user account (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});
 
// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

// route to find a stylist (POST http://localhost:8080/api/findstylist)
apiRoutes.post('/findstylist', function(req, res) {	
  var dist = Number.MAX_VALUE;
  if (req.body.distance !== '') {
    dist = req.body.distance/3963.2; //3963.2 is radius of Earth in miles
  }

  var query = Stylist.find({
    'location': {
      $near: [req.body.lat, req.body.lon],
      $maxDistance: dist
    }
  });

  if (req.body.avg_rating !== '') {
    query.where('avg_rating').gte(req.body.avg_rating);
  }
  if (req.body.price !== '') {
    var price = req.body.price.split('-');
    query.where('avg_price').gte(price[0]).lte(price[1]);
  } 
  if (req.body.type !== '') {
    query.where('style', req.body.type);
  }

  query.exec(function(err, docs) {
    if (err) throw err;
 
    if (!docs) {
      res.send({success: false, msg: 'No stylist found'});
    } else {
      console.log(docs);
      res.json({success: true, msg: docs});

    }
  });
});

// route to save an appointment (POST http://localhost:8080/api/saveappointment)
apiRoutes.post('/saveappointment', function(req, res) {
  if (!req.body.date) {
    res.json({success: false, msg: 'Please pass date.'});
  } else {
    var newAppointment = new Appointment({
      date: req.body.date,
      name: req.body.name,
      phone_number: req.body.phone_number,
      email: req.body.email,
      address: req.body.address,
      avg_rating: req.body.rating,
      avg_price: req.body.price,
      style: req.body.style,
      username: req.body.username
    });
  }

  newAppointment.save(function(err) {
    if (err) {

    } 
  });
  console.log(req.body);
});

// route to view an appointment (POST http://localhost:8080/api/viewappointment)
apiRoutes.post('/viewappointment', function(req, res) {
  var query = Appointment.find({});

  if (req.body.username !== '') {
    query.where('username', req.body.username);
  }

  query.exec(function(err, docs) {
    if (err) throw err;
 
    if (!docs) {
      res.send({success: false, msg: 'No appointments found'});
    } else {
      console.log(docs);
      res.json({success: true, msg: docs});

    }
  });
});

// route to view an appointment (POST http://localhost:8080/api/deleteappointment)
apiRoutes.post('/deleteappointment', function(req, res) {
  Appointment.remove({date: req.body.date}, function(err) {
    if (err) throw err;

    res.json({success: true, msg: ''});
  });
});
 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

// connect the api routes under /api/*
app.use('/api', apiRoutes);

// Start the server
app.listen(port);
console.log('Connected: http://localhost:' + port);