const express = require('express');
const dotenv = require('dotenv');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

app.set('view engine', 'ejs');

app.use(express.urlencoded({entended:false}));
app.use(express.json());

//set enviroment variable
dotenv.config({path: './env/.env'});

app.use(cookieParser());

app.use(flash());

app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

const passport = require('./config/passport')

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = {...req.user} || null;
    res.locals.message = req.flash();
    next();
})

app.use('/', require('./routes/index'));

const db = require('./database/db');
db.sync({ force: false , alter : true })
    .then(() => console.log('conne to server'))
    .catch(error => console.log(error));

//models
//require('./models/Assistance');
//require('./models/Users');



app.listen(1000, () => {
    console.log('Server up!')
});