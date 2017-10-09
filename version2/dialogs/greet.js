var builder = require('botbuilder');
var d = new Date();
var time = d.getHours();

module.exports = [
    function(session){
        console.log(time);
        if(time > 12){
             console.log("Good Afternoon")  
        }
        else{
             console.log("Good Morning!");   
        }
        var intro ={"know": ['May I bother you to introduce yourself?','Could you please introduce yourself?','May I know your name?','How about yours?','And you are?']};
        builder.Prompts.text(session,intro.know);
    }
];
