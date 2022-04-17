const { exec } = require("child_process");
const alert = require('alert');
const logs = require('../../models/logs');

const deletion = (req, res) => {
    if (req.session.auth == true) {
        var access = req.session.role;
        if ((access == 'ReadandDelete') | (access == 'All') | (access == 'full')) {
            var homePath;
            if (req.session.role == 'full') {
                homePath = '/docker/admin';
            }
            else {
                homePath = '/docker';
            }
            urlPath = req.protocol + '://' + req.get('host') + '/docker/';
            res.render('./docker/resourcedelete', { "name": req.session.user, "output": "Output will be displayed here .. .. .. .. .. ..", "cmd": "Final Command will be displayed here", "urlPath": urlPath, "homePath": homePath });
        }
        else {
            res.redirect('/docker');
            alert('No permission to Delete the Resources');
        }
    }
    else {
        res.redirect('/');
    }
}



const resourcedelete = (req, res) => {
    if (req.session.auth == true) {
        var access = req.session.role;
        if ((access == 'ReadandDelete') | (access == 'All') | (access == 'full')) {
            const state = req.body.state;
            const name = req.body.name;
            const resource = req.body.resource;
                if (state == 'stopped') {
                    cmd = "sudo docker "+resource+" rm "+name;
                }
                else if (state == 'running') {
                    cmd = "sudo docker "+resource+" rm -f "+name;
                }
                else {
                    cmd = 'sudo docker --help';
                }
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
                            var output =  resource+" Resource is deleted with name: "+`${stdout}`;
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
            alert('No permission to access');
        }

    }
    else {
        res.redirect('/login');
        alert('Not loggedin')
    }
}






module.exports = {
    deletion,
    resourcedelete
}