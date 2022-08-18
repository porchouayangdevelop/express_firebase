const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
require('dotenv').config();

// middlewaregi
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('dev'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2
    }
}));
app.use(helmet());
app.use(compression());


// static files
app.use(express.static('src/public'));

// join paths
const path = require('path');
app.use('/', express.static(path.join(__dirname, 'src/public')));



// set Content-Type for all responses for these routes
app.use((req, res, next) => {
    res.set('Content-Type', 'application/json');
    next();
});

// set allowed origins for all routes
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

// set allowed methods for all routes
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

// set allowed headers for all routes
app.use((req, res, next) => {
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


// routes
const users = require('./routes/user.routes');
const providers = require('./routes/provider.routes');
const vendors = require('./routes/vendor.routes');
const vendorRealtime = require('./routes/vendor.realtime.routes');

// use routes
app.use('/users', users);
app.use('/providers', providers);
app.use('/vendors', vendors);
app.use('/vendor-realtime', vendorRealtime);

require('./routes/blog.routes')(app);
require('./routes/payment.routes')(app);


module.exports = app;