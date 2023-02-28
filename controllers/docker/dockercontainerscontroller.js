const alert = require('alert');
const commandExec = require('./commandcontroller');




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




const stopcont = (req, res) => {
  if (req.session.auth == true) {
    var access = req.session.role;
    if ((access == 'ReadandRun') | (access == 'All') | (access == 'full')) {
      const name = req.body.name;
      cmd = "sudo docker stop " + name;
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




const startcont = (req, res) => {
  if (req.session.auth == true) {
    var access = req.session.role;
    if ((access == 'ReadandRun') | (access == 'All') | (access == 'full')) {
      const name = req.body.name;
      cmd = "sudo docker start " + name;
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
      commandExec.shCommandRunCont(cmd,req.session.user,req,res,urlPath,homePath);
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