const { exec } = require("child_process");
const alert = require('alert');
const logs = require('../../models/logs');



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
            function shCommand(cmd) {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    async function putlog() {
                        const logData = new logs({
                            "username": req.session.user,
                            "command": cmd,
                        });
                        await logData.save();
                        var out = { "cmd": cmd, "op": `${stdout}` }
                        var out1 = JSON.stringify(out);
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end(out1);
                    }
                    putlog();
                });

            }
            shCommand(cmd);
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
            function shCommand(cmd) {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    async function putlog() {
                        const logData = new logs({
                            "username": req.session.user,
                            "command": cmd,
                        });
                        await logData.save();
                        var output = "New Network created with name: " + name + ' and ID: ' + `${stdout}`;
                        var out = { "cmd": cmd, "op": output };
                        var out1 = JSON.stringify(out);
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end(out1);
                    }
                    putlog();
                });

            }
            shCommand(cmd);
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
            function shCommand(cmd) {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    async function putlog() {
                        const logData = new logs({
                            "username": req.session.user,
                            "command": cmd,
                        });
                        await logData.save();
                        var output = "Container named " + contname + " is connect to a network named " + name;
                        var out = { "cmd": cmd, "op": output };
                        var out1 = JSON.stringify(out);
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end(out1);
                    }
                    putlog();
                });

            }
            shCommand(cmd);
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
            function shCommand(cmd) {
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    async function putlog() {
                        const logData = new logs({
                            "username": req.session.user,
                            "command": cmd,
                        });
                        await logData.save();
                        var output = "Container named " +"'"+ contname +"'"+ " is detached from a network named " +"'"+ name+"'.";
                        var out = { "cmd": cmd, "op": output };
                        var out1 = JSON.stringify(out);
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.end(out1);
                    }
                    putlog();
                });

            }
            shCommand(cmd);
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