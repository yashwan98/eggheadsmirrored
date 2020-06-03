const mongoose = require('mongoose');
const config = require('../config/database');

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

//create a counter collection
var dbo = db.useDb("eggheads");
dbo.createCollection("counter", function (err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
});

//insert a document
var myobj = {
    user_id: "item_id", 
    sequence_value: 0
 };
dbo.collection("counter").insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
});
