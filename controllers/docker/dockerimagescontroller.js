const { exec } = require("child_process");
const alert = require('alert');
const logs = require('../../models/logs');


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
            var output = "Image created with name:" + name + " and " + `${stdout}`
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



const imgpull = (req, res) => {
  if (req.session.auth == true) {
    var access = req.session.role;
    if ((access == 'ReadandRun') | (access == 'All') | (access == 'full')) {
      const name = req.body.name;
      cmd = "sudo docker pull " + name;
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
            var out = { "cmd": cmd, "op": `${stdout}` };
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