var builder = require('botbuilder');
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00075350-0d1e-4f2d-8f6e-75e253066b43?subscription-key=257707f7e74d4ceb8aa71adebfe7893a&timezoneOffset=0&verbose=true&q= ';
exports.luis= (session,text) =>{
    session.userData.intent={};
    session.userData.entity={};
    session.userData.entityType={};
    console.log(text);
    builder.LuisRecognizer.recognize(text, LuisModelUrl,function (err, intents, entities,next){
        var results = {};
        results.entities == entities;
        results.intents == intents;
        session.userData.intent=intents[0].intent;
        session.userData.entity=entities[0].entity;
        session.userData.entityType=entities[0].type;
    });

}