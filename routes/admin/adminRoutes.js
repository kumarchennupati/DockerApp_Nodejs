const express = require('express');
const adminController = require('../../controllers/admin/admincontroller');

const router = express.Router();


router.get('/', adminController.adminLogin);
router.get('/register', adminController.register);
router.post('/register', adminController.adminSignUp);
router.post('/verify', adminController.verification);
router.get('/emptable', adminController.displayDetails);
router.get('/logout', adminController.logout);
router.get('/forgot', adminController.forgot);
router.post('/forgot', adminController.forget);
router.post('/changepass', adminController.changePass);
router.get('/deleteddata', adminController.trashDisplay);
router.get('/approvaltable', adminController.approvalDetails);
router.get('/logs', adminController.logDetails);



module.exports = router;