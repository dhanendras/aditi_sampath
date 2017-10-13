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
        builder.Prompts.text(session,'Shall we start with our Innovation framework?');

    },
    function(session,results){
        session.beginDialog('luis');
    },
    function(session,results,next){
        console.log(session.userData.intent);
        if(session.userData.intent=='yes'){
            session.userData.trigger='id3 1';
            session.beginDialog('id3');
            console.log(session.userData.trigger);
        }else if(session.userData.intent=='no'){
            session.userData.trigger='ezone not continue 1';
            session.beginDialog('issue');
        }else if(session.userData.intent=='question'){
            session.beginDialog('question');
        }else{

        }
    },
    function(session){
        builder.Prompts.text(session,'Shall we continue?');
    },
    function(session,results){
        session.beginDialog('luis');
    },
    function(session,results,next){
        console.log(session.userData.intent);
        if(session.userData.intent=='yes'){
            session.userData.trigger='id3 2';
            session.beginDialog('id3');
            console.log(session.userData.trigger);
        }else if(session.userData.intent=='no'){
            session.userData.trigger='ezone not continue 2';
            session.beginDialog('issue');
        }else if(session.userData.intent=='question'){
            session.beginDialog('question');
        }else{

        }
    },
    function(session,results){
        builder.Prompts.text(session,'Shall we proceed with the tour?');
    },
    function(session,results){
        session.beginDialog('luis');
    },
    function(session,results,next){
        console.log(session.userData.intent);
        if(session.userData.intent=='yes'){
            session.userData.trigger='ezone 1';
            session.beginDialog('ezone');
            console.log(session.userData.trigger);
        }else if(session.userData.intent=='no'){
            session.userData.trigger='ezone not continue 1';
            session.beginDialog('issue');
        }else if(session.userData.intent=='question'){
            session.beginDialog('question');
        }else{

        }
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
bot.set(`persistUserData`, false);
bot.dialog('name',require('./dialogs/greet'));
bot.dialog('ezone',require('./dialogs/ezone'));
bot.dialog('luis',require('./luis'));
bot.dialog('id3',require('./dialogs/id3'));
bot.dialog('issue',require('./dialogs/issue'));
//bot.dialog('prepro',require('./db'));
// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});

