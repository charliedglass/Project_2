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
    db.Users.findOne(
      {
        attributes: [["uid", "myUID"], ["name", "myName"], "name"],
        where: {
          uid: req.params.myUID
        },
        raw: true
      }).then(function(data){
          // data["name"] = data["name"].replace(" ", "_");
          // rendered = {myself:data};
          // console.log(rendered);
          // res.render("messages", {myself:data});
          db.Messages.findAll(
            {
              attributes: [
              [db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_name ELSE to_name END"), "other_user_name"], 
              [db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_uid ELSE to_uid END"), "other_user_id"], 
              [db.sequelize.fn("SUM", /*db.sequelize.col*/(db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' AND isRead = false THEN 1 ELSE 0 END"))), "isUnread"], 
              [db.sequelize.fn("MAX", /*db.sequelize.col*/("created_at")), "mostRecentMessage"]
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
              [db.sequelize.fn("MAX", /*db.sequelize.col*/("created_at")), "DESC"]
            ]
          }).then(function(data2){
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
              db.Users.findAll({where: {uid: {$ne: req.params.myUID}}, raw: true
              }).then(function(data4){
              data["myName"] = data["myName"].replace(" ", "_");
              rendered = {myself:data};
              rendered["searchUsers"] = data4;
              console.log(rendered);
              data2.forEach(function(value){
                if (value.isUnread > 0) {
                  value["isUnread"] = true;
                }
                else {
                  value["isUnread"] = false;
                }
              })
              rendered["users"] = data2;
              console.log(rendered);
              rendered["messages"] = data3;
              console.log(rendered);
              res.render("messages", rendered);
            })
          })
        })
      })
      });

//     db.Messages.findAll(
//       {
//         attributes: [
//         [db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_name ELSE to_name END"), "other_user_name"], 
//         [db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_uid ELSE to_uid END"), "other_user_id"], 
//         [db.sequelize.fn("SUM", /*db.sequelize.col*/(db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' AND isRead = false THEN 1 ELSE 0 END"))), "isUnread"], 
//         [db.sequelize.fn("MAX", /*db.sequelize.col*/("created_at")), "mostRecentMessage"]
//       ],
//       where: {
//         $or: [
//           {
//             from_uid: req.params.myUID
//           },
//           {
//             to_uid: req.params.myUID
//           }
//       ]
//       },
//       raw: true,
//       group: ["other_user_id", "other_user_name"],
//       order: [
//         [db.sequelize.fn("MAX", /*db.sequelize.col*/("created_at")), "DESC"]
//       ]
//     }).then(function(data){
//       data.forEach(function(value){
//         if (value.isUnread > 0) {
//           value["isUnread"] = true;
//         }
//         else {
//           value["isUnread"] = false;
//         }
//       })
//       rendered["users"] = data;
//       // res.render("messages", {users: data});
//     });

//   db.Messages.findAll(
//     {
//       attributes: [
//       [db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_name ELSE to_name END"), "message_other_name"], 
//       [db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN from_uid ELSE to_uid END"), "message_other_user_id"],
//       [db.sequelize.literal("CASE WHEN from_uid != '" + req.params.myUID + "' THEN true ELSE false END"), "fromOther"],
//       "from_uid",
//       "to_uid",
//       "from_name",
//       "to_name",
//       "message",
//       "id"
//     ],
//     where: {
//       $or: [
//         {
//           from_uid: req.params.myUID
//         },
//         {
//           to_uid: req.params.myUID
//         }
//     ]
//     },
//     raw: true,
//     order: [
//       ["created_at", "ASC"]
//     ]
//   }).then(function(data){
//     rendered["messages"] = data;
//     // res.render("messages", {messages: data});
//   // });
//   console.log("rendered: "+rendered);
//   res.render("messages", rendered);

// });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
