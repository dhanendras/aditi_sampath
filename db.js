const mysql = require('mysql2');
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
        var sql = "SELECT * FROM client_details";
        conn.query(sql, function (err,results,fields) {
            if(err) throw err;
            else{
                console.log('db'+JSON.stringify(results));

            }
        });
    },
    function(session,results){
        conn.end();
    }
];
