var builder = require('botbuilder');
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/06f59422-0288-40a7-821d-e8f7ebde4cd2?subscription-key=e9bfbbd5344e4777b390538ba3aa4322&verbose=true&timezoneOffset=0&q=';
exports.luis = text => {
    /*session.userData.intent={};
    session.userData.entity={};
    session.userData.entityType={};
    console.log(text);*/
    builder.LuisRecognizer.recognize(text, LuisModelUrl,function (err, intents, entities,next){
        var results = {};
        results.entities == entities;
        results.intents == intents;
        /*session.userData.intent=intents[0].intent;
        session.userData.entity=entities[0].entity;
        session.userData.entityType=entities[0].type;*/
    });

}