const { Order, Category, OrderCategory, User } = require('../models');
const { Op } = require('sequelize');
const { getDistance } = require('../helper/helper');

class OrderController {
  static async orderForm(req, res) {
    try {
      const categories = await Category.findAll();
      res.render('order', {
        categories,
        errors: []
      });
    } catch (error) {
      console.error('Order form error:', error);
      res.status(500).send('Server Error');
    }
  }

  static async postOrder(req, res) {
    try {
      const { category, quantity, weight } = req.body; // "category" is now a name string
      const userId = req.session.userId;

      // 1. Find selected category by name
      const selectedCategory = await Category.findOne({ where: { name: category } });
      if (!selectedCategory) {
        return res.render('order', {
          categories: await Category.findAll(),
          errors: ['Selected category not found.']
        });
      }

      // 2. Get user's distance
      const rawDistance = getDistance(req);
      if (typeof rawDistance !== 'number') {
        return res.render('order', {
          categories: await Category.findAll(),
          errors: [rawDistance] // e.g. 'Location not found from IP'
        });
      }
      const distance = rawDistance;

      // 3. Calculate total price
      const basePrice = selectedCategory.price * parseInt(quantity) * parseFloat(weight);
      const totalPrice = basePrice + (distance * 100); // Add delivery cost

      // 4. Create order
      const order = await Order.create({
        status: 'Processing',
        totalPrice,
        distance,
        userId
      });

      // 5. Link category to order
      await OrderCategory.create({
        orderId: order.id,
        categoryId: selectedCategory.id,
        quantity: parseInt(quantity)
      });

      // 6. Redirect to status page
      return res.redirect('/status');
    } catch (error) {
      console.error('Post order error:', error);
      let errors = [];

      if (error.name === 'SequelizeValidationError') {
        errors = error.errors.map(e => e.message);
      } else {
        errors = ['Something went wrong while placing the order.'];
      }

      return res.render('order', {
        categories: await Category.findAll(),
        errors
      });
    }
  }

  static async status(req, res) {
    try {
      const userId = req.session.userId;

      // Fetch all incomplete orders for the current user
      const orders = await Order.findAll({
        where: {
          userId,
          status: { [Op.ne]: 'Completed' }
        },
        include: [{
          model: Category,
          through: { 
            attributes: ['quantity'],
            as: 'OrderCategory'
          }
        }],
        order: [['createdAt', 'DESC']]
      });

      res.render('status', { 
        orders,
        estimateDaysLeft: Order.estimateDaysLeft,
        formatTimeRemaining: Order.formatTimeRemaining
      });
    } catch (error) {
      console.error('Status error:', error);
      res.status(500).send('Server Error');
    }
  }

  static async markAsDone(req, res) {
    try {
      const orderId = req.params.id;
      const userId = req.session.userId;

      // Find and update the order
      const order = await Order.findOne({
        where: {
          id: orderId,
          userId
        }
      });

      if (!order) {
        return res.redirect('/status?error=Order not found');
      }

      // Update status to completed
      await order.update({ status: 'Completed' });

      res.redirect('/status?success=Order marked as completed');
    } catch (error) {
      console.error('Mark as done error:', error);
      res.redirect('/status?error=Failed to update order');
    }
  }
}

module.exports = OrderController;