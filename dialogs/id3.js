var builder = require('botbuilder');

module.exports = [
    function(session,results,next){
        session.userData.dialogNum = 0;
        if(session.userData.trigger=='id3 1'){
            session.send('ID3 is the framework that helps us come up with innovative solutions in a constrained environment. Please refer to the ID3 framework chart next to the entrance while I briefly explain the process. ');
            session.delay(10000);
            sendimage(session,'https://i.imgur.com/Zf0ug00.png','ID3');
            session.delay(2000);
            session.send('The chart explains the Contributor, Duration and the Outcome of each phase. The first three phases - Discover, Distill and Define help us identify ideas and come up with problem definitions.');
            session.delay(12000);
            session.endDialog();
        }else{
            next();
        }
         
    },
    function(session,results){
        session.userData.dialogNum = 1;
        if(session.userData.trigger=='id3 2'){
            sendimage(session,'https://i.imgur.com/Lgz97hE.png','Innovation Pods');
            session.delay(2000);
            session.send('In the last three phases, we develop what we call Minimum Viable Concepts, Minimum Viable Products and then move on to generate scalable Products. This is where Infinity Labs gets primarily involved.');
            session.delay(12000);
            session.endDialog();
        }else{
            session.endDialog();
        }
    }

];

function sendimage(session,url,title) {
    var msg = new builder.Message(session);
    msg.attachments([
        new builder.HeroCard(session)
            .title(title)
            .images([builder.CardImage.create(session, url)])
    ]);
    session.send(msg);
}