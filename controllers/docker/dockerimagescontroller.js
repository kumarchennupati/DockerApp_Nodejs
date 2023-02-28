const commandExec = require('./commandcontroller');
const alert = require('alert');



const image = (req, res) => {
  if (req.session.auth == true) {
    var homePath;
    if (req.session.role == 'full') {
      homePath = '/docker/admin';
    }
    else {
      homePath = '/docker';
    }
    console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
    urlPath = req.protocol + '://' + req.get('host') + '/docker/';
    res.render('./docker/images', { "name": req.session.user, "output": "Output will be displayed here .. .. .. .. .. ..", "cmd": "Final Command will be displayed here", "urlPath": urlPath, "homePath": homePath });
  }
  else {
    res.redirect('/');
  }
}


const imglist = (req, res) => {
  if (req.session.auth == true) {
    if (req.session.role != 'None') {
      cmd = "sudo docker image ls";
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


const imgcreate = (req, res) => {
  if (req.session.auth == true) {
    var access = req.session.role;
    if ((access == 'ReadandRun') | (access == 'All') | (access == 'full')) {
      const name = req.body.name;
      const contname = req.body.contname;
      const tag = req.body.tag;
      cmd = "sudo docker commit " + contname + ' ' + name;
      if (tag != '') {
        cmd = cmd + ':' + tag;
      }
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



const imgpull = (req, res) => {
  if (req.session.auth == true) {
    var access = req.session.role;
    if ((access == 'ReadandRun') | (access == 'All') | (access == 'full')) {
      const name = req.body.name;
      cmd = "sudo docker pull " + name;
      commandExec.shCommand(cmd,req.session.user,res);
    }
    else {
      res.redirect('/docker');
      alert('No permission to Run the command');
    }
  }
  else {
    res.redirect('/login');
  }
}




module.exports = {
  image,
  imglist,
  imgcreate,
  imgpull
}