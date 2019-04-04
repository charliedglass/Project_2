module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    uid: DataTypes.STRING,
    name: DataTypes.STRING
  });
  return Users;
};
