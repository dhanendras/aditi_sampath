const mysql = require('mysql');
var config =
{
    host: 'myserver4aditibot.mysql.database.azure.com',
    user: 'aditi.bot@myserver4aditibot',
    password: 'digass@1234',
    database: 'aditidb',
    port: 3306,
    ssl: true
};

const conn = new mysql.createConnection(config);

module.export = function prepro(session,results,next){
    conn.connect();
    var sql = "SELECT * FROM service_catalog WHERE subcategory LIKE";
    conn.query(sql, function (err,results,fields) {
        if(err) throw err;
        else{
            return(results);}

        console.log('db'+JSON.stringify(results));
    }
    );
}