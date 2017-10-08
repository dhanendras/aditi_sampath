var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 8080, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: '9513ae39-73af-4ac0-bef8-d09c700976f4',
    appPassword: 'NXyqhPz3kDjuUFEmdyekWeB'
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
    /*function (session) {
       session.beginDialog('greet');
    },
    function(session,results,res){
        session.send(session.userData.response);
        builder.Prompts.text(session,'type shit');
    },
    function(session,next,results){
        session.beginDialog('luis');
        if(results!=null){
            next();
        }else{
            console.log('stuck in server');
        }
    },*/
    function(session,results){
        builder.Prompts.text(session,'Text to be analysed');   
    },
    function(session,results){
        session.beginDialog('anal');
    },
    function(session,results){
        console.log(session.userData.senti);
    }
]);

bot.dialog('greet',require('./greet'));
bot.dialog('luis',require('./luis'));
bot.dialog('anal',require('./anal'));

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});
