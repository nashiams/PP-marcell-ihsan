'use strict';
const bcrypt = require('bcryptjs');
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Sequelize lifecycle association
     */
    static associate(models) {
      User.hasMany(models.Order, { foreignKey: 'userId' });
      User.hasMany(models.Review, { foreignKey: 'userId' });
    }

    /**
     *  Static method to find by username or email
     */
    static async findByUsernameOrEmail(value) {
      return await User.findOne({
        where: {
          [Op.or]: [
            { username: value },
            { email: value }
          ]
        }
      });
    }
  }

  // Init model
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
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(instance) {
        // const salt = bcrypt.genSaltSync(8);
        const hash = bcrypt.hashSync(instance.password, 10);
        instance.password = hash;
      }
    }
  });

  return User;
};
