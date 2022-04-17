const express = require('express');
const loginController = require('../../controllers/users/logincontroller');

const router = express.Router();

router.get('/', loginController.loginAcc);
router.get('/logout', loginController.logout);
router.post('/verify', loginController.verification);
router.get('/forgot', loginController.forgot);
router.post('/forgot', loginController.forget);
router.post('/changepass', loginController.changePass);


module.exports = router;