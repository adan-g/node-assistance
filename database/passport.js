const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/Users');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passportField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await Users.findOne({
                    where: {email: email}
                })
                //usuario correcto pero no password
                if(!user.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password incorrecto'
                    })
                }

                //email y password correctos
                return done(null, user)
            } catch (error) {
                return done(null, false, {
                    message: 'account no exite'
                })
            }
        }

    )
)


//serializar user
passport.serializeUser((user, callback) => {
    callback(null, usuario);
})

//deserializar user
passport.deserializeUser((user, callback) => {
    callback(null, usuario);
})


module.exports = passport;