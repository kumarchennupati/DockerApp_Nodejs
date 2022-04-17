const { exec } = require("child_process");
const alert = require('alert');
const logs = require('../../models/logs');




const container = (req, res) => {
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
    res.render('./docker/containers', { "name": req.session.user, "output": "Output will be displayed here .. .. .. .. .. ..", "cmd": "Final Command will be displayed here", "urlPath": urlPath, "homePath": homePath });
  }
  else {
    res.redirect('/');
  }
}


const contlist = (req, res) => {
  if (req.session.auth == true) {
    if (req.session.role != 'None') {
      const state = req.body.state;
      if (state == 'running') {
        cmd = "sudo docker ps";
      }
      else if (state == 'all') {
        cmd = "sudo docker ps -a";
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
    alert('Not loggedin')
  }
}




const stopcont = (req, res) => {
  if (req.session.auth == true) {
    var access = req.session.role;
    if ((access == 'ReadandRun') | (access == 'All') | (access == 'full')) {
      const name = req.body.name;
      cmd = "sudo docker stop " + name;
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
            var output = `${stdout}`.replace(/(\r\n|\n|\r)/gm, "")
            var out = { "cmd": cmd, "op": output + " container is stopped" };
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




const startcont = (req, res) => {
  if (req.session.auth == true) {
    var access = req.session.role;
    if ((access == 'ReadandRun') | (access == 'All') | (access == 'full')) {
      const name = req.body.name;
      cmd = "sudo docker start " + name;
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
            var output = `${stdout}`.replace(/(\r\n|\n|\r)/gm, "")
            var out = { "cmd": cmd, "op": output + " container is started" };
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



const launchcont = (req, res) => {
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
      res.render('./docker/launchcontainers', { "name": req.session.user, "output": "Output will be displayed here .. .. .. .. .. ..", "cmd": "Final Command will be displayed here", "urlPath": urlPath, "homePath": homePath });

    }
    else {
      res.redirect('/docker/container');
      alert('No permission to Run the command');
    }
  }

  else {
    res.redirect('/');
  }
}



const runcont = (req, res) => {
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
      var contname = ' ';
      var imagename = req.body.imagename;
      var detached = ' ';
      var volume = ' '
      var port = ' ';
      var network = ' ';

      if (req.body.name != '') {
        var name = req.body.name;
        contname = '--name ' + name + ' ';
      }

      if (req.body.tag != '') {
        var tag = req.body.tag;
        imagename = imagename + ':' + tag;
      }
      if (req.body.detached == 'yes') {
        detached = '-dit '
      }
      if (req.body.srcvol != '' && req.body.destvol != '') {
        srcvol = req.body.srcvol;
        destvol = req.body.destvol;
        volume = '-v ' + srcvol + ':' + destvol + ' ';
      }

      if (req.body.contport != '') {
        hostport = req.body.hostport;
        contport = req.body.contport;
        if (hostport != '') {
          port = '-p ' + hostport + ':' + contport + ' ';
        }
        else {
          port = '-p ' + hostport + ' ';
        }

      }
      if (req.body.networktype != '') {
        networktype = req.body.networktype;
        network = '--network=' + networktype + ' ';
      }

      cmd = 'sudo docker run ' + detached + volume + port + network + contname + imagename;
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
            urlPath = req.protocol + '://' + req.get('host') + '/docker/';
            finalOutput = "Container is launched with id " + `${stdout}`;
            res.render('./docker/containers', { "name": req.session.user, "output": finalOutput, "cmd": cmd, "urlPath": urlPath, "homePath": homePath });
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
  container,
  contlist,
  stopcont,
  launchcont,
  runcont,
  startcont
}