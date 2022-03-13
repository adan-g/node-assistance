const express = require('express');
const router = express.Router();
const query = require('./database/db')
const { DateTime } = require("luxon");


router.get('/', async(req, res) => {
    const week = DateTime.now().weekNumber
  
    try{   
      const results = await query('SELECT * FROM assistance WHERE week = ?', week);

      const totalHours = await query('SELECT time_format(SUM(TIMEDIFF(a.exit, a.entry)), "%H:%i") AS hours from assistance a WHERE a.week = ?', week);
  
      res.render('index', {
        results,
        totalHours
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

const crud = (require('./controllers/crud'));
router.post('/saveEntry', crud.saveEntry);
router.post('/saveExit', crud.saveExit);


module.exports = router;