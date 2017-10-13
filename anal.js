var analyticsService = require('./text-analytics');
var builder = require('botbuilder');

module.exports = [
    function(session,results){
        console.log(session.message.text);
        analyticsService.getScore(session.message.text).then(score => {            
            var newScore = parseFloat(score);
            if (!isNaN(newScore)) {
                    if (newScore > 0.75) {
                        session.userData.senti=='pos';
                    } 
                    else if (newScore < 0.25) {
                        session.userData.senti=='neg';
                    } 
                    else {
                        session.userData.senti=='zero';
                    }
                }
            })
    },
    function(session,results){
        session.endDialogWithResults();
    }
];
