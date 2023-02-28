const express = require('express');
const dockerContainerController = require('../../controllers/docker/dockercontainerscontroller');
const dockerMainpageController = require('../../controllers/docker/dockermainpagecontroller');
const dockerImageController = require('../../controllers/docker/dockerimagescontroller');
const dockerNetworkController = require('../../controllers/docker/dockernetworkcontroller');
const dockerDeleteController = require('../../controllers/docker/dockerdeletecontroller');
const dockerFileController = require('../../controllers/docker/dockerfilecontroller');


const router = express.Router();

router.get('/', dockerMainpageController.indexpage);
router.get('/admin', dockerMainpageController.adminindexpage);


router.get('/container', dockerContainerController.container);
router.post('/contlist', dockerContainerController.contlist);
router.post('/stopcont', dockerContainerController.stopcont);
router.get('/launchcont', dockerContainerController.launchcont);
router.post('/runcont', dockerContainerController.runcont);
router.post('/startcont', dockerContainerController.startcont);


router.get('/image', dockerImageController.image);
router.post('/imglist', dockerImageController.imglist);
router.post('/imgcreate', dockerImageController.imgcreate);
router.post('/imgpull', dockerImageController.imgpull);


router.get('/network', dockerNetworkController.network);
router.post('/netlist', dockerNetworkController.netlist);
router.post('/netcreate', dockerNetworkController.netcreate);
router.post('/netconnect', dockerNetworkController.netconnect);
router.post('/netdetach', dockerNetworkController.netdetach);



router.get('/deletion', dockerDeleteController.deletion);
router.post('/resourcedelete', dockerDeleteController.resourcedelete);
router.post('/allresourcedelete', dockerDeleteController.allresourcedelete);
router.post('/resourceprune', dockerDeleteController.resourceprune);


router.get('/dockerfile', dockerFileController.dockerfile);


module.exports = router;