var builder = require('botbuilder');

module.exports = [
    function(session){
        session.send('%s would be your primary POC through this tour.',session.userData.poc);
        session.delay(4500);
        session.send('I see that you have the %s mode set up...',session.userData.demotype);
        session.delay(3500);
        builder.Prompts.choice(session,'Would you like to change it?',"Quick|Detailed", { listStyle: 3 });
    },
    function(session,results,next){
        if(results.response.entity==session.userData.demotype){
            session.send('Okay, we will stick to %s',session.userData.demotype);
            next();
        }else {
            session.send('Okay, mode shifted to %s',session.userData.demotypeother);
            session.userData.demotype=session.userData.demotypeother;
            next();
        }
    },
    function(session,results){
        session.endDialog();
    }
]