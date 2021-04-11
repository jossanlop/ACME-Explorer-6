var cors = require('cors');
var bodyParser = require('body-parser');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 8080,
  mongoose = require('mongoose'),
  Actor = require('./api/models/actorModel'),
  Trip = require('./api/models/tripModel'),
  ConfigParam = require('./api/models/configParamModel'),
  Application = require('./api/models/applicationModel.js'),
  finderCollectionSchema = require('./api/models/finderCollectionModel.js'),
  admin = require('firebase-admin'),
  serviceAccount = require('./acme-explorer-41761-firebase-adminsdk-fdl4t-69d28db65f.json'),
  bodyParser = require('body-parser');
app.use(cors());

const cron = require('node-cron');
cron.schedule('0 0 */1 * * *', function () {
  console.log('running a task every hour');
  //Ahora comprobar la última fecha del último finder y si alguno tiene una diferencia mayor de una hora, se borrado
  //1- Comprobar cada finderDeadTime de cada usuario y comporbar la diferencia del tiemstamp de ese finder con respecto a al timestamp de now
  const aggregation = [
    { $project: { _id: 1, timestamp: "$timestamp" } }
  ];

  // Obtenemos el time de caducidad de finders en el esquema
  var finderTimeCache = 10;
  var finderMaxNum = 10;
  var finderMinNum = 1;

  finderCollectionSchema.aggregate(aggregation, function (err, finders) {
    if (err) {
      console.log(err);
    }
    else {
      dateNow = new Date();
      hoursNow = dateNow.getHours();
      console.log(finders);
      finders.forEach((finder) => {
        dateFinder = new Date(finder.timestamp);
        var diff = dateNow.getTime() - dateFinder.getTime();
        var daydiff = (diff / (1000 * 60 * 60)).toFixed(0);

        //Comprobamos al diferencia entre el fidner dead tiem del sistema y las horas pasasdas desde la busqueda (del finder)
        // Borramos el finder en caso de que se cumpla
        if (daydiff >= finderTimeCache) {
          finderCollectionSchema.deleteOne({ _id: finder._id }, function (err, finder) {
            if (err) {
              // res.status(500).send(err);
              console.log("error " + err);
            }
            else {
              // res.json({ message: 'Actor successfully deleted' });
              console.log('Finder: '+finder._id+' successfully deleted');
              console.log(finder);
            }
          });
        }
      });
    }
  });
});

//MongoDB URI building
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
var routesApplications = require('./api/routes/applicationRoutes');
var routesFinders = require('./api/routes/finderCollectionRoutes');
var routesLogin = require('./api/routes/authRoutes');
var routesSponsorships = require('./api/routes/SponsorshipRoutes');
var routesDashboard = require('./api/routes/dashboardRoutes');
var routesConfigParams = require('./api/routes/configParamRoutes');

routesLogin(app);
routesActors(app);
routesTrips(app);
routesApplications(app);
routesFinders(app);
routesSponsorships(app);
routesDashboard(app);
routesConfigParams(app);

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
    basePath: '/v2',
    produces: [
      "application/json",
    ],
    schemes: [process.env.SWAGGER_SCHEMA || 'http'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: "Introducir con formato 'Bearer &lt;idToken>'",
      }
    }
  },
  basedir: __dirname,
  files: ['./api/routes/*.js']
};

expressSwagger(swaggerOptions);

module.exports = app;