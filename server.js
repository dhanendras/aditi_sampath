
var builder = require('botbuilder');
var restify = require('restify');
var analyticsService = require('./models/text-analytics');

var restify = require('restify');
var port = process.env.PORT || 8080;

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00075350-0d1e-4f2d-8f6e-75e253066b43?subscription-key=468963da9804413788459981febe3bb6&timezoneOffset=0&verbose=true&q= ';


//luis intent recogniser
const intent = new builder.IntentDialog({
    recognizers: [
        new builder.LuisRecognizer(LuisModelUrl)
    ]
});
// Create bot

var connector = new builder.ChatConnector({
    appId: '6c3e1d15-2432-402b-86b2-4b6b8f5b25a1',
    appPassword: 'iKXaa1a6Tap6Un6XBLjFk6i'
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});