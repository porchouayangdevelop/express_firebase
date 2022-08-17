const app = require('./app');
require('dotenv').config();
// const chalk = require('chalk');

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port http://localhost:${port}`);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({
        message: 'Something broke!',
        error: err
    });
});