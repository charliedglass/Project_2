module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("users", {
    uid: DataTypes.STRING,
    name: DataTypes.TEXT
  });
  return Users;
};
