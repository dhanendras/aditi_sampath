var builder = require('botbuilder');
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/06f59422-0288-40a7-821d-e8f7ebde4cd2?subscription-key=e9bfbbd5344e4777b390538ba3aa4322&timezoneOffset=0&verbose=true&q= ';

module.exports = [
    function(session){
        builder.LuisRecognizer.recognize(session.message.text, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.entities = entities;
            results.intents = intents;
            console.log('%s',JSON.stringify(intents));
            session.userData.intent=intents[0].intent;
            session.userData.score = intents[0].score;
            console.log(session.userData.intent);
            session.endDialog();
        });
    }
]