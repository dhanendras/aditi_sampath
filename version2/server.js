var builder = require('botbuilder');
var restify = require('restify');
var ling = require('./linguistics');
var d = new Date();
var time = d.getHours();
var luis = require('./luis');
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
    function(session){
        builder.Prompts.text(session,'luis test');
    },
    function(session,results){
        luis.luis(session.message.text).then(result => {            
            console.log(JSON.stringify(result));
        });
        console.log(session.userData.intent);
    },
    function(session,next){
        console.log(session.userData.intent);
        console.log(time);
        if(time < 12){
             session.send("Good Morning");  
        }
        else if(time>=12&&time<17){
             session.send("Good Afternoon");   
        }else{
            session.send("Good Evening");
        }
        var hey ={"hey":['Welcome to Infinity Labs','Warm welcome to Infinity Labs','Great to have you here at Infinity Labs'],"aditi":['My name is Aditi','I am Aditi']};
        session.send(hey.hey);
        session.send(hey.aditi);
        session.beginDialog('name');
    },
    function(session,next,results){
        if(session.userData.name=={}){
            if(session.userData.trigger=='not NN'){
                session.send('Not Noun');
                session.beginDialog('name');
            }else if(session.userData.trigger=='multi token'){
                session.beginDialog('luis');
            }
        }else{
            session.userData.trigger='got name';
            session.beginDialog('name');
        }
    },
    function(session,results){
        session.beginDialog('id3');  
    },
    function(session,results){
        session.beginDialog('luis');
    },
    function(session,results){
        console.log(session.userData.senti);
    }
]);

bot.dialog('name',require('./dialogs/greet'));

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});

