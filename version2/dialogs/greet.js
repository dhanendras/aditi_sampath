var builder = require('botbuilder');
var hours = new Date().hours;

module.exports = [
    function(session){
        if(hours > 12){
             alert("Good Afternoon!");   
        }
        else{
             alert("Good Morning!");   
        }
        var intro ={"know": ['May I bother you to introduce yourself?','Could you please introduce yourself?','May I know your name?','How about yours?','And you are?']};
        builder.Prompts.text(session,intro.know);
    },
    function(session,next){
        session.userData.response = session.message.text;
        session.send(session.userData.response);
        session.endDialog();
        
    }
];
