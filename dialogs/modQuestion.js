var builder = require('botbuilder');
var db = require('../db');
var qna = require('./qna');

module.exports = [
    function(session,results,next){
        if(session.userData.intent =='yes'){
            builder.Prompts.text(session,'Okay, what is the question?');
        }else{
            next();
        }
    },
    function(session,results,next){
        session.userData.q = session.message.text;
        qna.client(session,session.message.text);
        //session.send('Okay %s, I see you have a question...Let me get back to you',session.userData.name);
        //session.endDialog();
        next();
    },
    function(session,results,next){
        if(session.userData.question == 'no'){
            session.send('Hmm, I do not seem to have the answer to that question');
            session.delay(3000);
            send = 'Would you be kind enough to fill the proper response to your question: \''+session.userData.q+'\'';
            builder.Prompts.text(session,send);
        }else{
            next();
        }   
    },
    function(session,results){
        session.userData.idqnum = session.userData.idqnum+1;
        db.insert(session,session.userData.q,session.userData.answer);
        session.send('I hope that answered your question %s',session.userData.name);
        session.endDialog();
    }
]