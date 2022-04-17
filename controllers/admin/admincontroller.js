var alert = require('alert');

const usrDetails = require('../../models/user');
const crypto = require("crypto");
const login = require('../../models/login');
const deletedUsrDetails = require('../../models/userDelete');
const deletedLogin = require('../../models/loginDelete');
const approvalLogin = require('../../models/loginApproval');
const approvalUser = require('../../models/userApproval');
const logs = require('../../models/logs');


const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = "6fa979f20126cb08aa645a8f495f6d85";
const iv = crypto.randomBytes(16);


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbCon;






MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    // console.log("Database created!");
    dbCon = db.db("mydatabase");
    // db.close();
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



function encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}


function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}



const adminLogin = (req, res) => {
    req.session.auth = false;
    dbCon.collection("admin").find({}).toArray(function (err, result1) {
        if (err) throw err;
        var count = result1.length;
        if (count == 0) {
            alert('Create an admin account first before using this app')
            res.render('./admin/adminRegister');
        }
        else {
            res.render('./admin/adminLogin');
            
        }
    });
}


const register = (req, res) => {
    dbCon.collection("admin").find({}).toArray(function (err, result1) {
        if (err) throw err;
        var count = result1.length;
        if (count == 0) {
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
        password = await hash(req.body.password);
        secquestion = await hash(req.body.securityAnswer);

        var registerData = {
            "username": encrypt(req.body.username),
            "password": password,
            "securityAnswer": secquestion,
            "email": encrypt(req.body.email)
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
    run()

}


const verification = (req, res) => {
    var pass = req.body.password;
    var user;
    dbCon.collection("admin").findOne({}, async function (err, res1) {
        if (res1 != null) {
            user = decrypt(res1.username);
            k = await verify(pass, res1.password);
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
            user = decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                async function data(){
                result =  usrDetails.find().sort({ username: -1 });
                result1 = login.find().sort({ username: -1 });
                allDetails = [await result, await result1];
                res.render('./admin/adminEmpTable', { "data": allDetails[0], "name": user, "req": req, "log":allDetails[1] });
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
            user = decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                async function data(){
                var result =  approvalUser.find().sort({ username: -1 });
                var result1 = approvalLogin.find().sort({ username: -1 });
                var role1 = dbCon.collection("role").find({}).toArray();
                allDetails = [await result, await result1, await role1];
                res.render('./admin/approvalEmpTable', { "data": allDetails[0], "name": user, "req": req, "log":allDetails[1], "role1": allDetails[2]});
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
            user = decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                async function data(){
                result =  deletedUsrDetails.find().sort({ username: -1 });
                result1 = deletedLogin.find().sort({ username: -1 });
                allDetails = [await result, await result1];
                res.render('./admin/adminDeleted', { "data": allDetails[0], "name": user, "req": req, "log":allDetails[1] });
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
            user = decrypt(res1.username);
            async function run() {
                var k = await verify(secQuestion, res1.securityAnswer);
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
        password = await hash(req.body.password);
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
            user = decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                async function data(){
                result =  await logs.find().sort({ createdAt: 1 });
                res.render('./admin/adminLogs', { "data": result, "name": user});
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