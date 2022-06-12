const { DateTime } = require("luxon");
const db = require('../database/db');
const Assistance = require('../models/Assistance');


exports.currentWeek = async (req,res) => {
  const week = DateTime.now().weekNumber
  const userId = res.locals.user.id;

  try{
    const results = await Assistance.findAll({
        where: {
          week: week, 
          userId
        }
    });
    
    const { QueryTypes } = require('sequelize');
    const totalHoursWeek = await db.query('SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(a.exit, a.entry))) - (SUM(IFNULL(TIME_TO_SEC(a.lunch),0)))) AS hours FROM assistance a WHERE a.week = ? AND userId = ?',{
        replacements: [week, userId],
        type: QueryTypes.SELECT
    });
    
    
    res.render('index', {
      results,
      totalHoursWeek
    });
    
  }catch(error){
    console.log(error)
  } 
}


exports.otherWeek = async(req, res) => {
    const week = req.params.week;
  
    try{
      const results = await Assistance.findAll({
        where: {
            week: week 
        }
      });   
    
      const { QueryTypes } = require('sequelize');
      const totalHoursWeek = await db.query('SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(a.exit, a.entry))) - (SUM(IFNULL(TIME_TO_SEC(a.lunch),0)))) AS hours from assistance a WHERE a.week = ?',{
        replacements: [week],
        type: QueryTypes.SELECT
      });

      res.render('index', {
        results,
        totalHoursWeek
      });
      
    }catch(error){
      console.log(error)
    }  
};


exports.entry = async (req, res) => {
  res.render('entry');
}

exports.exit = async (req, res) => {
  res.render('exit');
}

exports.saveEntry = async (req, res)=>{
    const entry = req.body.entryTime;
    const date = req.body.entryDate;
    const day = req.body.entryDay;
    const week = DateTime.now().weekNumber;
    const property = req.body.entryProperty;
    const userId = res.locals.user.id;
    
    try{
      await Assistance.create({userId, day, entry, date, week, property})

      res.redirect('/');

    }catch(error){
      console.log(error);
    }
}

exports.saveExit = async(req, res)=>{
    const exit = req.body.exiTime;
    const lunch = req.body.lunchTime;
    
    let timeLunch = '01:00:00';
    if (!lunch){
        timeLunch = '00:00:00';
    }

    const currentlyDate = DateTime.utc().toLocal();
    
    try{
      const entry = await Assistance.findAll({
        attributes: ['entry'],
        where: {
          date: currentlyDate
        }
    });

      
      const { QueryTypes } = require('sequelize');
      let hoursDay = await db.query('SELECT SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF("' + exit + '", "' + entry[0].entry + '")) - (TIME_TO_SEC("' + timeLunch + '"))) AS hoursDay',{
        type: QueryTypes.SELECT
      });

      
      await Assistance.update({
        exit: exit,
        lunch: timeLunch,
        hoursDay: hoursDay[0].hoursDay       
      },
      {
        where: {date: currentlyDate}
      });


      res.redirect('/')
    }catch(error){
        console.log(error);
    }
}