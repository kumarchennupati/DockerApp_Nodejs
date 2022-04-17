const login = require('../../models/login');
const crypto = require("crypto");
var alert = require('alert');



var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbCon;



MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbCon = db.db("mydatabase");
});




async function verify(password, hash) {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":")
        crypto.scrypt(password, salt, 256, (err, derivedKey) => {
            if (err) reject(err);
            resolve(key == derivedKey.toString('hex'))
        });
    })
}


async function hash(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(8).toString("hex")

        crypto.scrypt(password, salt, 256, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'))
        });
    })
}




const verification = (req, res) => {
    var pass = req.body.password;

    async function run() {

        result = await login.findOne({ "username": req.body.username });
        if (result != null) {
            var k = await verify(pass, result.password);
            if (k) {
                req.session.auth = true;
                req.session.user = req.body.username;
                req.session.role = result.role;
                res.redirect('/user/table');
            }
            else {
                res.redirect('/');
            }
        }
        else {
            res.redirect('/');
        }
    }
    run();
};



const logout = (req, res) => {
    req.session.destroy(function () {
        res.redirect('/');
    });
}


const loginAcc = (req, res) => {
    req.session.auth = false;
    dbCon.collection("admin").find({}).toArray(function (err, result1) {
        if (err) throw err;
        var count = result1.length;
        if (count == 0) {
            alert('Create an admin account first before using this app')
            res.render('./admin/adminRegister');
        }
        else {
            res.render('./users/login');
            
        }
    });
}


const forgot = (req, res) => {
    res.render("./users/forgot");
}




const forget = (req, res) => {
    var secQuestion = req.body.securityAnswer;
    async function run() {
        var forgot = { 'username': req.body.username };
        login.findOne(forgot, async function (err, res1) {
            if (err) throw err;
            if (res1 != null) {
                var k = await verify(secQuestion, res1.securityAnswer);
                if (k) {
                    res.render("./users/password");
                }
                else {
                    res.redirect("/forgot");
                    alert('User and Security Question Answer does not match');
                }
            }
            else {
                res.redirect("/forgot");
                alert('User and Security Question Answer does not match');
            }
        });
    }

    run();

}


const changePass = (req, res) => {
    var password;
    async function run() {
        password = await hash(req.body.password);
        var registerData = {
            "password": password,
        };
        if (req.body.password == req.body.cpassword) {
            login.findOneAndUpdate({ "username": req.body.username }, { $set: registerData }, function (err, res1) {
                if (err) throw err;
                res.redirect('/');
                alert('Password Updated Successfully');
            });
        }
        else {
            res.redirect("/forgot");
            alert('Password Does Not Match');
        }
    }

    run();

}


module.exports = {
    loginAcc,
    logout,
    verification,
    forgot,
    forget,
    changePass
}