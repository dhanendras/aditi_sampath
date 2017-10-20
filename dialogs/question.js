var builder = require('botbuilder');
var db = require('../db');
var qna = require('./qna');

module.exports = [
    function(session,results,next){
        if(session.userData.trigger=='question 2'){
            next();
        }else{
            if(session.userData.intent =='yes'){
                builder.Prompts.text(session,'Okay, what is the question?');
            }else{
                next();
            }
        }
        
    },
    function(session,results,next){
        if(session.userData.trigger=='question 2'){
            next();
        }else{
            qna.client(session,session.message.text);
            console.log('qna client done');
            //session.send('Okay %s, I see you have a question...Let me get back to you',session.userData.name);
            db.insert(session,session.message.text);
            console.log('Question inserted');
            session.endDialog();
        }
        
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
        if(session.userData.trigger=='question 2'){
            session.delay(3000);
            session.send('I hope that answered your question %s',session.userData.name);
            session.userData.trigger = {};
            session.endDialog();
        }else{
            session.endDialog();
        }
        
    }
]
