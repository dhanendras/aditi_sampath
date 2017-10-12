const mysql = require('mysql');
var config =
{
    host: 'divine-surface-182707:asia-east1:aditi-instance',
    user: 'root',
    password: 'Bot@1234',
    database: 'aditi_dashborad',
    port: 3306,
    ssl: true
};

const conn = new mysql.createConnection(config);

module.exports = [
    function (session,results,next){
        conn.connect();
        var sql_sel = "SELECT * FROM "+session.userData.table;
        var sql_ins = "INSERT"
        conn.query(sql, function (err,results,fields) {
            if(err) throw err;
            else{
                console.log('db'+JSON.stringify(results));

            }
        });
    },
    function(session,results){
        conn.end();
        session.userData.table={};

    }
];
 
exports.get = (table,act) => {
    conn.connect();
    var sql_sel = "SELECT * FROM "+table;
    var sql_ins = "INSERT INTO"+table;
    if(c==1){
        conn.query(sql_sel,function (err,results,fields) {
            if(err) throw err;
            else{
                console.log('db'+JSON.stringify(results));
            }
        });
    }else{
        conn.query(sql_ins,function (err,results,fields) {
            if(err) throw err;
            else{
                console.log('db'+JSON.stringify(results));
            }
        });
    }
    
}