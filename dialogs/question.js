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
            session.send('I am very sorry. I do not know the answer to that...');
            session.delay(4000);
            session.send('Perhaps %s would be able to answer that question',session.userData.poc);
            builder.Prompts.text(session,'Please let me know when your done');
        }else{
            next();
        }   
    },
    function(session,results){
        db.insert(session,session.userData.q,session.userData.answer);
        session.send('I hope that answered your question %s',session.userData.name);
        session.endDialog();
    }
]
