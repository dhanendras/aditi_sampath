// var request = require('request');
var rp = require('request-promise');
var smallTalkReplies = require('./smalltalk');

function Client(opts) {
    if (!opts.knowledgeBaseId) throw new Error('knowledgeBaseId is required');
    if (!opts.subscriptionKey) throw new Error('subscriptionKey is required');

    var self = this;
    this.knowledgeBaseId = opts.knowledgeBaseId;
    this.subscriptionKey = opts.subscriptionKey;
    this.scoreThreshold = opts.scoreThreshold ? opts.scoreThreshold : 20; // 20 is the default
}

exports.post = function (opts, cb) {

    if (!opts.question) throw new Error('question is required');
    cb = cb || (() => { });

    var self = this;

    var url = 'https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/59e99a97-65c9-4515-b4e9-994515544053/generateAnswer';

    var options = {
        method: 'POST',
        uri: url,
        json: true,
        body: opts,
        headers: {
            "Ocp-Apim-Subscription-Key": 'da1fb5f9886d4005af686e8b4219f744',
            "Content-Type": "application/json"
        }
    };

    rp(options)
        .then(function (body) {
            // POST succeeded
            var botreply;
            var answerobj = body.answers[0];
            console.log(JSON.stringify(body));
            console.log(answerobj.answer);
            if (answerobj.score >= 80) {
                // Answer confidence score is acceptable - use QnA maker's response
                //var botreplylist = smallTalkReplies[answerobj.answer];
                botreply = answerobj.answer;
            }

            return cb(null, botreply);
        })
        .catch(function (err) {
            // POST failed
            return cb(err);
        });
}


