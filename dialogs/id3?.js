var builder = require('botbuilder');
module.exports = [
    function(session){
        builder.Prompts.text(session,'Shall we start with our Innovation Framework?');
    },
    function(session,next,results){
        luis.luis(session.message.text).then(result => {            
            console.log(JSON.stringify(result));
        });
        console.log(session.userData.intent);
        if(session.userData.intent=='yes'||session.userData.intent=='sure'){
            session.beginDialog('id3');
        }else if(session.userData.intent=='no'){
            session.beginDialog('issue');
        }else{
            session.send();
            session.beginDialog('id3?');
        } 
    },
    function(session,results){
        session.beginDialog(session.userData.dialog);
    }
]