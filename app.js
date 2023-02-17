const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

var mongojs = require('mongojs')
global.db = mongojs("mongodb+srv://Vinay:Vinay@sharktank.kodai7z.mongodb.net/krishna");

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Vinay:Vinay@sharktank.kodai7z.mongodb.net/krishna", {
useNewUrlParser: true,
useUnifiedTopology: true
});

const portfolioSchema = {
idea: String,
ask: Number,
equity:Number,
evaluation:Number,
mobileNumber:Number,
email:String
};

const usersSchema = {
    userName :String,
    mobileNumber : Number,
    email: String,
    password: String,
    confirmPassword:String,
    ideas:[]
}

const portfolio = mongoose.model("portfolio", portfolioSchema);

const Users = mongoose.model("Users", usersSchema);


app.set("view engine", "ejs");
app.engine('ejs', require('ejs').__express);


app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.static(__dirname + '/public'));

app.get("/",(req,res)=>{
    res.send("Hello Bro");
})

app.get("/signup",function(req,res){
    res.render("signUp");
})

app.get("/portfolio", function(req, res){
	res.render("portfolio");
});


app.get("/profile",function(req,res){
    Users.find({},function(err,users){
        res.render("profile",{
            usersList :users
        })
    })
})


app.get("/find",function(req,res){
    portfolio.find({},function(err,ports){
        res.render("find",{
            portfolioList :ports
        })
    })
})

app.post("/signUp", function (req, res) {
	console.log(req.body.userName);
    const user = new Users({
    userName: req.body.userName,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
     });  
    console.log(user);
    user.save();
    res.redirect("/find");
});

app.post("/portfolio", function (req, res) {
	console.log(req.body.idea);
    console.log(req.body.userId);
    var ObjectId = require('mongodb').ObjectID;

    const port = new portfolio({
    idea: req.body.idea,
    ask: req.body.ask,
    equity: req.body.equity,
    evaluation: req.body.evaluation,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email
     });  
    console.log(port);
    
    port.save();

    let x = req.body.userId;
    let y = port._id;

    console.log("x",x);
    console.log("y",y);
    
    db.users.updateOne(
        { "_id.$oid" : x },
        { $push: { ideas: y } }
    );
     
    res.redirect("/find");
});

app.listen(8000, function(){
	console.log("App is running on Port 8000");
});
