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
        session.beginDialog('ezone');
    },
    function(session,results){
        if(session.userData.trigger=='pod not continue'){
            session.beginDialog('issue');
        }else{
            session.userData.trigger='pod continue';
            session.beginDialog('ezone');
        }
    },
    function(session, results){
        session.beginDialog(session.userData.dialog);
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
        session.beginDialog('id3?');

    },
    function(session,results){
          if(session.userData.trigger=='id3 not continue'){
              session.beginDialog('issue');
          }else{
              session.beginDialog('id3');
          }
    },
    function(session,results){
        session.send('garage');
    },
    function(session,results){
        console.log(session.userData.senti);
    }
]);

bot.dialog('name',require('./dialogs/greet'));
bot.dialog('ezone',require('./dialogs/ezone'));

// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});

