var builder = require('botbuilder');

module.exports = [
    function(session,results,next){
        if(session.userData.trigger=='id3 1'){
            session.send('ID3 is our innovation engine. The framework that helps us come up with innovative solutions in a constrained environment.');
            session.delay(1500);
            session.send('Please refer to the ID3 framework chart next to the entrance while I briefly explain the process. ');
            session.delay(4000);
            session.send('As you can see, the entire process is made up of six phases - Discover, Distill, Define, Innovate, Instrument and Industrialize');
            session.delay(3000);
            session.send('In the Discover phase, our Client partners and Executive teams continuously come up with ideas and opportunities and submit them on a portal');
            session.delay(3000);
            session.send('In the Distill phase, our probelm Analysts would be looking at these ideas and be coming up with problem defenitions so that they can be addressed at a technology standpoint.');
            session.delay(3000);
            session.send('When it moves to the define phase, our Innovation SMEs would be looking at these definitions and coming up with different concepts we could apply to resolve the problem.');
            session.delay(4000);
            session.send('I hope you are with me so far %s',session.userData.name);
            session.endDialog();
        }else{
            next();
        } 
    },
    function(session,results){
        if(session.userData.trigger=='id3 2'){
            session.send('After define, we move on to Innovate phase. This is where Infinity Labs ges primarily involved. Here we focus on coming up with what we call a Minimum Viable Concept. Our Executive teams, Academic partners and the Hackathons we organize collectively help us here.');
            session.delay(2500);
            session.send('Then in the instrument phase, we get back to the SMEs, take their input and come up with a MInimum VIable Product.');
            session.send('In our final Industrialize phase, we ');
            session.delay(3000);
            session.endDialog();
        }else{

        }
    }
];

