
var builder = require('botbuilder');
var restify = require('restify');
var analyticsService = require('./models/text-analytics');

// Setup Restify Server
var server = restify.createServer();
server.listen(3978, function() {
    console.log('%s listening to %s', server.name, server.url);
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