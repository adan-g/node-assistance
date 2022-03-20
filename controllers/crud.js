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

exports.saveExit = async(req, res)=>{
    const exit = req.body.exiTime;
    const lunch = req.body.lunchTime;
    
    let timeLunch = '01:00:00';
    if (!lunch){
        timeLunch = '00:00:00';
    }

    try{
        const entry = await query('SELECT entry FROM assistance WHERE date = curdate()');
        let hoursDay = await query('SELECT SEC_TO_TIME(TIME_TO_SEC(TIMEDIFF("' + exit + '", "' + entry[0].entry + '")) - (TIME_TO_SEC("' + timeLunch + '"))) AS hoursDay');

        await query('UPDATE assistance SET ? WHERE date = curdate()', {exit:exit, lunch:timeLunch, hoursDay: hoursDay[0].hoursDay});
        res.redirect('/')
    }catch(error){
        console.log(error);
    }
}


exports.calculoEntreHours = (inicio, fin) => {
    
    inicioMinutos = parseInt(inicio.substr(3,2));
    inicioHoras = parseInt(inicio.substr(0,2));
    
    finMinutos = parseInt(fin.substr(3,2));
    finHoras = parseInt(fin.substr(0,2));
  
    transcurridoMinutos = finMinutos - inicioMinutos;
    transcurridoHoras = finHoras - inicioHoras;
    
    if (transcurridoMinutos < 0) {
      transcurridoHoras--;
      transcurridoMinutos = 60 + transcurridoMinutos;
    }
    
    horas = transcurridoHoras.toString();
    minutos = transcurridoMinutos.toString();
    
    if (horas.length < 2) {
      horas = "0"+horas;
    }
    
    if (horas.length < 2) {
      horas = "0"+horas;
    }
      
    console.log(horas+":"+minutos)
}