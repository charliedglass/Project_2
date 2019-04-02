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
      location.reload();
    });
  });

  // Create a new example
  app.post("/api/:myUID/:myName/:toUID/:toName/new_message", function(req, res) {
    db.Messages.create(req.body).then(function(dbExample) {
      res.json(dbExample);
      location.reload();
    });
  });

  app.post("/api/:myUID/:myName", function(req, res) {
    db.Users.create(req.body).then(function(dbExample) {
      res.json(dbExample);
      location.reload();
    });
  });

  // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });
};
