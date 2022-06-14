const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
    async
} = require('@firebase/util');
const app = express();
const morgan = require('morgan');

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('dev'));

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

// use routes
app.use('/users', users);
app.use('/providers', providers);

app.use('', (req, res) => {
    res.render('/src/public/index.html');
});
// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});




module.exports = app;