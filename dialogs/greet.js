var builder = require('botbuilder');
var d = new Date();
var time = d.getHours();
var ling = require('../linguistics');

module.exports = [
    function(session){
        builder.Prompts.text(session,'How was your day?');
    },
    function(session,results){
        analyticsService.getScore(results.response).then(score => {
            var newScore = parseFloat(score);
            if (!isNaN(newScore)) {
                    if (newScore > 0.75) {
                        var good = {"good" :['Great','That is good to hear','Excellent','Good to know that']};
                        session.send(good.good);
                    } 
                    else if (newScore < 0.25) {
                        var bad = {"bad":['I am sorry to hear that','That is unfortunate','Oh I am sorry','Oh oh']};
                        session.send(bad.bad);
                    } 
                    else {
                        var zero = {"zero":['Same here','Just an other ordinary day then','Seems alright','Good to know']};
                        session.send(zero.zero);
                    }
    
                }
            })
    },
    function(session,results){
        
    }
]
    
