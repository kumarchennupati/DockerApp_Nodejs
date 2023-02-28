const commandExec = require('./commandcontroller');
const alert = require('alert');



const network = (req, res) => {
    if (req.session.auth == true) {
        var homePath;
        if (req.session.role == 'full') {
            homePath = '/docker/admin';
        }
        else {
            homePath = '/docker';
        }
        urlPath = req.protocol + '://' + req.get('host') + '/docker/';
        res.render('./docker/networks', { "name": req.session.user, "output": "Output will be displayed here .. .. .. .. .. ..", "cmd": "Final Command will be displayed here", "urlPath": urlPath, "homePath": homePath });
    }
    else {
        res.redirect('/');
    }
}


const netlist = (req, res) => {
    if (req.session.auth == true) {
        if (req.session.role != 'None') {
            cmd = "sudo docker network ls";
            commandExec.shCommand(cmd,req.session.user,res);
        }

        else {
            alert('No permission to access');
        }

    }
    else {
        res.redirect('/login');
    }
}


const netcreate = (req, res) => {
    if (req.session.auth == true) {
        var access = req.session.role;
        if ((access == 'ReadandRun') | (access == 'All') | (access == 'full')) {
            const name = req.body.name;
            const driver = req.body.driver;
            const subnet = req.body.subnet;
            const gateway = req.body.gateway;
            cmd = "sudo docker network create --driver=" + driver + ' ';
            if (subnet != '') {
                cmd = cmd + '--subnet=' + subnet + ' ';
            }
            if (gateway != '') {
                cmd = cmd + '--gateway=' + gateway + ' ';
            }
            cmd = cmd + name;
            commandExec.shCommand(cmd,req.session.user,res);
        }
        else {
            alert('No permission to Run the command');
        }
    }
    else {
        res.redirect('/login');
    }
}


const netconnect = (req, res) => {
    if (req.session.auth == true) {
        var access = req.session.role;
        if ((access == 'ReadandRun') | (access == 'All') | (access == 'full')) {
            const name = req.body.name;
            const contname = req.body.contname;
            const specificip = req.body.specificip;
            cmd = "sudo docker network connect ";
            if (specificip != '') {
                cmd = cmd + "--ip " + specificip + " ";
            }
            cmd = cmd + name + " " + contname;
            commandExec.shCommand(cmd,req.session.user,res);
        }
        else {
            alert('No permission to Run the command');
        }
    }
    else {
        res.redirect('/login');
    }
}


const netdetach = (req, res) => {
    if (req.session.auth == true) {
        var access = req.session.role;
        if ((access == 'ReadandRun') | (access == 'All') | (access == 'full')) {
            const name = req.body.name;
            const contname = req.body.contname;
            cmd = "sudo docker network disconnect "+name+" "+contname;
            commandExec.shCommand(cmd,req.session.user,res);
        }
        else {
            alert('No permission to Run the command');
        }
    }
    else {
        res.redirect('/login');
    }
}



module.exports = {
    network,
    netlist,
    netcreate,
    netconnect,
    netdetach
}