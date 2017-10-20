var builder = require('botbuilder');

module.exports = [
    function(session,results,next){
        if(session.userData.demotype=='Quick'){
            if(session.userData.trigger=='id3 1'){
                session.send('ID3 is the framework that helps us come up with innovative solutions in a constrained environment.');
                session.delay(5000);
                session.send('Please refer to the ID3 framework chart next to the entrance while I briefly explain the process. ');
                sendimage(session,'https://i.imgur.com/Zf0ug00.png','ID3');
                session.delay(7000);
                session.send('As you can see, the entire process is made up of six phases - Discover, Distill, Define, Innovate, Instrument and Industrialize');
                session.delay(10000);
                session.send('The chart explains the Contributor, Duration and the Outcome of each phase. The first three phases - Discover, Distill and Define help us identify ideas and come up with problem definitions.');
                session.delay(15000);
                sendimage(session,'https://i.imgur.com/Lgz97hE.png','Innovation Pods');
                session.delay(3000);
                session.send('In the last three phases, we develop what we call Minimum Viable Concepts, Minimum Viable Products and then move on to generate scalable Products');
                session.delay(10000);
                session.send('I hope you are with me so far %s',session.userData.name);
                session.endDialog();
            }else{
                next();
            }
        }else{
            if(session.userData.trigger=='id3 1'){
                session.send('ID3 is our innovation engine. The framework that helps us come up with innovative solutions in a constrained environment.');
                session.delay(5000);
                session.send('Please refer to the ID3 framework chart next to the entrance while I briefly explain the process. ');
                sendimage(session,'https://i.imgur.com/Zf0ug00.png','ID3');
                session.delay(7000);
                session.send('As you can see, the entire process is made up of six phases - Discover, Distill, Define, Innovate, Instrument and Industrialize');
                session.delay(7000);
                session.send('In the Discover phase, our Client partners and Executive teams continuously come up with ideas and opportunities and submit them on a portal');
                session.delay(7000);
                session.send('In the Distill phase, our probelm Analysts would be looking at these ideas and be coming up with problem defenitions so that they can be addressed at a technology standpoint.');
                session.delay(8000);
                session.send('When it moves to the define phase, our Innovation SMEs would be looking at these definitions and coming up with different concepts we could apply to resolve the problem.');
                session.delay(8000);
                session.send('I hope you are with me so far %s',session.userData.name);
                session.endDialog();
            }else{
                next();
            }
            
        }
         
    },
    function(session,results){
        if(session.userData.demotype=='Quick'){
            session.endDialog();
        }else{
            if(session.userData.trigger=='id3 2'){
                sendimage(session,'https://i.imgur.com/Lgz97hE.png','Innovation Pods');
                session.send('After define, we move on to Innovate phase. This is where Infinity Labs ges primarily involved. Here we focus on coming up with what we call a Minimum Viable Concept. Our Executive teams, Academic partners and the Hackathons we organize collectively help us here.');
                session.delay(14000);
                session.send('Then in the instrument phase, we get back to the SMEs, take their input and come up with a Minimum Viable Product.');
                session.delay(6000);
                session.send('In our final Industrialize phase, we spend considerably longer time and come up with scalable products.');
                session.delay(6000);
                session.endDialog();
            }else{
                session.endDialog();
            }
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