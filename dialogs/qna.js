var qna = require('../client');
var builder = require('botbuilder');
var request = require('sync-request');

exports.client = (session,text) => {      
    // Post user's question to QnA smalltalk kb
    var res = request('POST', 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/59e99a97-65c9-4515-b4e9-994515544053/generateAnswer', {
        'headers': {
            "Ocp-Apim-Subscription-Key": 'da1fb5f9886d4005af686e8b4219f744',
            "Content-Type": "application/json"
          },
      json: { question: text }
    });
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