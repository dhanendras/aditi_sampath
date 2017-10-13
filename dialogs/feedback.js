var builder = require('botbuilder');
var analyticsService = require('../text-analytics');
module.exports = [
    function(session){
        session.send('Well, that marks the end of this tour...');
        var fb ={"fb": ['How did you find the tour?','What do you think about the tour?','So what do have have to say about the tour?']}
        session.send(fb.fb);
        builder.Prompts.text(session,'We would appreciate a candid feedback');
    },
    function (session, results, next) {
    
        analyticsService.getScore(results.response).then(score => {
            
            var newScore = parseFloat(score);
            if (!isNaN(newScore)) {
                    if (newScore > 0.8) {
                        session.send('Thanks %s! It means a lot to us. Hope we get to see you again',session.userData.name);
                        session.endDialog();
                    } 
                    else if (newScore > 0.5) {
                        session.send('Thanks for that positive input %s. We hope to impress you next time',session.userData.name);
                        session.endDialog();
                    } 
                    else {
                        session.send('Thank you for the honest input %s. We will definetly work on it',session.userData.name);
                        session.endDialog();
                        session.userData.fbtrigger='bad';
                    }
    
                }
            })
        }
]
