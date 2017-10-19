var builder = require('botbuilder');
var db = require('../db');
var qna = require('./qna');

module.exports = [
    function(session,results,next){
        if(session.userData.trigger =='no q'){
            builder.Prompts.text(session,'Okay, what is the question?');
        }else{
            next();
        }
    },
    function(session,results,next){
        session.send('Okay %s, I see you have a question',session.userData.name);
        db.insert(session,session.message.text);
        console.log('Question inserted');
        qna.client(session,session.message.text);
        next();
    },
    function(session,results){
        if(session.userData.question = 'no'){
            session.delay(3000);
            session.send('I am verry sorry. I do not know the answer to that...');
            session.delay(4000);
            session.send('Perhaps %s would be able to answer that question',session.userData.poc);
            builder.Prompts.text(session,'Please let me know when your done');
        }else{
            next();
        }   
    },
    function(session,results){
        session.delay(3000);
        session.send('I hope that answered your question %s',session.userData.name);
        session.endDialog();
    }
]
