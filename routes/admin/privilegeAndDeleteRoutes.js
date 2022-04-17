const express = require('express');
const privilegeAndDelete = require('../../controllers/admin/privilegeAndDeletecontroller');

const router = express.Router();


router.get('/edit/:usr', privilegeAndDelete.edit);
router.post('/edit', privilegeAndDelete.save);
router.get('/delete/:usr', privilegeAndDelete.deleteEmp);
router.get('/restore/:usr', privilegeAndDelete.restore);
router.get('/permdelete/:usr', privilegeAndDelete.permDelete);
router.post('/approve/:usr', privilegeAndDelete.approve);

module.exports = router;