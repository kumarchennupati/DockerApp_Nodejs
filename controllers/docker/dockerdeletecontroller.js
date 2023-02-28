const commandExec = require('./commandcontroller');
const alert = require('alert');


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
                cmd = "sudo docker " + resource + " rm " + name;
            }
            else if (state == 'running') {
                cmd = "sudo docker " + resource + " rm -f " + name;
            }
            else {
                cmd = 'sudo docker --help';
            }
            commandExec.shCommand(cmd,req.session.user,res);
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



const allresourcedelete = (req, res) => {
    if (req.session.auth == true) {
        var access = req.session.role;
        if (access == 'full') {
            const resource = req.body.resource;
            if (resource == 'container') {
                cmd = "sudo docker rm -f $(sudo docker ps -a -q)";
            }
            else if (resource == 'image') {
                cmd = "sudo docker rmi -f $(sudo docker images -q)"
            }
            else {
                cmd = 'sudo docker --help';
            }
            commandExec.shCommand(cmd,req.session.user,res);
        }

        else {
            alert('No permission to Delete all');
        }

    }
    else {
        res.redirect('/login');
        alert('Not loggedin')
    }
}






const resourceprune = (req, res) => {
    if (req.session.auth == true) {
        var access = req.session.role;
        if (access == 'full') {
            const resource = req.body.resource;
            var cmd;
            if(resource == 'image'){
                cmd = "sudo docker image prune -af";
            }
            else if ((resource == 'volume') | (resource == 'network') | (resource == 'container'))
            {
                cmd = "sudo docker "+resource+" prune -f";
            }
            else if(resource == 'all'){
                cmd = " sudo docker system prune --volumes -af";
            }
            else{
                cmd = "sudo docker --help";
            }
            commandExec.shCommand(cmd,req.session.user,res);
        }

        else {
            alert('No permission to Prune the Resources');
        }

    }
    else {
        res.redirect('/login');
        alert('Not loggedin')
    }
}






module.exports = {
    deletion,
    resourcedelete,
    allresourcedelete,
    resourceprune
}