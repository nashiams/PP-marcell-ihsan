const { Review, Order, Category, User } = require('../models');

class ReviewController {
  static async reviewForm(req, res) {
    try {
      const orderId = req.params.orderId;
      const userId = req.session.userId;

      // Check if order exists, belongs to user, is completed, and hasn't been reviewed
      const order = await Order.findOne({
        where: {
          id: orderId,
          userId,
          status: 'Completed'
        },
        include: [{
          model: Category,
          through: { attributes: ['quantity'] }
        }, {
          model: Review,
          required: false
        }]
      });

      if (!order) {
        return res.redirect('/?error=Order not found or not completed');
      }

      // Check if already reviewed
      if (order.Review) {
        return res.redirect('/?error=Order already reviewed');
      }

      res.render('reviewForm', { 
        order,
        errors: []
      });
    } catch (error) {
      console.error('Review form error:', error);
      res.status(500).send('Server Error');
    }
  }

  static async postReview(req, res) {
    try {
      const orderId = req.params.orderId;
      const userId = req.session.userId;
      const { text, rating } = req.body;

      // Verify order exists and belongs to user
      const order = await Order.findOne({
        where: {
          id: orderId,
          userId,
          status: 'Completed'
        },
        include: [{
          model: Review,
          required: false
        }]
      });

      if (!order) {
        return res.redirect('/?error=Order not found');
      }

      // Check if already reviewed
      if (order.Review) {
        return res.redirect('/?error=Order already reviewed');
      }

      // Create review
      await Review.create({
        text,
        rating: parseInt(rating),
        userId,
        orderId: parseInt(orderId)
      });

      res.redirect('/?success=Review submitted successfully');
    } catch (error) {
      console.error('Post review error:', error);
      let errors = [];
      
      if (error.name === 'SequelizeValidationError') {
        errors = error.errors.map(err => err.message);
      } else {
        errors = ['Review submission failed'];
      }

      // Re-fetch order data for form
      try {
        const order = await Order.findOne({
          where: {
            id: req.params.orderId,
            userId: req.session.userId
          },
          include: [{
            model: Category,
            through: { attributes: ['quantity'] }
          }]
        });

        res.render('reviewForm', { 
          order,
          errors
        });
      } catch (fetchError) {
        res.redirect('/?error=Review submission failed');
      }
    }
  }
}

module.exports = ReviewController;