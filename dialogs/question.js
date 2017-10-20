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
        qna.client(session,session.message.text);
        //session.send('Okay %s, I see you have a question...Let me get back to you',session.userData.name);
        db.insert(session,session.message.text);
        //session.endDialog();
        next();
    },
    function(session,results,next){
        if(session.userData.question == 'no'){
            session.delay(3000);
            session.send('I am very sorry. I do not know the answer to that...');
            session.delay(4000);
            session.send('Perhaps %s would be able to answer that question',session.userData.poc);
            builder.Prompts.text(session,'Please let me know when your done');
        }else{
            next();
        }   
    },
    function(session,results){
        session.send('I hope that answered your question %s',session.userData.name);
        session.endDialog();
    }
]
