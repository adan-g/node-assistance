const { DateTime } = require("luxon");
const query = require('../database/db');

exports.saveEntry = (req, res)=>{
    const entry = req.body.entryTime;
    const date = req.body.entryDate;
    const day = req.body.entryDay;
    const week = DateTime.now().weekNumber;
    const property = req.body.entryProperty;
    
    try{
        query('INSERT INTO assistance SET ?', {id_user: 1, nombre:'adan', day:day, entry:entry, date:date, week:week, property:property});

        res.redirect('/');

    }catch(error){
        console.log(error);
    }
}

exports.saveExit = (req, res)=>{
    const exit = req.body.exiTime;
    const lunch = '01:00:00';

    try{
        query('UPDATE assistance SET ? WHERE date = curdate()', {exit:exit, lunch:lunch});
        res.redirect('/')
    }catch(error){
        console.log(error);
    }
}