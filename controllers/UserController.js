const { User, Category, Review, Order } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

class UserController {
  static async home(req, res) {
    try {
      const { search, sortBy } = req.query;
      
      // Build where clause for search
      let categoryWhere = {};
      if (search) {
        categoryWhere = {
          name: { [Op.iLike]: `%${search}%` }
        };
      }
      
      // Fetch categories with search
      const categories = await Category.findAll({
        where: categoryWhere,
        order: sortBy === 'price_asc' ? [['price', 'ASC']] : 
               sortBy === 'price_desc' ? [['price', 'DESC']] :
               [['name', 'ASC']]
      });
      
      // Fetch all reviews sorted by rating DESC with user data
      const reviews = await Review.findAll({
        include: [{
          model: User,
          attributes: ['username']
        }],
        order: [['rating', 'DESC']]
      });

      let userCompletedOrders = [];
      
      // If user is logged in, fetch their completed orders
      if (req.session.userId) {
        userCompletedOrders = await Order.findAll({
          where: {
            userId: req.session.userId,
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
      }

      res.render('home', {
        categories,
        reviews,
        userCompletedOrders,
        isLoggedIn: !!req.session.userId,
        username: req.session.username,
        search: search || '',
        sortBy: sortBy || ''
      });
    } catch (error) {
      console.error('Home error:', error);
      res.status(500).send('Server Error');
    }
  }

  static registerForm(req, res) {
    res.render('register', { errors: [] });
  }

  static async postRegister(req, res) {
    try {
        const { username, email, password, role, phone } = req.body;

        // Do NOT hash here — the hook will handle it
        await User.create({
        username,
        email,
        password, 
        role,
        phone
        });

        res.redirect('/login?success=Registration successful');
    } catch (error) {
        console.error('Register error:', error);
        let errors = [];

        if (error.name === 'SequelizeValidationError') {
        errors = error.errors.map(err => err.message);
        } else if (error.name === 'SequelizeUniqueConstraintError') {
        errors = ['Username or email already exists'];
        } else {
        errors = ['Registration failed'];
        }

        res.render('register', { errors });
    }
    }

  static loginForm(req, res) {
    const error = req.query.error;
    const success = req.query.success;
    res.render('login', { error, success });
  }

  static async postLogin(req, res) {
    try {
      const { usernameOrEmail, password } = req.body;
      
      // Find user by username or email
      const user = await User.findByUsernameOrEmail(usernameOrEmail);
      
      if (!user) {
        return res.render('login', { error: 'User not found' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.render('login', { error: 'Invalid password' });
      }

      // Set session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;

      res.redirect('/');
    } catch (error) {
      console.error('Login error:', error);
      res.render('login', { error: 'Login failed' });
    }
  }

  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/login');
    });
  }

//tambahan - liatin admin 
  static async showAdmins(req, res) {
    try {
      const admins = await User.findAdmin();
      res.render('adminList', { admins });
    } catch (error) {
      console.error('Error fetching admins:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = UserController;