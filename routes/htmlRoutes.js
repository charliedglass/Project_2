var db = require("../models");

var path = require('path');

module.exports = function(app) {

  // Load index page
  app.get("/", function(req, res) {
      res.render("index");
  });

  // Load example page and pass in an example by id
  app.get("/messages/:myUID", function(req, res) {
    var rendered = {};
    //get your user info
    db.Users.findOne(
      {
        attributes: [["uid", "myUID"], ["name", "myName"], ["name", "name_full"]],
        where: {
          uid: req.params.myUID
        },
        raw: true
      }).then(function(data){
        //get list of users you've chatted with, in order of recency
          db.Messages.findAll(
            {
              attributes: [
              [db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_name ELSE to_name END"), "other_user_name"], 
              [db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_uid ELSE to_uid END"), "other_user_id"], 
              [db.sequelize.fn("SUM", (db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' AND isRead = false THEN 1 ELSE 0 END"))), "isUnread"], 
              [db.sequelize.fn("MAX", db.sequelize.col("created_at")), "mostRecentMessage"]
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
            raw: true,
            group: ["other_user_id", "other_user_name"],
            order: [
              [db.sequelize.fn("MAX", db.sequelize.col("created_at")), "DESC"]
            ]
          }).then(function(data2){
            //get all your messages
            db.Messages.findAll(
              {
                attributes: [
                [db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_name ELSE to_name END"), "message_other_name"], 
                [db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_uid ELSE to_uid END"), "message_other_user_id"],
                [db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN true ELSE false END"), "fromOther"],
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
              raw: true,
              order: [
                ["created_at", "ASC"]
              ]
            }).then(function(data3){
              //get all users data who are not you
              db.Users.findAll({where: {uid: {$ne: req.params.myUID}}, raw: true
              }).then(function(data4){
              //aggregate all sequelize queries, change names for data attributes to work, then render to messages
              data["myName"] = data["myName"].replace(" ", "_");
              rendered = {myself:data};
              console.log(rendered);

              data2.forEach(function(value){
                if (value.isUnread > 0) {
                  value["isUnread"] = true;
                }
                else {
                  value["isUnread"] = false;
                }
                value["other_user_name_data"] = value["other_user_name"].replace(" ", "_");
              })
              rendered["users"] = data2;
              console.log(rendered);

              data3.forEach(function(value){
                value["message_other_name_data"] = value["message_other_name"].replace(" ", "_");
                value["from_name_data"] = value["from_name"].replace(" ", "_");
                value["to_name_data"] = value["to_name"].replace(" ", "_");
              })
              rendered["messages"] = data3;

              data4.forEach(function(value){
                value["name_data"] = value["name"].replace(" ", "_");
              })
              rendered["searchUsers"] = data4;
              console.log(rendered);
              res.render("messages", rendered);
            })
          })
        })
      })
      });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
