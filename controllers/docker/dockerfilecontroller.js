const commandExec = require('./commandcontroller');
const alert = require('alert');


const dockerfile = (req, res) => {
    if (req.session.auth == true) {
        var access = req.session.role;
        if ((access == 'ReadandRun') | (access == 'All') | (access == 'full')) {
            var homePath;
            if (req.session.role == 'full') {
                homePath = '/docker/admin';
            }
            else {
                homePath = '/docker';
            }
            urlPath = req.protocol + '://' + req.get('host') + '/docker/';
            res.render('./docker/createdockerfile', { "name": req.session.user, "output": "Output will be displayed here .. .. .. .. .. ..", "cmd": "Final Command will be displayed here", "urlPath": urlPath, "homePath": homePath });
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




module.exports = {
    dockerfile
}