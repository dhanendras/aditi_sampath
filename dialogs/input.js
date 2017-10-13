var builder = require('botbuilder');

module.exports = [
    function(session){
        builder.Prompts.text(session,'Please leave a feedback mentioning the areas I can improve. I am constantly learning!');
    },
    function(session,results){
        session.send('Thank you for the input...');
        session.endDialog();
    }
]