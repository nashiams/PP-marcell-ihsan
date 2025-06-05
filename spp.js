const express = require('express');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const router = require('./routers'); // or './routers/index.js'

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.set('trust proxy', true);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
  }
}));

// Use the router
app.use('/', router);

app.listen(PORT, () => {
  console.log("Jalan di port", PORT);
});


// const express = require('express');
// const session = require('express-session');


// // Import controllers
// const UserController = require('./controllers/UserController');
// const OrderController = require('./controllers/OrderController');
// const ReviewController = require('./controllers/ReviewController');



// const app = express();
// const PORT = process.env.PORT || 3000;
// const router = require('./routers')

// // Middleware
// app.set('view engine', 'ejs');
// app.use(express.urlencoded({extended: false}));
// app.set('trust proxy', true);   



// // app.use(session({
// //   secret: 'keyboard cat',
// //   resave: false,
// //   saveUninitialized: false,
// //   cookie: { 
// //     secure: false,
// //     sameSite: true 
// //   }
// // }));

// // // Authentication middleware
// // function isAuthenticated(req, res, next) {
// //   if (!req.session.userId) {
// //     return res.redirect('/login?error=Please login first');
// //   }
// //   next();
// // }

// // function isBuyer(req, res, next) {
// //   if (req.session.role !== 'buyer') {
// //     return res.redirect('/login?error=Only Buyers');
// //   }
// //   next();
// // }

// // Routes
// app.use('/', router)



// // Home & Authentication Routes
// // app.get('/', UserController.home);
// // app.get('/register', UserController.registerForm);
// // app.post('/register', UserController.postRegister);
// // app.get('/login', UserController.loginForm);
// // app.post('/login', UserController.postLogin);
// // app.get('/logout', UserController.logout);


// // // Order Routes
// // app.get('/order', isAuthenticated, isBuyer, OrderController.orderForm);
// // app.post('/order', isAuthenticated, isBuyer, OrderController.postOrder);
// // app.get('/status', isAuthenticated, isBuyer, OrderController.status);
// // app.post('/order/:id/done', isAuthenticated, isBuyer, OrderController.markAsDone);

// // // Review Routes
// // app.get('/review/:orderId', isAuthenticated, isBuyer, ReviewController.reviewForm);
// // app.post('/review/:orderId', isAuthenticated, isBuyer, ReviewController.postReview);

// // app.get('/admins', isAuthenticated, isBuyer, UserController.showAdmins)

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });