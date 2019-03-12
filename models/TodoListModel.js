// This function will accept MongoDB
function TodoListModel(mongoose) {
    var schema = mongoose.Schema({
        name: String,
        description: String,
        status: {
            type: String
        },
        // This will assign its own date now formatted appropriately to UK timezone
        listCreatedOn: {
            type: String, default: function dateFormatter() {
                var date = new Date();
                var dayTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                var fullDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                return fullDate + "-" + dayTime
            }
        },
        tasks: [{
                type: String
            }
        ]
    });

    // Return model using collection reference and collection name
    return mongoose.model('todolist', schema, 'todolist');
}

module.exports = TodoListModel;

