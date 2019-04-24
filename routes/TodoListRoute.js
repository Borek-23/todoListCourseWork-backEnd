// Need to take 'express' as a parameter because I am defining a route
function TodoListRoute(express, todoListService) {
    // Router on which I am defining this route
    var router = express.Router();

    // I need a 'post' request to accept route - uses callback function (with params req, res)
    router.post('/', function (req, res) {
        // Post request will come from the body
        // These are attributes that to-do list would have
        const name = req.body.name,
            description = req.body.description,
            tasks = req.body.tasks,
            status = "In Progress";


        // Call the service and its callback (return it so accidental code won't get executed)
        return todoListService.save({name, description, tasks})
            .then(result => {
                return res.status(201).send(result);
            })
            .catch(err => {
                console.error(err);
                return res.status(500).send();
            })
    });

    // Here I need a get request so to return the lists only when requested, not always automatically
    router.get('/findAll', function (req, res) {
        // Need a function which will find everything, then call back to with an error, or result
        return todoListService.findAll(function (err, todoLists) {
            // For now, just log the error
            if (err) {
                console.error("This " + err + " went wrong.");
                // Return error http code
                return res.status(500).send();
            }
            // If everything went corretly, return back the search result AS an object
            // Object is there so the structure stays the same, but object notation is changeable
            return res.send({payload: todoLists}); //
        })

    });

    // Search lists by ID
    router.get('/findListsById/id/:todoListId', function (req, res) {
        // For ID I must obtain it from params
        const todoListId = req.params.todoListId;
        return todoListService.findById(todoListId, function (err, todoList) {
            if (err) {
                console.error("This " + err + " went wrong.");
                return res.status(500).send();
            }
            // Because I know my todoList is an object I don't have to wrap it around anything
            return res.send(todoList);
        })
    });

    // Delete all of the tasks
    router.delete('/deleteAll', function (req, res) {
        return todoListService.deleteAll(function (err, todoList) {
            if (err) {
                console.error(err);
                return res.status(500).send();
            }
            return res.status(204).send("All entries deleted!");
        });
    });

    // Deleting tasks by their IDs
    router.delete('/deleteListsById/id/:todoListId', function (req, res) {
        const todoListId = req.params.todoListId;
        return todoListService.deleteById(todoListId, function (err, todoList) {
            if (err) {
                console.error(err);
                return res.status(500).json({message: "Failed to remove task from database."});
            }
            // Because the action (deletion) was completed successfully, I shall return 'no content' code
            res.status(202).send({message: "Successfully deleted the resource."});
        });
    });

    // Updating tasks by their IDs
    router.put('/updateLists/:todoListId', function(req, res) {
        const body = req.body;
        const todoListId = req.params.todoListId;

        todoListService.updateById(todoListId, body, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed');
            }

            return res.status(200).send('Updated successfully!');
        });
    });

    // Return router
    return router;
}

module.exports = TodoListRoute;