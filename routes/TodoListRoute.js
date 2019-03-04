// Need to take 'express' as a parameter because I am defining a route
function TodoListRoute(express, todoListService) {
    // Router on which I am defining this route
    var router = express.Router();

    // I need a 'post' request to accept route - uses callback function (with params req, res)
    router.post('/', function (req, res) {
        // Post request will come from the body
        // These are attributes that to-do list would have
        var name = req.body.name;
        var description = req.body.description;
        var tasks = req.body.tasks;
        var status = "In Progress";

        // Call the service and its callback (return it so accidental code won't get executed)
        return todoListService.save(name, description, tasks, status, function (err, savedTodoList) {
            // if there is an error, throw it and return 500 http code
            if (err) {
                console.error(err);
                return res.status(500).send();
            }

            // If everything is OK, return saved todoList to the user (with code 201 which means HTTP created)
            // and must return, although I already know it is JSON, I can only use send() method
            return res.status(201).send(savedTodoList);
        });
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
            return res.send({todoLists: todoLists});
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
                return res.status(500).send('failed');
            }

            // Because the action (deletion) was completed successfully, I shall return 'no content' code
            return res.status(204).send();
        });
    });

    // Updating tasks by their IDs
    router.put('/updateLists/:todoListId', function(req, res) {
        const body = req.body;

        const todoListId = req.params.todoListId;
        return todoListService.updateById(todoListId, body, function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed');
            }
            // function updateSingleTask(data) {
            //     const tasks = data[0].body.tasks;
            //     for (var i = 0; i < data.length; i++) {
            //         tasks.push(data[i].tasks);
            //     }

            return res.status(200).send('Updated successfully!');
        });
    });

    // Return router
    return router;
}

module.exports = TodoListRoute;