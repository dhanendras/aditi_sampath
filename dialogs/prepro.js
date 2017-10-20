const mysql = require('mysql2');
var d = new Date();
var time = d.getHours();
var builder = require('botbuilder');
var pool = mysql.createPool(
{
    host: 'aditi-admin.mysql.database.azure.com',
    user: 'aditi.admin@aditi-admin',
    password: 'Bot@1234',
    database: 'aditi_dashboard',
    port: 3306,
    ssl: true
});

//const conn = new mysql.createConnection(config);

module.exports = [
    function (session,results,next){
        var sql = "SELECT * FROM client_details ORDER BY id DESC LIMIT 1";
        pool.getConnection(function(err, connection) {
            connection.query(sql, function (err,results,fields) {
                if(err) throw err;
                else{
                    console.log('db '+JSON.stringify(results));
                    session.userData.name = results[0].client;
                    session.userData.poc = results[0].primary_poc;
                    session.userData.demotype = results[0].demo_type;
                    session.userData.id = session.userData.name+time;
                    session.userData.trigger={};
                    console.log(session.userData.name);
                    console.log(session.userData.poc);
                    console.log(session.userData.demotype);
                    if(session.userData.demotype=='Quick'){
                        session.userData.demotypeother='Detailed';
                    }else{
                        session.userData.demotypeother='Quick';
                    }
                    session.endDialog();
                }
                connection.release();
            });
        });
    }
];