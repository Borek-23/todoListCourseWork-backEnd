// This service will have a function which will allow storing thing for now
// hat is an npm module that generates IDs
function TodoListService(todoListModel) {
    // Here is a function called save that accepts my new 'todoList' and will have callback
    // Callback is necessary because this is an I/O operation on the database
    this.save = function SaveTodoList(body) {
        return new Promise((resolve, reject) => {
            // Creating new collection todolist and setting name and description to be set on call
            var newTodoList = new todoListModel(body);
            newTodoList.save(function (err, savedTodoList) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                return resolve(savedTodoList);
            });
        })
    };

    // Now I need a function that finds all the lists and accepts a callback
    this.findAll = function FindAllTodoLists(callback) {
        // Use find method to find everything that is in the database
        return todoListModel.find({}, callback);
    };

    // Now to add the function that will actually find stuff by its ID
    this.findById = function FindTodoListById(id, callback) {
        // Use findById method supplying ID on call
        return todoListModel.findById(id, callback);
    };

    // Function that will delete all entries from database
    this.deleteAll = function DeleteAllTodoLists(callback) {
        return todoListModel.deleteMany({}, callback);
    };

    this.deleteById = function DeleteTodoListById(id, callback) {
        // Find the item by ID then report fetch the object
        return todoListModel.findById(id, function (err, foundTodoList) {
            if (err) {
                console.error(err);
                return callback(err);
            }

            // If you have the object, remove it, else report an error
            return foundTodoList.remove(function (err) {
                return callback(err);
            });
        });
    };

    this.updateById = function (id, object, callback) {
        return todoListModel.findOneAndUpdate({_id: id}, object, callback);
    };

    // Return the service
    return this;

}

module.exports = TodoListService;

