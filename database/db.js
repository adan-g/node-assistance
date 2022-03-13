/*const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
});

conexion.connect((error) => {
    if(error){
        console.error('Error:' + error);
        return
    }
    console.log('conectado');
})
module.exports = conexion;*/



/*
const mysql = require('mysql');
function Database() {
  this.connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
  });
  
  this.query = (sql, args) => {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err)
          return reject(err);
        resolve(rows);
      });
    });
  };

  this.close = () => {
    return async () => {
      try {
        this.connection.end(err => {
          if (err) throw err;
          return;
        });
      } catch(e) {
        return e;
      }
    }
  };
};

var connection = new Database();
module.exports = connection;
*/



const mysql = require('mysql')
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})
  
let query = function( sql, values ) {
  // devolver una promesa
  return new Promise(( resolve, reject ) => {
    connection.getConnection(function(err, connection) {
      if (err){
         reject(err)
       }else{
         connection.query(sql, values, ( err, rows) => {
  
           if (err){
             reject(err)
           }else{
             resolve(rows)
           }
          // finaliza la sesión
           connection.release()
         })
       }
     })
   })
 }
  
 module.exports =  query;