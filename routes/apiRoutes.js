var db = require("../models");

module.exports = function(app) {
  // Get all examples
  app.put("/api/:myUID/:otherUID/read", function(req, res) {
    db.Messages.update(
      {
        read: true
      },
      {where: {
          from_uid: req.params.otherUID,
          to_uid: req.params.myUID
      }}
    ).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Create a new example
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

  app.post("/api/new_user", function(req, res) {
    console.log(db.Users);
    db.Users.create({
      uid: req.body.uid,
      name: req.body.name
    }).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });
};
