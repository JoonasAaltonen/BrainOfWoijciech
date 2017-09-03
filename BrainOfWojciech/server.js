'use strict';
var http = require('http');
var port = process.env.PORT || 3000;
var db;     // Is used for database later

var bodyParser = require("body-parser");
var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public"));

var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
mongoClient.connect('mongodb://Joonas:Joonas@ds155150.mlab.com:55150/joonasaaltonen',
    (err, database) =>
    {
        console.log("yhdistetään kantaan2");
        if (err) return console.log(err + " jeee");
        db = database;
        app.listen(port,
            () =>
            {
                console.log('Kuunnellaan porttia:3000');
            });
    });



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () =>
    {
        console.log("Listening to port 3000");
    });

app.get("/",
    function(req, res)
        {
        res.render("chat.ejs");
        });

app.post('/query',
    (req, res) =>
    {
        var query = { message: /^D/ };
        var queryResult = "";
        db.collection("answers").find(query).toArray(function(err, result)
            {
            if (err) throw err;
            console.log(result);
            queryResult = result;
            });
        res.render("chat.ejs", { answers: queryResult });
    });

// WORKING MONGODB QUERY DO NOT REMOVE, WRITE ANOTHER ONE IF YOU WANT TO WANK WITH IT
//app.post('/query',
//    (req, res) =>
//    {
//        var query = { message: /^D/ };
//        db.collection("answers").find(query).toArray(function(err, result)
//            {
//            if (err) throw err;
//            console.log(result);
//            db.close();
//            });
//    });
// WORKING MONGODB QUERY DO NOT REMOVE, WRITE ANOTHER ONE IF YOU WANT TO WANK WITH IT