'use strict';
var http = require('http');
var port = process.env.PORT || 3000;
var db;     // Is used for database later

var bodyParser = require("body-parser");
var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public"));

var defaultResult =
    {
        "_id": {
            "$oid": "59a1516df36d28069b4dc77c"
        },
        "message": "Default Answer for Woj-Chat"
    };

var defaultAnswer =
    {
        category: "default",
        message: "Nice answers mate",
        questions: "Whaaat?"
    };

var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
mongoClient.connect('mongodb://Joonas:Joonas@ds155150.mlab.com:55150/joonasaaltonen',
    (err, database) =>
    {
        console.log("Connecting to database");
        if (err) return console.log(err + " jeee");
        db = database;
    });



app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () =>
    {
        console.log("Listening to port " + port);
    });

app.get("/",
    function(req, res)
        {
        res.render("chat.ejs", {qResult : defaultResult}); // pass qResult var to chat.ejs with value defaultResults
    });

app.get("/addAnswers",
    function(req, res)
        {
        res.render("answers.ejs", {answers: defaultAnswer });
        });

app.post('/query',
    (req, res) =>
    {
        console.log(req.body);
        //console.log("POSSIBLE QUERY RETURN!? " + SearchMessage(req.body));
        var answers = SearchMessage(req.body);
        var query = { category: answers.category, questions: answers.questions, message: answers.message };
        db.collection("answers").find(query).toArray(function (err, results) {
            if (err) {
                throw err;
            }
            results = RandomizeAnswer(results);     // Pick random one from the array of 
            res.render("chat.ejs", { qResult: results });       // THIS GOD DAMN LINE NEEDS TO BE _IN_ THE QUERY FUNCTION TO WORK
        });
    });

app.post("/addAnswer",
    (req, res) =>
    {
        console.log(JSON.stringify(req.body).toLowerCase());
        db.collection("answers").save(req.body,
            (err, result) =>
            {
                if (err) return console.log(err);
                console.log('Saved to database!');
                
            });
        res.render("answers.ejs", {answers: defaultAnswer});
    });

app.post("/showAnswers", (req, res) =>
{
    db.collection("answers").find({ message: /^/ }).toArray(function (err, results) {
        if (err) {
            throw err;
        }
        res.render("answers.ejs", { answers: results });       // THIS GOD DAMN LINE NEEDS TO BE _IN_ THE QUERY FUNCTION TO WORK
        });
})

function SearchMessage(msg)
{
    var message = JSON.stringify(msg).toLowerCase();
    var answer =
        {
            category: "",
            questions: "",
            message: ""
        };
    
    if (message === "") {
        answer.message = "Mind stop asking me nothing?";
    }
    else if (message.search("food") >= 0) {
        answer.category = "food";
        if (message.search("what") >= 0)
        {
            answer.questions = "what";
        }
    }
    else if (message.search("you") >= 0)
    {
        answer.category = "personal";
        if (message.search("who") >= 0)
        {
            answer.questions = "who";
        }
        if (message.search("how") >= 0) {
            answer.questions = "how";
        }
    }
    else {
        answer.category = "default";
    }

    // Flying spaghetti monster 
    if (answer.category === "") answer.category = new RegExp(/^/);
    if (answer.questions === "") answer.questions = new RegExp(/^/);
    if (answer.message === "") answer.message = new RegExp(/^/);

    // To see if the object is behaving accordingly
    var answerDetails = Object.getOwnPropertyNames(answer);
    var i = 0;      // Can't fit into loop declaration..?
    for (var prop in answer)
    {
        console.log(answerDetails[i] + ": " + answer[prop]);
        i++;
    }

    return answer;
}

function RandomizeAnswer(queryResults)
{
    var qLenght = queryResults.length;
    var rand = Math.floor((Math.random() * qLenght));
    return queryResults[rand];
}

// WORKING MONGODB QUERY DO NOT REMOVE, WRITE ANOTHER ONE IF YOU WANT TO WANK WITH IT
//app.post('/query',
//    (req, res) => {
//        console.log(req.body);
//        var query = { message: /^D/ };
//        db.collection("answers").find(query).toArray(function (err, results) {
//            if (err) {
//                throw err;
//            }
//            console.log(results);
//            console.log(results[0].message);
//            res.render("chat.ejs", { qResult: results });       // THIS GOD DAMN LINE NEEDS TO BE _IN_ THE QUERY FUNCTION TO WORK
//            });
//    });
// WORKING MONGODB QUERY DO NOT REMOVE, WRITE ANOTHER ONE IF YOU WANT TO WANK WITH IT