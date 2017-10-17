var builder = require('botbuilder');
var db = require('../db');
var qna = require('./qna');

module.exports = [
    function(session,results){
        session.send('Okay %s, I see you have a question',session.userData.name);
        db.insert(session,session.message.text);
        console.log('Question inserted');
        qna.client(session,session.message.text);
    },
    function(session,results){
        session.delay(3000);
        session.send('%s would be able to answer that...',session.userData.poc);
        builder.Prompts.text(session,'Please let me know when your done');
        
    },
    function(session,results){
        session.delay(6000);
        session.send('I hope that answered your question');
        session.endDialog();
    }
]
