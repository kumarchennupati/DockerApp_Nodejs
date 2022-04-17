const express = require('express');
const userController = require('../../controllers/users/databasecontroller');
const userValidator = require('../../validators/registervalidator');

const router = express.Router();

router.get('/register', userController.register);
router.get('/table', userController.displayDetails);
router.post('/register',userValidator.add, userController.signup);
router.get('/edit/:id', userController.edit);
router.post('/edit', userController.save);


module.exports = router;