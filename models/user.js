'use strict';
const bcrypt = require('bcryptjs')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, { foreignKey: 'userId' });
      User.hasMany(models.Review, { foreignKey: 'userId' });
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    phone: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate(instance) {
        const salt = bcrypt.genSaltSync(8);
        const hash = bcrypt.hashSync(instance.password, salt);
        instance.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};