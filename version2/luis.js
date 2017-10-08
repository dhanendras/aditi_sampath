var builder = require('botbuilder');
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00075350-0d1e-4f2d-8f6e-75e253066b43?subscription-key=e512d01835354a6f829e54078ca66503&timezoneOffset=0&verbose=true&q= ';
module.exports=[
    function(session,args,next){
        console.log(session.message.text);
        builder.LuisRecognizer.recognize(session.message.text, LuisModelUrl,function (err, intents, entities,next){
            var results = {};
            results.entities == entities;
            results.intents == intents;
            console.log('%s',JSON.stringify(results));
            session.userData.intent=='intro';
        })
        if(session.userData.intent!=null){
            next();
        }else{
            console.log('stuck in luis');
        }
    },
    function(session,results){
        return(results);
        session.endDialog();
    }
];