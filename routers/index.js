const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const OrderController = require('../controllers/OrderController');
const ReviewController = require('../controllers/ReviewController');

// Middleware (move them here to use in routes)
function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login?error=Please login first')
  }
  next();
}

function isBuyer(req, res, next) {
  if (req.session.role !== 'buyer') {
    return res.redirect('/login?error=Only Buyers')
  }
  next();
}

// Login routes
router.get('/', UserController.home);
router.get('/register', UserController.registerForm)
router.post('/register', UserController.postRegister)
router.get('/login', UserController.loginForm)
router.post('/login', UserController.postLogin)
router.get('/logout', UserController.logout)

// Order routes
router.get('/order', isAuthenticated, isBuyer, OrderController.orderForm)
router.post('/order', isAuthenticated, isBuyer, OrderController.postOrder)
router.get('/status', isAuthenticated, isBuyer, OrderController.status)
router.post('/order/:id/done', isAuthenticated, isBuyer, OrderController.markAsDone)
router.post('/order/:id/delete', OrderController.delete);

// Review routes
router.get('/review/:orderId', isAuthenticated, isBuyer, ReviewController.reviewForm)
router.post('/review/:orderId', isAuthenticated, isBuyer, ReviewController.postReview)

// Admin list
router.get('/admins', isAuthenticated, isBuyer, UserController.showAdmins)

module.exports = router;





// const express = require('express')
// const UserController = require('../controllers/UserController')
// const OrderController = require('../controllers/OrderController')
// const ReviewController = require('../controllers/ReviewController')
// const router = express.Router()

// const app = express();
// const PORT = process.env.PORT || 3000;
// const router = require('./routers')

// // Middleware
// app.set('view engine', 'ejs');
// app.use(express.urlencoded({extended: false}));
// app.set('trust proxy', true);   



// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   cookie: { 
//     secure: false,
//     sameSite: true 
//   }
// }));

// // Authentication middleware
// function isAuthenticated(req, res, next) {
//   if (!req.session.userId) {
//     return res.redirect('/login?error=Please login first');
//   }
//   next();
// }

// function isBuyer(req, res, next) {
//   if (req.session.role !== 'buyer') {
//     return res.redirect('/login?error=Only Buyers');
//   }
//   next();
// }


// //login routes
// app.get('/', UserController.home);
// app.get('/register', UserController.registerForm);
// app.post('/register', UserController.postRegister);
// app.get('/login', UserController.loginForm);
// app.post('/login', UserController.postLogin);
// app.get('/logout', UserController.logout);


// // Order Routes
// app.get('/order', isAuthenticated, isBuyer, OrderController.orderForm);
// app.post('/order', isAuthenticated, isBuyer, OrderController.postOrder);
// app.get('/status', isAuthenticated, isBuyer, OrderController.status);
// app.post('/order/:id/done', isAuthenticated, isBuyer, OrderController.markAsDone);

// // Review Routes
// app.get('/review/:orderId', isAuthenticated, isBuyer, ReviewController.reviewForm);
// app.post('/review/:orderId', isAuthenticated, isBuyer, ReviewController.postReview);

// app.get('/admins', isAuthenticated, isBuyer, UserController.showAdmins)



// module.exports = router