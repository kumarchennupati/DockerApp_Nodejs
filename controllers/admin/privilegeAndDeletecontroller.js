var alert = require('alert');

const usrDetails = require('../../models/user');
const department = require('../../models/department');
const deletedLogin = require('../../models/loginDelete');
const deletedUsrDetails = require('../../models/userDelete');
const approvalLogin = require('../../models/loginApproval');
const approvalUser = require('../../models/userApproval');



const crypto = require("crypto");
const login = require('../../models/login');
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

// Decrypting text
function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}




const edit = (req, res) => {
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                var usr = req.params.usr;
                async function editData() {
                    var userInfo = usrDetails.findOne({"username":usr});
                    var depInfo = department.find().sort({ createdAt: -1 });
                    var loginInfo = login.findOne({"username": usr});
                    var role1 = dbCon.collection("role").find({}).toArray();
                    allDetails = [await userInfo, await depInfo, await loginInfo, await role1];
                    res.render('./admin/adminProfile', { "name": user, "info": allDetails[0], "department": allDetails[1],"log":allDetails[2], role1: allDetails[3] });
                }
                editData();
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



const save = (req, res) => {
    async function update(){
    var user = new usrDetails(req.body);
    var user1 = new login(req.body);
    data1 = usrDetails.findOne({"username":req.body.username});
    data2 = login.findOne({"username":req.body.username});
    uid = [await data1, await data2];
    user._id=uid[0]._id;
    user1._id=uid[1]._id;
    result = usrDetails.findByIdAndUpdate(uid[0]._id, { $set: user });
    result1 = login.findByIdAndUpdate(uid[1]._id, { $set: user1 });
    var process = [await result, await result1];
    res.redirect('/admin/emptable');
    }
    update();
}




const deleteEmp =(req, res) => {
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                var usr = req.params.usr;
                async function deleteUserData() {
                    var userData = await usrDetails.findOne({"username":usr});
                    const userInfo = new deletedUsrDetails({
                        "username": userData.username,
                        "name":  userData.name,
                        "email": userData.email,
                        "department": userData.department,
                        "city": userData.city,
                        "contact": userData.contact,
                        "_id": userData._id
                    });
                    await userInfo.save();
                    deleteuser = await usrDetails.findOneAndDelete({"username":usr});
                    return true
                }

                async function deleteLoginData() {
                    var loginData = await login.findOne({"username":usr});
                    const loginInfo = new deletedLogin({
                        "username": loginData.username,
                        "password":  loginData.password,
                        "role": loginData.role,
                        "securityAnswer": loginData.securityAnswer,
                        "_id": loginData._id
                    });
                    await loginInfo.save();
                    deletelogin = await login.findOneAndDelete({"username":usr});
                    return true
                    
                }
                async function deleteEmp(){
                a = await deleteUserData();
                b = await deleteLoginData();
                res.redirect('/admin/emptable');
                }
                deleteEmp();
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




const restore =(req, res) => {
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                var usr = req.params.usr;
                async function deleteUserData() {
                    var userData = await deletedUsrDetails.findOne({"username":usr});
                    const userInfo = new usrDetails({
                        "username": userData.username,
                        "name":  userData.name,
                        "email": userData.email,
                        "department": userData.department,
                        "city": userData.city,
                        "contact": userData.contact,
                        "_id": userData._id
                    });
                    await userInfo.save();
                    deleteuser = await deletedUsrDetails.findOneAndDelete({"username":usr});
                    return true
                }

                async function deleteLoginData() {
                    var loginData = await deletedLogin.findOne({"username":usr});
                    const loginInfo = new login({
                        "username": loginData.username,
                        "password":  loginData.password,
                        "role": loginData.role,
                        "securityAnswer": loginData.securityAnswer,
                        "_id": loginData._id
                    });
                    await loginInfo.save();
                    deletelogin = await deletedLogin.findOneAndDelete({"username":usr});
                    return true
                    
                }
                async function deleteEmp(){
                a = await deleteUserData();
                b = await deleteLoginData();
                res.redirect('/admin/deleteddata');
                }
                deleteEmp();
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



const permDelete =(req, res) => {
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                var usr = req.params.usr;
                async function deleteData() {
                    var deleteuser = deletedUsrDetails.findOneAndDelete({"username":usr});
                    var deletelogin = deletedLogin.findOneAndDelete({"username":usr});
                    allDetails = [await deleteuser, await deletelogin];
                    res.redirect('/admin/deleteddata')
                }
                deleteData();
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

const approve =(req, res) => {
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                var usr = req.params.usr;
                async function approveUserData() {
                    var userData = await approvalUser.findOne({"username":usr});
                    const userInfo = new usrDetails({
                        "username": userData.username,
                        "name":  userData.name,
                        "email": userData.email,
                        "department": userData.department,
                        "city": userData.city,
                        "contact": userData.contact,
                        "_id": userData._id
                    });
                    await userInfo.save();
                    deleteuser = await approvalUser.findOneAndDelete({"username":usr});
                    return true
                }

                async function approveLoginData() {
                    var loginData = await approvalLogin.findOne({"username":usr});
                    const loginInfo = new login({
                        "username": loginData.username,
                        "password":  loginData.password,
                        "role": req.body.role2,
                        "securityAnswer": loginData.securityAnswer,
                        "_id": loginData._id
                    });
                    await loginInfo.save();
                    deletelogin = await approvalLogin.findOneAndDelete({"username":usr});
                    return true
                    
                }
                async function deleteEmp(){
                a = await approveUserData();
                b = await approveLoginData();
                res.redirect('/admin/approvaltable');
                }
                deleteEmp();
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
    edit,
    save,
    deleteEmp,
    restore,
    permDelete,
    approve

}