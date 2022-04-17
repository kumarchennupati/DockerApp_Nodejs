const indexpage = (req, res) => {
    if (req.session.auth == true) {
      res.render('./docker/main', { "name": req.session.user });
    }
    else {
      res.redirect('/');
    }
  }


  const adminindexpage = (req, res) => {
    if (req.session.auth == true) {
      res.render('./docker/adminmain', { "name": req.session.user });
    }
    else {
      res.redirect('/');
    }
  }


  module.exports = {
    indexpage,
    adminindexpage
  }