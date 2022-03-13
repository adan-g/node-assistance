const express = require('express');
const dotenv = require('dotenv');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({entended:false}));
app.use(express.json());

//set enviroment variable
dotenv.config({path: './env/.env'})

app.use('/', require('./router'));

app.listen(1000, () => {
    console.log('Server up!')
});