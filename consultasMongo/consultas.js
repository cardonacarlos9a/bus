var MongoClient = require('mongodb').MongoClient;
module.exports = {
    FindinCol1: function() {
        return MongoClient.connect('mongodb://' + process.env.IP).then(function(db) {
            var collection = db.collection('students');
            var query = { estado: "suspendido" };
            db.close;

            return collection.find(query).toArray();
        }).then(function(items) {
            console.log(items);
            return items;
        });
    }
};
