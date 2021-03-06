var db = require("../models");

module.exports = function(app) {
  // Update messages as read
  app.put("/api/:myUID/:otherUID/read", function(req, res) {
    db.Messages.update(
      {
        isRead: true
      },
      {where: {
          from_uid: req.params.otherUID,
          to_uid: req.params.myUID
      }}
    ).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Updates messages as notified
  app.put("/api/was-notified/:myUID", function(req, res) {
    db.Messages.update(
      {
        wasNotified: true
      },
      {where:{
        to_uid: req.params.myUID
      }} 
    )
  });

  // Create a new message
  app.post("/api/:myUID/:myName/:toUID/:toName/:message/new_message", function(req, res) {
    db.Messages.create({
      from_uid: req.params.myUID,
      from_name: req.params.myName,
      to_uid: req.params.toUID,
      to_name: req.params.toName,
      message: req.params.message
    }).then(function(dbExample) {
      res.json(dbExample);
      location.reload();
    });
  });

  // Create a new user
  app.post("/api/new_user", function(req, res) {
    console.log(db.Users);
    db.Users.create({
      uid: req.body.uid,
      name: req.body.name
    }).then(function(dbExample) {
      res.json(dbExample);
    });
  });

};
