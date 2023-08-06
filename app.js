require('dotenv').config();
const express=require('express');
const expressLayouts = require('express-ejs-layouts');
const exxpressLayout=require('express-ejs-layouts');
const methodOverride=require('method-override');
const connectDB=require('./server/config/db');
const session=require('express-session');
const passport=require('passport');
const mongoStore=require('connect-mongo')

const app=express();
const port=5000 || process.env.PORT;
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(methodOverride("_method"));

app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    store: mongoStore.create({
        mongoUrl: process.env.mongodb_uri
    }),
    cookie:{maxAge: new Date(Date.now()+(360000000))}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('Public')); //All static files will be contained in this folder
app.use(expressLayouts);
app.set('layout','./layouts/main'); //This defalut main layout will be used for pages
app.set('view engine','ejs');  // Any page demanded will be searched in views folder

connectDB();

app.use('/',require('./server/routes/index'));
app.use('/',require('./server/routes/dashboard'));
app.use('/',require('./server/routes/auth'))

app.get('*',function(req,res){
    res.status(404).render('404')
});

app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
});