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

    static async findAdmin() {
      return await this.findAll({
        where: {
          role: 'admin'
        },
        attributes: ['username', 'phone'] // Only return these fields
      });
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
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: true,
      notEmpty: true,
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: true,
      notEmpty: true
    }
  },
  phone: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      isInt: true
    }
  }
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
