'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' });
        Order.hasOne(models.Review, { foreignKey: 'orderId' });
        Order.belongsToMany(models.Category, {
          through: models.OrderCategory,
          foreignKey: 'orderId',
          otherKey: 'categoryId'
  });
    }

    static estimateDaysLeft(createdAt, weight) {
      const now = new Date();
      const orderDate = new Date(createdAt);
      const daysPassed = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

      let baseDays = 3;
      if (weight > 10) baseDays += 2;
      else if (weight > 5) baseDays += 1;

      const daysLeft = baseDays - daysPassed;
      return Math.max(0, daysLeft);
    }

    static formatTimeRemaining(daysLeft) {
      if (daysLeft === 0) return 'Ready for pickup';
      else if (daysLeft === 1) return '1 day remaining';
      else return `${daysLeft} days remaining`;
    }
  }

  Order.init({
  status: {
    type: DataTypes.STRING,
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      isInt: true
    }
  },
  distance: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: true,
      isFloat: true
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: true,
      isInt: true
    }
  }
}, {
    sequelize,
    modelName: 'Order',
  });

  Order.addHook('beforeCreate', (order, options) => {
  if (!order.status) {
    order.status = 'Processing'; // default value if not provided
  }
});

  return Order;
};
