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


var builder = require('botbuilder');
var request = require('sync-request');

exports.client = (session,text) => {      
    // Post user's question to QnA smalltalk kb
    var res = request('POST', 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/06f59422-0288-40a7-821d-e8f7ebde4cd2?subscription-key=e9bfbbd5344e4777b390538ba3aa4322&timezoneOffset=0&verbose=true&q= ', {
        'headers': {
            "Ocp-Apim-Subscription-Key": 'da1fb5f9886d4005af686e8b4219f744',
            "Content-Type": "application/json"
          },
      json: { question: text }
    });
    console.log(res.getBody('utf8'));
    body = JSON.parse(res.getBody('utf8'));
    //body = res.getBody('utf8');
    var results = body.answers[0];
    final = results.answer;
    score = results.score;
    if(score>80){
        session.send(final);
    }else{
        session.userData.question = 'no';
    }

   
}