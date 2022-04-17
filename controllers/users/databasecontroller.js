const usrDetails = require('../../models/user');
const login = require('../../models/login');
const deletedLogin = require('../../models/loginDelete');
const deletedUsrDetails = require('../../models/userDelete');
const department = require('../../models/department');
const approvalLogin = require('../../models/loginApproval');
const approvalUser = require('../../models/userApproval');
const crypto = require("crypto")
var alert = require('alert');




async function hash(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(8).toString("hex")

        crypto.scrypt(password, salt, 256, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'))
        });
    })
}



const signup = (req, res) => {
    async function insertData() {
    result = await login.find({ "username": req.body.username });
    result1 = await approvalLogin.find({ "username": req.body.username });
            if (result.length == 0 && result1.length == 0) {
                    req.body.password = await hash(req.body.password);
                    req.body.securityAnswer = await hash(req.body.securityAnswer);
                    var empdepInfo;
                    const user = new approvalUser(req.body);
                    const loginDetails = new approvalLogin(req.body);
                    empdepInfo = [await user.save(), await loginDetails.save()];
                    res.redirect('/');
                }

            else {
                alert('User already exists');
                res.redirect('/');
            }
        }
        insertData();
}




const register = (req, res) => {
    department.find().sort({ createdAt: -1 })
        .then(result => {
            res.render("./users/register", { "dep": result });
        })
        .catch(err => {
            console.log(err);
        });
}



const displayDetails = (req, res) => {
    if (req.session.auth == true) {
        usrDetails.find().sort({ createdAt: -1 })
            .then(result => {
                res.render('./users/table', { "data": result, "name": "kumar", "req": req });
            })
            .catch(err => {
                console.log(err);
            });
    }
    else {
        res.redirect('/');
    }
}




const edit = (req, res) => {
    if (req.session.auth == true) {
        var pid = req.params.id;
        async function editData() {
            var userInfo = usrDetails.findById(pid);
            var depInfo = department.find().sort({ createdAt: -1 });
            allDetails = [await userInfo, await depInfo];
            if (req.session.user == allDetails[0].username) {
                res.render('./users/profile', { "name": "kumar", "info": allDetails[0], "department": allDetails[1] });
            }
            else {
                alert('Not allowed');
                res.redirect('/user/table')
            }
        }
        editData();
    }
    else {
        res.redirect('/');
    }
};




const save = (req, res) => {
    var user = new usrDetails(req.body);
    usrDetails.findByIdAndUpdate(req.body._id, { $set: user })
        .then(result => {
            res.redirect('/user/table');
        })
        .catch(err => {
            console.log(err);
            // res.render('404', { title: 'Blog not found' });
        });
}



module.exports = {

    register,
    signup,
    displayDetails,
    edit,
    save
}