var NLP = require('stanford-corenlp');
var config = {"nlpPath":"./corenlp","version":"3.6.0"};
var builder = require('botbuilder');

var coreNLP = new NLP.StanfordNLP(config);

module.exports = [ 
    function(session){
        coreNLP.process('This is so good.', function(err, result) {
            console.log(err,JSON.stringify(result));
        });
    }
];
    