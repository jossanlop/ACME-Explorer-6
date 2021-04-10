var cors = require('cors');
var bodyParser = require('body-parser');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  mongoose = require('mongoose'),
  Actor = require('./api/models/actorModel'),
  Trip = require('./api/models/tripModel'),
//   Item = require('./api/models/itemModel'),
  Application = require('./api/models/applicationModel.js'),
  finderCollectionSchema = require('./api/models/finderCollectionModel.js'),
  admin = require('firebase-admin'),
  serviceAccount = require('./acme-explorer-41761-firebase-adminsdk-fdl4t-69d28db65f.json'),
  bodyParser = require('body-parser');
  app.use(cors());

// MongoDB URI building
var mongoDBUser = process.env.mongoDBUser || "myUser";
var mongoDBPass = process.env.mongoDBPass || "myUserPassword";
var mongoDBCredentials = (mongoDBUser && mongoDBPass) ? mongoDBUser + ":" + mongoDBPass + "@" : "";

var mongoDBHostname = process.env.mongoDBHostname || "localhost";
var mongoDBPort = process.env.mongoDBPort || "27017";
var mongoDBName = process.env.mongoDBName || "ACME-Explorer";

var mongoDBURI = "mongodb://" + mongoDBCredentials + mongoDBHostname + ":" + mongoDBPort + "/" + mongoDBName;


mongoose.connect(mongoDBURI, {
    //reconnectTries: 10,
    //reconnectInterval: 500,
    poolSize: 10, // Up to 10 sockets
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // skip trying IPv6
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var routesActors = require('./api/routes/actorRoutes');
var routesTrips = require('./api/routes/tripRoutes');
// var routesItems = require('./api/routes/itemRoutes'); 
// var routesOrders = require('./api/routes/orderRoutes');
var routesApplications = require('./api/routes/applicationRoutes');
var routesFinders = require('./api/routes/finderCollectionRoutes');
var routesLogin = require('./api/routes/authRoutes');
var routesSponsorships = require('./api/routes/SponsorshipRoutes');

routesLogin(app);
routesActors(app);
routesTrips(app);
// routesItems(app);
// routesOrders(app);
routesApplications(app);
routesFinders(app);
routesSponsorships(app);

console.log("Connecting DB to: " + mongoDBURI);
mongoose.connection.on("open", function (err, conn) {
    app.listen(port, function () {
        console.log('ACME-Explorer RESTful API server started on: ' + port);
    });
});

mongoose.connection.on("error", function (err, conn) {
    console.error("DB init error " + err);
});

const expressSwagger = require('express-swagger-generator')(app);

const swaggerOptions = {
  swaggerDefinition: {
      info: {
          description: 'This is acme explorer',
          title: 'ACME-EXPLORER - Alfredo, Antonio, José Enrique, Rodrigo',
          version: '1.0.0',
      },
      host: process.env.HOSTNAME || ('localhost:' + port),
      basePath: '/v1/api-docs',
      produces: [
          "application/json",
      ],
      schemes: [process.env.SWAGGER_SCHEMA || 'http']
  },
  basedir: __dirname,
  files: ['./api/routes/**/*.js']
};

expressSwagger(swaggerOptions);

module.exports = app;