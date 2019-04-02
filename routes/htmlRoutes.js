var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    // db.Example.findAll({}).then(function(dbExamples) {
    //   res.render("index", {
    //     msg: "Welcome!",
    //     examples: dbExamples
    //   });
    // });
  });

  // Load example page and pass in an example by id
  app.get("/:myUID", function(req, res) {
    // db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
    //   res.render("example", {
    //     example: dbExample
    //   });
    // });
    db.Users.findOne(
      {
        attributes: [["uid", "myUID"], ["name", "myName"]],
        where: {
          uid: req.params.myUID
        }
      }).then(function(data){
        res.render("messages", data);
      });

    db.Messages.findAll(
      {
        attributes: [
        [models.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_name ELSE to_name END"), "other_user_name"], 
        [models.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_uid ELSE to_uid END"), "other_user_id"], 
        [sequelize.fn("SUM", sequelize.col(models.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' AND read = true THEN 1 ELSE 0 END"))), "notUnread"], 
        [sequelize.fn("MAX", sequelize.col("created_at")), "mostRecentMessage"]
      ],
      where: {
        $or: [
          {
            from_uid: req.params.myUID
          },
          {
            to_uid: req.params.myUID
          }
      ]
      },
      group: ["other_user_id", "other_user_name"],
      order: [
        ["mostRecentMessage", "DESC"]
      ]
    }).then(function(data){
      res.render("users", {users: data});
    });

  db.Messages.findAll(
    {
      attributes: [
      [models.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_name ELSE to_name END"), "message_other_user_id"], 
      [models.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN 'other' ELSE 'me' END"), "message_other_user_id"],
      "from_uid",
      "to_uid",
      "from_name",
      "to_name",
      "message",
      "id"
    ],
    where: {
      $or: [
        {
          from_uid: req.params.myUID
        },
        {
          to_uid: req.params.myUID
        }
    ]
    },
    order: [
      ["created_at", "ASC"]
    ]
  }).then(function(data){
    res.render("messages", {messages: data});
  });

});

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
