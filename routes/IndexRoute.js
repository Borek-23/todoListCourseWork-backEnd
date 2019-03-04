// Allows me to view all the module dependencies in one module
function IndexRoute(express) {
    var router = express.Router();

    /* GET home page. */
    router.get('/', function (req, res, next) {
        res.render('index', {title: 'Express'});
    });

    // Because I am calling a function with 'express' parameter, I must return the router back
    return router;
}


module.exports = IndexRoute;
