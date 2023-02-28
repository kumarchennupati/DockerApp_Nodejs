var alert = require('alert');
const usrDetails = require('../../models/user');
const department = require('../../models/department');
const deletedLogin = require('../../models/loginDelete');
const deletedUsrDetails = require('../../models/userDelete');
const approvalLogin = require('../../models/loginApproval');
const approvalUser = require('../../models/userApproval');
const login = require('../../models/login');
const cryptography = require('../encryptandhashcontroller');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dbCon;



MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    dbCon = db.db("mydatabase");
});

async function dataTransfer(req, res, destPath, userSource, userDestination, loginSource, loginDestination, approvalRequest) {
    async function deleteUserData() {
        var doc = await userSource.findOne({ "username": req.params.usr });
        var data = {"username":doc.username,"name":doc.name,"email":doc.email,"department":doc.department,"city":doc.city,"contact":doc.contact};
        const user = new userDestination(data);
        await user.save();
        await userSource.deleteOne({ "username": req.params.usr });
        return true
    }

    async function deleteLoginData() {
        var doc = await loginSource.findOne({ "username": req.params.usr });
        var data = {"username":doc.username,"password":doc.password,"securityAnswer":doc.securityAnswer,"role":doc.role};
        if (approvalRequest) {
            data.role = req.body.role2;
            const user = new loginDestination(data);
            await user.save();
        }
        else {
            const user = new loginDestination(data);
            await user.save();
        }
        await loginSource.deleteOne({ "username": req.params.usr });
        return true

    }
    a = [await deleteUserData(), await deleteLoginData()];
    res.redirect(destPath);
}



async function deleteData(res, destPath, usr, userSource, loginSource) {
    var deleteuser = userSource.findOneAndDelete({ "username": usr });
    var deletelogin = loginSource.findOneAndDelete({ "username": usr });
    allDetails = [await deleteuser, await deletelogin];
    res.redirect(destPath);
}



const edit = (req, res) => {
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = cryptography.decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                var usr = req.params.usr;
                async function editData() {
                    var userInfo = usrDetails.findOne({ "username": usr });
                    var depInfo = department.find().sort({ createdAt: -1 });
                    var loginInfo = login.findOne({ "username": usr });
                    var role1 = dbCon.collection("role").find({}).toArray();
                    allDetails = [await userInfo, await depInfo, await loginInfo, await role1];
                    res.render('./admin/adminProfile', { "name": user, "info": allDetails[0], "department": allDetails[1], "log": allDetails[2], role1: allDetails[3] });
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
    async function update() {
        var user = new usrDetails(req.body);
        var user1 = new login(req.body);
        data1 = usrDetails.findOne({ "username": req.body.username });
        data2 = login.findOne({ "username": req.body.username });
        uid = [await data1, await data2];
        user._id = uid[0]._id;
        user1._id = uid[1]._id;
        result = usrDetails.findByIdAndUpdate(uid[0]._id, { $set: user });
        result1 = login.findByIdAndUpdate(uid[1]._id, { $set: user1 });
        var process = [await result, await result1];
        res.redirect('/admin/emptable');
    }
    update();
}




const deleteEmp = (req, res) => {
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = cryptography.decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                var destPath = '/admin/emptable';
                dataTransfer(req, res, destPath, usrDetails, deletedUsrDetails, login, deletedLogin, false);
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




const restore = (req, res) => {
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = cryptography.decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                var destPath = '/admin/deleteddata';
                dataTransfer(req, res, destPath, deletedUsrDetails, usrDetails, deletedLogin, login, false);
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



const permDelete = (req, res) => {
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = cryptography.decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                var usr = req.params.usr;
                var destPath = '/admin/deleteddata';
                deleteData(res, destPath, usr, deletedUsrDetails, deletedLogin);
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

const approve = (req, res) => {
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = cryptography.decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                var destPath = '/admin/approvaltable';
                dataTransfer(req, res, destPath, approvalUser, usrDetails, approvalLogin, login, true);
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




const reject = (req, res) => {
    var user;
    dbCon.collection("admin").findOne({}, function (err, res1) {
        if (res1 != null) {
            user = cryptography.decrypt(res1.username);
            if (req.session.auth == true && req.session.user == user) {
                var usr = req.params.usr;
                var destPath = '/admin/approvaltable';
                deleteData(res, destPath, usr, approvalUser, approvalLogin);
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
    approve,
    reject

}