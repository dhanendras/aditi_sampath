
//
var http = require('http');
var builder = require('botbuilder');
var analyticsService = require('./models/text-analytics');

http.createServer(function (req, res) {
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');
    
}).listen(process.env.PORT || 8080);

// Create bot
var connector = new builder.ChatConnector({
    appId: '95a0a3f3-0616-4339-b161-1555e6784b4c',
    appPassword: '3rqVr45QvS1ONmvGi5YV1Mp'
});


//luis model url

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00075350-0d1e-4f2d-8f6e-75e253066b43?subscription-key=468963da9804413788459981febe3bb6&timezoneOffset=0&verbose=true&q= ';

//server.post('/api/messages', connector.listen());
