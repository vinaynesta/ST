const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

var mongojs = require('mongojs')
global.db = mongojs("mongodb+srv://Vinay:Vinay@sharktank.kodai7z.mongodb.net/DataBase");

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Vinay:Vinay@sharktank.kodai7z.mongodb.net/DataBase", {
useNewUrlParser: true,
useUnifiedTopology: true
});

const portfolioSchema = {
idea: String,
demoVideoLink:String,
ask: Number,
equity:Number,
evaluation:Number,
mobileNumber:Number,
email:String,
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
    res.render("index");
})

app.get("/login",function(req,res){
    res.render("logIn");
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

/*app.post("/login",function(req,res){
    const uid = req.body.email;
    const psw = req.body.psw;
    console.log(uid);
    console.log(psw);
    const x=db.users.find( { email: uid } );
    console.log("x",x);
    res.redirect("/find");
})*/

app.post("/login",function(req,res){
    let p=req.body.psw;
    Users.findById('63ef0d615423deead6e806c3').then((result)=>{
        let x=result;
        console.log(x);
        console.log(x.email);
        console.log("psw",p);
        if(result.password===p){
            res.redirect("/find");
        }
        else{
            res.send("Oops! Something went wrong.");
        }
    }).catch((err)=>{
        console.log(err);
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
    
    const port = new portfolio({
    idea: req.body.idea,
    ask: req.body.ask,
    equity: req.body.equity,
    evaluation: req.body.evaluation,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    demoVideoLink: req.body.demoVideoLink
     });  
    console.log(port);
    
    port.save();
 
    res.redirect("/find");
});

app.listen(8000, function(){
	console.log("App is running on Port 8000");
});
