const express = require('express');
const router = express.Router();
const query = require('./database/db')
const { DateTime } = require("luxon");
const crud = (require('./controllers/crud'));

router.get('/week/:week', async(req, res) => {
    const week = req.params.week;
  
    try{   
      //const week = await query('SELECT DISTINCT(week) FROM assistance ORDER BY week ASC');
      const results = await query('SELECT * FROM assistance WHERE week = ?', week);

      const totalHoursWeek = await query('SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(a.exit, a.entry))) - SUM(TIME_TO_SEC(a.lunch))) AS hours from assistance a WHERE a.week = ?', week);

      res.render('index', {
        results,
        totalHoursWeek
      });
      
    }catch(error){
      console.log(error)
    }  
});


router.get('/', async(req, res) => {
  const week = DateTime.now().weekNumber

  try{   
    //const week = await query('SELECT DISTINCT(week) FROM assistance ORDER BY week ASC');
    const results = await query('SELECT * FROM assistance WHERE week = ?', week);

    const totalHoursWeek = await query('SELECT SEC_TO_TIME(SUM(TIME_TO_SEC(TIMEDIFF(a.exit, a.entry))) - SUM(TIME_TO_SEC(a.lunch))) AS hours from assistance a WHERE a.week = ?', week);

    res.render('index', {
      results,
      totalHoursWeek
    });
    
  }catch(error){
    console.log(error)
  }  
});



router.get('/entry', (req, res) =>{
  res.render('entry');
})

router.get('/exit', (req, res) =>{
    res.render('exit');
})


router.post('/saveEntry', crud.saveEntry);
router.post('/saveExit', crud.saveExit);


module.exports = router;