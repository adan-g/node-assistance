const express = require('express');
const dotenv = require('dotenv');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require("path");

app.set('views', path.join(__dirname, 'views'));
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


app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server up! listening on http://${process.env.DB_HOST}:${process.env.SERVER_PORT}`);
});