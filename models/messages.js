module.exports = function(sequelize, DataTypes) {
    var Messages = sequelize.define("messages", {
      id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
      },
      from_uid: DataTypes.STRING,
      from_name: DataTypes.TEXT,
      to_uid: DataTypes.STRING,
      to_name: DataTypes.TEXT,
      message: DataTypes.TEXT,
      read: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
      },
      created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    return Messages;
  };