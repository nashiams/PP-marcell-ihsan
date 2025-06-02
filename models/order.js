'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        Order.belongsTo(models.User, { foreignKey: 'userId' });
        Order.hasOne(models.Review, { foreignKey: 'orderId' });
        Order.belongsToMany(models.Category, {
          through: models.OrderCategory,
          foreignKey: 'orderId',
          otherKey: 'categoryId'
  });
    }
  }
  Order.init({
    status: DataTypes.STRING,
    totalPrice: DataTypes.INTEGER,
    distance: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};