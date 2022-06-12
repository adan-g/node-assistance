const passport = require('passport');
const Users = require('../models/Users')
const crypto = require('crypto');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const Op = Sequelize.Op
const sendEmail = require('../handlers/email')

exports.loginForm = (req, res) => {
        res.render('login', {
        title: 'login assistance'
    });
}

exports.userAuthentication = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
});


exports.userAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/login')
}


exports.logOut = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
}

exports.formResetPassword = (req, res) => {
    res.render('resetPassword', {
        title: 'Reset Password',
        message: ''
    })
}

exports.sendToken = async (req, res) => {
    const {email} = req.body
    const user = await Users.findOne({where: {email}});

    if(!user){
        res.render('resetPassword', {
            title: 'reset password',
            message: 'unregistered email'
        })
        return;
    }

    user.token = crypto.randomBytes(20).toString('hex');
    user.expiration = Date.now() + 3600000

    await user.save();
    
    const resetUrl = `http://${req.headers.host}/resetPassword/${user.token}`;
    
    await sendEmail.send({
        user,
        subject: 'Password reset',
        resetUrl,
        file: 'restore-password'
    })

    req.flash('alert alert-success', 'We send an email to restore the password')
    res.redirect('/login');
}


exports.validateToken = async (req, res) => {
    const user = await Users.findOne({
        where: {
            token: req.params.token
        }
    });

    if(!user){
        res.render('resetPassword', {
            title: 'reset password',
            message: 'not valid token'
        })
    }

    res.render('resetEnterPassword', {
        title: 'Reset Password'
    })
 }

exports.updatePassword = async (req, res) => {
    const user = await Users.findOne({
        where: {
            token: req.params.token,
            expiration: {
                [Op.gte] : Date.now()
            }
        }
    })

    if (!user){
        res.render('/resetPassword', {
            title: 'reset password',
            message: 'token no valido'
        })
    }

    user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    user.token = null;
    user.expiration = null;

    await user.save();

    res.redirect('/login');
   
}