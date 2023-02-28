var alert = require('alert');
const usrDetails = require('../../models/user');
const login = require('../../models/login');
const deletedUsrDetails = require('../../models/userDelete');
const deletedLogin = require('../../models/loginDelete');
const approvalLogin = require('../../models/loginApproval');
const approvalUser = require('../../models/userApproval');
const otpDB = require('../../models/otp');
const logs = require('../../models/logs');
const otpGenerator = require('otp-generator')
const mail = require('./mailer');
const cryptography = require('../encryptandhashcontroller');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbCon;



MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbCon = db.db("mydatabase");
});




const adminLogin = (req, res) => {
    req.session.auth = false;
    dbCon.collection("admin").find({}).toArray(function (err, result1) {
        if (err) throw err;
        var count = result1.length;
        if (count == 0) {
            alert('Create an admin account first before using this app')
            res.redirect('/admin/register');
        }
        else {
            res.render('./admin/adminLogin');

        }
    });
}


const register = (req, res) => {
    dbCon.collection("admin").find({}).toArray(async function (err, result1) {
        if (err) throw err;
        var count = result1.length;
        if (count == 0) {
            var otpData = otpGenerator.generate(8);
            const otp = new otpDB({ "otp": otpData });
            mail.mail1(otpData);
            await otp.save();
            console.log(otpData);
            res.render('./admin/adminRegister');
        }
        else {
            alert('admin account already exists');
            res.redirect('/admin');
        }
    });
}





const adminSignUp = (req, res) => {
    async function run() {
        password = await cryptography.hash(req.body.password);
        secquestion = await cryptography.hash(req.body.securityAnswer);
        var otpdata = await otpDB.findOne({});
        if (req.body.otp == otpdata.otp) {
            var registerData = {
                "username": cryptography.encrypt(req.body.username),
                "password": password,
                "securityAnswer": secquestion,
                "email": cryptography.encrypt(req.body.email)
            };

            dbCon.collection("admin").find({}).toArray(function (err, res1) {
                if (err) throw err;
                var count = res1.length;
                if (count == 0) {
                    async function insertData() {
                        var adminInfo = await dbCon.collection("admin").insertOne(registerData);
                        res.redirect('/');
                    }
                    insertData();
                }
                else {
                    res.redirect('/admin');
                }
            });
        }
        else {
            alert('OTP does not match');
        }
    }
    run()

}


const verification = (req, res) => {
    var pass = req.body.password;
    var user;
    dbCon.collection("admin").findOne({}, async function (err, res1) {
        if (res1 != null) {
            user = cryptography.decrypt(res1.username);
            k = await cryptography.verify(pass, res1.password);
            if (k && (user == req.body.username)) {
                req.session.auth = true;
                req.session.user = user;
                req.session.role = 'full';
                res.redirect('/admin/emptable');
            }
            else {
                res.redirect('/admin');
            }
        }
        else {
            res.redirect('/admin');
        }
    });


};



const displayDetails = (req, res) => {
    var user;
    var allDetails;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = cryptography.decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                async function data() {
                    result = usrDetails.find().sort({ username: -1 });
                    result1 = login.find().sort({ username: -1 });
                    allDetails = [await result, await result1];
                    res.render('./admin/adminEmpTable', { "data": allDetails[0], "name": user, "req": req, "log": allDetails[1] });
                }
                data();
            }
            else {
                res.redirect('/admin');
            }
        }
        else {
            res.redirect('/admin');
        }
    });
}



const approvalDetails = (req, res) => {
    var user;
    var allDetails;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = cryptography.decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                async function data() {
                    var result = approvalUser.find().sort({ username: -1 });
                    var result1 = approvalLogin.find().sort({ username: -1 });
                    var role1 = dbCon.collection("role").find({}).toArray();
                    allDetails = [await result, await result1, await role1];
                    res.render('./admin/approvalEmpTable', { "data": allDetails[0], "name": user, "req": req, "log": allDetails[1], "role1": allDetails[2] });
                }
                data();
            }
            else {
                res.redirect('/admin');
            }
        }
        else {
            res.redirect('/admin');
        }
    });
}





const trashDisplay = (req, res) => {
    var user;
    var allDetails;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = cryptography.decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                async function data() {
                    result = deletedUsrDetails.find().sort({ username: -1 });
                    result1 = deletedLogin.find().sort({ username: -1 });
                    allDetails = [await result, await result1];
                    res.render('./admin/adminDeleted', { "data": allDetails[0], "name": user, "req": req, "log": allDetails[1] });
                }
                data();
            }
            else {
                res.redirect('/admin');
            }
        }
        else {
            res.redirect('/admin');
        }
    });
}





const logout = (req, res) => {
    req.session.destroy(function () {
        res.redirect('/admin');
    });
}



const forgot = (req, res) => {
    res.render("./admin/adminForgot");
}



const forget = (req, res) => {
    var secQuestion = req.body.securityAnswer;
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (err) throw err;
        if (res1 != null) {
            user = cryptography.decrypt(res1.username);
            async function run() {
                var k = await cryptography.verify(secQuestion, res1.securityAnswer);
                if (k && (req.body.username == user)) {
                    res.render("./admin/adminPassword");
                }
                else {
                    res.redirect("/admin/forgot");
                    alert('User and Security Question Answer does not match');
                }
            }
            run();
        }
        else {
            res.redirect("/admin/forgot");
            alert('User and Security Question Answer does not match');
        }

    });

}


const changePass = (req, res) => {
    var password;
    async function run() {
        password = await cryptography.hash(req.body.password);
        var registerData = {
            "password": password,
        };
        if (req.body.password == req.body.cpassword) {
            dbCon.collection("admin").updateOne({}, { $set: registerData }, function (err, res1) {
                if (err) throw err;
                res.redirect('/admin');
                alert('Password Updated Successfully');
            });
        }
        else {
            res.redirect("/admin/forgot");
            alert('Password Does Not Match');
        }
    }

    run();

}


const logDetails = (req, res) => {
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = cryptography.decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                async function data() {
                    if (req.query.specifiedUser == undefined) {
                        result = await logs.find().sort({ createdAt: 1 });
                        res.render('./admin/adminLogs', { "data": result, "name": user });
                    }
                    else {
                        result = await logs.find({"username": req.query.specifiedUser}).sort({ createdAt: 1 });
                        res.render('./admin/adminLogs', { "data": result, "name": user });
                    }
                }
                data();
            }
            else {
                res.redirect('/admin');
            }
        }
        else {
            res.redirect('/admin');
        }
    });
}


module.exports = {
    adminLogin,
    register,
    adminSignUp,
    verification,
    displayDetails,
    logout,
    forgot,
    forget,
    changePass,
    trashDisplay,
    approvalDetails,
    logDetails

}