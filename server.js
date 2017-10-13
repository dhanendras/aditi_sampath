var builder = require('botbuilder');
var restify = require('restify');
var ling = require('./linguistics');
var d = new Date();
var time = d.getHours();
var luis = require('./luis');
var analyticsService = require('./text-analytics');
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
        session.beginDialog('prepro');
    },
    function(session,next){
        console.log(session.userData.intent);
        console.log(time);
        if(time < 11){
             session.send("Good Morning, %s",session.userData.name);  
        }
        else if(time>=11&&time<17){
             session.send("Good Afternoon, %s",session.userData.name);   
        }else{
            session.send("Good Evening, %s",session.userData.name);
        }
        var hey ={"hey":['Welcome to Infinity Labs','Warm welcome to Infinity Labs','Great to have you here at Infinity Labs'],"aditi":['My name is Aditi','I am Aditi']};
        session.send(hey.hey);
        session.send(hey.aditi);
        session.beginDialog('id3?');
    },
    function(session){
        session.beginDialog('id3-2?');
    },
    function(session,results){
        session.beginDialog('ezoneEnter');
    },
    function(session,results){
        session.beginDialog('ezone1');
    },
    function(session){
        session.beginDialog('feedback');
    },
    function(session,results,next){
        if(session.userData.fbtrigger=='bad'){
            session.beginDialog('input');
        }else{
            next();
        }
    },
    function(session,results){
        session.beginDialog('end');
    }
]);
bot.dialog('name',require('./dialogs/greet'));
bot.dialog('ezone',require('./dialogs/ezone'));
bot.dialog('luis',require('./luis'));
bot.dialog('id3',require('./dialogs/id3'));
bot.dialog('feedback',require('./dialogs/feedback'));
bot.dialog('input',require('./dialogs/input'));

bot.dialog('id3?',[
    function(session){
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
            session.userData.trigger='id3 not continue 1';
            session.beginDialog('issue');
        }else if(session.userData.intent=='question'){
            session.beginDialog('question');
        }else{

        }
    },
    function(session,results){
        var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('id3?');
}
]);
bot.dialog('id3-2?',[
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
            session.userData.trigger='id3 not continue 1';
            session.beginDialog('issue');
        }else if(session.userData.intent=='question'){
            session.beginDialog('question');
        }else{

        }
    },
    function(session,results){
        var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('id3-2?');
}
]);
bot.dialog('ezoneEnter',[
    function(session){
    session.send('The reminder of this tour would be in our Experience Zone. It is onto your left when facing the ID3 framework chart');
    session.delay(2000);
    builder.Prompts.text(session,'Please let me know when you are done');
    },
    function(session,results){
        session.beginDialog('luis');
    },
    function(session,results,next){
        if(session.userData.intent=='question'){
            session.beginDialog('question');
        }else{
            session.beginDialog('ezone1');
        }
    },
    function(session,results){
        var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('ezoneEnter');
}
]);
bot.dialog('ezone1',[
    function(session){
    builder.Prompts.text(session,'Let us start with the presentation shall we?');
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
        var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('ezone1');
    }
]);

bot.dialog('ezone2',[
    function(session){
    builder.Prompts.text(session,'We will be discussing about our Asset catalog now. Shall we proceed?');
    },
    function(session,results){
        session.beginDialog('luis');
    },
    function(session,results,next){
        console.log(session.userData.intent);
        if(session.userData.intent=='yes'){
            session.userData.trigger='ezone 2';
            session.beginDialog('ezone');
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
        var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('ezone2');
}
]);
bot.dialog('issue',[
    function(session){
        session.send('%s, could you please look into this?',session.userData.poc);
        session.delay(3000);
        builder.Prompts.choice(session, 'Alternatively, you can choose an instance where you want to go...', "ID3|Experience Zone|Feedback|Restart|End|Cancel", { listStyle: 4 });
    },
    function(session,results){
        if(results.response.entity=='ID3'){
            session.send('Okay, heading over to ID3...');
            session.beginDialog('id3');
        }else if(results.response.entity=='Experience Zone'){
            session.send('Okay, heading over to E Zone narrative');
            session.beginDialog('ezone1');
        }else if(results.response.entity=='Feedback'){
            session.send('Okay, heading over to Feedback...');
            session.beginDialog('feedback');
        }else if(results.response.entity=='Restart'){
            session.send('Okay, starting over...');
            session.beginDialog('/');
        }else if(results.response.entity=='End'){
            session.send('Okay');
            session.beginDialog('end');
        }else if(results.response.entity=='Cancel'){
            session.send('Okay');
            session.beginDialog(session.userData.currentDialog);
        } else{
            
        }
    }
]).triggerAction({
    matches: /^help$|^start over$|^skip$|^go back*restart/i
})
bot.dialog('prepro',require('./db'));
// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});



bot.dialog('end',[
    function(session){
        var bye={"bye":['Good bye!','See you','Thank you. Good bye','So long!','See you again']};
        builder.Prompts.text(session,bye.bye);
    },
    function(session,results){
        var responseFour = session.message.text;
        builder.LuisRecognizer.recognize(responseFour, LuisModelUrl, function (err, intents, entities) {
            var resultThree = {};
            resultThree.intents = intents;
            if (intents[0].intent == 'bye'){
                session.beginDialog('bye');
            }else {
                session.send('The session has ended. Type help to go to a specefic instance');
                session.beginDialog('end')
            }
        })
    }
]).triggerAction({
    matches: /^bye$|^goodbye$|^good bye*see you/i
});
