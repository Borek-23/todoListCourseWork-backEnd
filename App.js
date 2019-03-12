// Wrap this whole thing into a function that takes 'config' parameter as a module
function App(config) {

// Changed these variables to constants as they are in fact constants
    const createError = require('http-errors');
    const express = require('express');
    const path = require('path');
    const cookieParser = require('cookie-parser');
    const logger = require('morgan');

    // 'mongodb://' + config.db.host + '/todolistappdb', {useNewUrlParser: true, user: config.db.user || undefined, password: config.db.password || undefined},



    // Here is the connection to the database using Mongoose
    const mongoose = require('mongoose');
    mongoose.connect('mongodb+srv://Lecturer:mobilewebtech2@todolistapp-szuux.mongodb.net/test?retryWrites=true', {useNewUrlParser: true}, function (err) {
        if (err) {
            // If there is no databse to connect to, I log the error and won't proceed
            console.error(err);
            return process.exit(1);
        }

        // Else return message about successful connection
        return console.info('Connected to MongoDB');
    });

    // Now to fetch the model using hat for IDs and model defined, this requires mongoose
    const todoListModel = require('./models/TodoListModel')(mongoose);

    // Create a service and parse the hat in
    const todoListService = require('./services/TodoListService')(todoListModel);

// Change the name of this variable to IndexRoute and make it require the correct module
    // Also must parse the correct dependency to the function
    // Here I must attach all the routes that will be used throughout the application
    const indexRoute = require('./routes/IndexRoute')(express);
    const todoListRoute = require('./routes/TodoListRoute')(express, todoListService);
// Deleted the 'users' module
    var app = express();

// view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

// Here have to change the name properly to require a correct module
    // Here I bind routes to my application
    app.use('/', indexRoute);
    app.use('/todoList', todoListRoute);
// Deleted the attachment to the users module

// catch 404 and forward to error handler
    app.use(function (req, res, next) {
        next(createError(404));
    });

// error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    // Since I made this a function, must now return the app itself
    return app;
}

module.exports = App;
