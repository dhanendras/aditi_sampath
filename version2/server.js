var builder = require('botbuilder');
var restify = require('restify');
var ling = require('./linguistics');

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
    function (session) {
        builder.Prompts.text(session,'What is your name?');
    },
    function(session,results,next){
        var tokens = session.message.text.split(" ");
        if(tokens.length==1){
            console.log(tokens);
            ling.ling(session.message.text).then(result => {            
                console.log(JSON.stringify(result));
                if(result=='NN'){
                    session.userData.name=session.message.text;
                }else{

                }
                next();
            }); 
        }else{
            session.beginDialog('luis');
        }
    },
    function(session,next,results){
        session.send('Hi %s',session.userData.name);
    },
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

bot.dialog('greet',require('./dialogs/greet'));
bot.dialog('luis',require('./luis'));

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});

