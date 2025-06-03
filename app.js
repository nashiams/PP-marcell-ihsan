const express = require('express')
const UserController = require('./controllers/UserController')
const app = express()
const session = require('express-session')
const port = 3000

//middleware
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false,
    sameSite : true
   }
}))
// this is middle ware for routes if you wanted to protect home page from login
function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login?error=Please login first');
  }
  next(); // user is logged in, go to next middleware/route
}

function isBuyer(req, res, next) {
  if (req.session.role !== 'buyer') {
    return res.redirect('/login?error=Only Buyers')
  }
  next()
}

//login purposes
//GET register
app.get('/register', UserController.registerForm)
app.post('/register', UserController.postRegister)

app.get('/login', UserController.loginForm)
app.post('/login', UserController.postLogin)

app.get('/', UserController.home)

app.get('/dashboard', isAuthenticated, isBuyer, UserController.dashboard)

app.get('/logout', UserController.logout);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


module.exports = isAuthenticated;