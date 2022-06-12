const db = require('../database/db');
const Users = require('../models/Users');
const sendEmail = require('../handlers/email');

exports.signUpForm = (req, res) => {
    res.render('signUp', {
        title: 'Create Account'
    });
}



exports.newSignUp = async (req, res) => {
    //read dates
    const {name, email, password} = req.body;

    try {
        //create accoun
        await Users.create({
            name,
            email,
            password
        })


        //confirm email
        const confirmUrl = `http://${req.headers.host}/confirm/${email}`;

        const user = {
           email 
        }

        await sendEmail.send({
            user,
            subject: 'Confirm your account',
            confirmUrl,
            file: 'confirm-email'
        })

        req.flash('alert alert-success', 'We send an email to confirm your account');
        res.redirect('/login')

    } catch (error) {

        res.render('signUp', {
            error: error.errors,
            title: 'Create Account'
        })
    }
    
}


exports.confirmAccount = async(req,res) => {
    const user = await Users.findOne({
        where: {
            email: req.params.email
        }
    });

    if(!user){
        req.flash('alert alert-danger', 'No valid')
        res.redirect('/signUp')
    }

    user.active = 1;
    await user.save();

    req.flash('alert alert-success', 'Activated account');
    res.redirect('/login');
}

