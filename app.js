const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users/databaseRoutes');
const loginRoutes = require('./routes/users/loginRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
const privilegeAndDeleteRoutes = require('./routes/admin/privilegeAndDeleteRoutes');
const dockerRoutes = require('./routes/docker/dockerRoutes');
const app = express();



var MongoClient = require('mongodb').MongoClient;
var MongoStore = require('connect-mongo');
var session = require('express-session');
var { v4: uuidv4 } = require('uuid');
var url = "mongodb://localhost:27017/";
var mongoDB = 'mongodb://127.0.0.1/mydatabase';

var dbCon;

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    // console.log("Database created!");
    dbCon = db.db("mydatabase");
    // db.close();
});


app.set('trust proxy', 1) // trust first proxy
app.use(session({
    genid: function (req) {
        return uuidv4(); // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10000000 },
    store: MongoStore.create({ mongoUrl: mongoDB })
}))
//middleware
const myLogger = function (req, res, next) {
    res.set("Cache-Control", "no-cache, no-store, must-revalidate");
    next()
}
app.use(myLogger);




mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(3000))
    .catch(err => console.log(err));


app.set('view engine', 'ejs');


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});


app.use('/', loginRoutes);

app.use('/user', userRoutes);

app.use('/admin', adminRoutes);

app.use('/control', privilegeAndDeleteRoutes);

app.use('/docker', dockerRoutes);



