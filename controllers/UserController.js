const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { Op } = require('sequelize');

class UserController {

    static async home(req, res) {
        try {
            res.render('home')
        } catch (error) {
            res.send(error)
        }
    }

    static async registerForm(req,res) {
        try {
             const error = req.query.error || null;
             res.render('registerForm', { error });
        } catch (error) {
            res.send(error)
        }
    }

    static async postRegister(req, res) {
        try {
            const { username, email, password, role, phone } = req.body;

            await User.create({
            username,
            email,
            password, // hashed in the model hook
            role,
            phone
            });

            res.redirect('/login');
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.redirect('/register?error=' + encodeURIComponent('Email already in use'));
                }

                console.error(error);
                res.redirect('/register?error=' + encodeURIComponent('Internal server error'));
        }
    }

    static async loginForm(req,res) {
        try {
            const error = req.query.error || null;
            res.render('loginForm', { error });
        } catch (error) {
            res.send(error)
        }
    }

    static async postLogin(req, res) {
        const { identifier, password } = req.body;

        try {
            const user = await User.findOne({
            where: {
                    [Op.or]: [
                        { email: identifier },
                        { username: identifier }
                    ]
                }
            });

            if (!user) {
            return res.redirect('/login?error=Invalid+username%2Femail+or+password');
            }

            const isValid = bcrypt.compareSync(password, user.password);
            if (!isValid) {
            return res.redirect('/login?error=Invalid+username%2Femail+or+password');
            }

            req.session.userId = user.id;
            req.session.role = user.role;
            res.redirect('/dashboard');
        } catch (error) {
            console.error(error);
            res.redirect('/login?error=Internal+server+error');
        }
    }

    static async dashboard(req, res) {
        try {
            res.render('dashboard', {
            userId: req.session.userId,
            role: req.session.role
            })
        } catch (error) {
            res.send(error)
        }
    }

    static async logout(req, res) {
        try {
            req.session.destroy(err => {
            if (err) return res.send(err);
            res.redirect('/login?msg=Logged out successfully');
            })
        } catch (error) {
            res.send(error)
        }
    }

    

}

module.exports = UserController