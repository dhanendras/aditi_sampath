var builder = require('botbuilder');
var restify = require('restify');
var ling = require('./linguistics');
var d = new Date();
var time = d.getHours();
var newTime = time+10;
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
        if(newTime>0 && newTime<= 11){
             session.send("Good Morning, %s",session.userData.name);  
        }else if(newTime>11&&newTime<=16){
             session.send("Good Afternoon, %s",session.userData.name);   
        }else{
            session.send("Good Evening, %s",session.userData.name);
        }
        var hey ={"hey":['Welcome to Infinity Labs','Warm welcome to Infinity Labs','Great to have you here at Infinity Labs']};
        session.send(hey.hey);
        session.delay(1000);
        session.say('My name is Aditi');
        session.delay(1500);
        session.beginDialog('confirm');
    },
    function(session,results){
        session.userData.currentDialog='id3?';
        session.beginDialog('id3?');
    },
    function(session,results,next){
        if(session.userData.demotype=='Quick'){
            next();
        }else{
            session.userData.currentDialog = 'id3-2?';
            session.beginDialog('id3-2?');  
        }
    },
    function(session,results){
        session.userData.currentDialog = 'ezoneEnter';
        session.beginDialog('ezoneEnter');
    },
    function(session,results){
        session.userData.currentDialog='ezone1';
        session.beginDialog('ezone1');
    },
    function(session,results){
        session.userData.currentDialog='ezone2';
        session.beginDialog('ezone2');
    },
    function(session,results){
        session.userData.currentDialog='ezone3';
        session.beginDialog('ezone3');
    },
    function(session,results){
        session.userData.trigger='ezone 4';
        session.beginDialog('ezone');
    },
    function(session){
        session.userData.currentDialog='question?';
        session.beginDialog('question?');
    },
    function(session,results,next){
        if(session.userData.intent=='no'){
            next();
        }else{
            session.beginDialog('morequestions?');
        }
    },
    function(session){
        session.userData.currentDialog='feedback';
        session.beginDialog('feedback');
    },
    function(session,results,next){
        console.log(session.userData.fbtrigger);
        if(session.userData.fbtrigger=='bad'){
            session.beginDialog('input');
        }else{
            next();
        }
    },
    function(session,results){
        session.userData.currentDialog='end';
        session.beginDialog('end');
    }
]);

bot.dialog('name',require('./dialogs/greet'));
bot.dialog('ezone',require('./dialogs/ezone'));
bot.dialog('luis',require('./luis'));
bot.dialog('id3',require('./dialogs/id3'));
bot.dialog('feedback',require('./dialogs/feedback'));
bot.dialog('input',require('./dialogs/input'));
bot.dialog('question',require('./dialogs/question'));
bot.dialog('prepro',require('./dialogs/prepro'));
bot.dialog('confirm',require('./dialogs/confirm'));

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
            next();
            console.log(session.userData.trigger);
        }else if(session.userData.intent=='no'){
            session.userData.trigger='id3 not continue 1';
            session.beginDialog('issue');
        }else if(session.userData.intent=='question'){
            session.beginDialog('question');
        }else{
            session.beginDialog('issue');
        }
    },
    function(session,results){
        if(session.userData.intent=='yes'){
            session.beginDialog('id3');
        }else{
            var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
            session.send(back.back);
            session.beginDialog('id3?');
        }
        
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
            next();
            console.log(session.userData.trigger);
        }else if(session.userData.intent=='no'){
            session.userData.trigger='id3 not continue 1';
            session.beginDialog('issue');
        }else if(session.userData.intent=='question'){
            session.beginDialog('question');
        }else{
            next();
        }
    },
    function(session,results){
        if(session.userData.intent=='yes'){
            session.beginDialog('id3');
        }else{
            var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
            session.send(back.back);
            session.beginDialog('id3-2?');
        }
}
]);
bot.dialog('ezoneEnter',[
    function(session){
        session.delay(3000);
        sendimage(session,'https://i.imgur.com/Kjh2FY6.png','Map');
        session.send('The reminder of this tour would be in our Experience Zone. It is onto your left when facing the ID3 framework chart');
        session.delay(8000);
        builder.Prompts.text(session,'Please let me know when you reach there');
    },
    function(session,results){
        session.beginDialog('luis');
    },
    function(session,results,next){
        if(session.userData.intent=='question'){
            session.beginDialog('question');
            session.userData.ezone = 'question';
        }else{
            session.endDialog();
        }
    },
    function(session,results,next){
        if(session.userData.ezone=='question'){
            var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
            session.send(back.back);
            session.beginDialog('ezoneEnter');
        }else{
            session.endDialog();
        }
}
]);
bot.dialog('ezone1',[
    function(session){
        session.send('So %s...',session.userData.name);
        builder.Prompts.text(session,'Let us get going with the presentation shall we?');
    },
    function(session,results){
        session.beginDialog('luis');
    },
    function(session,results,next){
        console.log(session.userData.intent);
        if(session.userData.intent=='yes'){
            session.userData.trigger='ezone 1';
            next();
            console.log(session.userData.trigger);
        }else if(session.userData.intent=='no'){
            session.userData.trigger='ezone not continue 1';
            session.beginDialog('issue');
        }else if(session.userData.intent=='question'){
            session.beginDialog('question');
        }else{
            session.beginDialog('issue');
        }
    },
    function(session,results){
        if(session.userData.intent=='yes'){
            session.beginDialog('ezone');
        }else{
            var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
            session.send(back.back);
            session.beginDialog('ezone1');
        }
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
            next();
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
        if(session.userData.intent=='yes'){
            session.beginDialog('ezone');
        }else{
            var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
            session.send(back.back);
            session.beginDialog('ezone2');
        }
    }
]);

bot.dialog('ezone3',[
    function(session){
        session.send('Okay %s...',session.userData.name);
        builder.Prompts.text(session,'Shall we proceed?');
    },
    function(session,results){
        session.beginDialog('luis');
    },
    function(session,results,next){
        console.log(session.userData.intent);
        if(session.userData.intent=='yes'){
            session.userData.trigger='ezone 3';
            next();
            console.log(session.userData.trigger);
        }else if(session.userData.intent=='no'){
            session.userData.trigger='ezone not continue 3';
            session.beginDialog('issue');
        }else if(session.userData.intent=='question'){
            session.beginDialog('question');
        }else{

        }
    },
    function(session,results){
        if(session.userData.intent=='yes'){
            session.beginDialog('ezone');
        }else{
            var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
            session.send(back.back);
            session.beginDialog('ezone3');
        }
    }
]);

bot.dialog('question?',[
    function(session,results,next){
        builder.Prompts.text(session,'Do you have any questions?');
    },
    function(session,results){
        session.beginDialog('luis');
    },
    function(session,results,next){
        console.log(session.userData.intent);
        if(session.userData.intent=='yes'){
            session.beginDialog('question');
        }else if(session.userData.intent=='no'){
            session.endDialog();
        }else if(session.userData.intent=='question'){
            session.beginDialog('question');
        }else{
            session.beginDialog('question?');
        }
    },
    function(session,results,next){
        session.beginDialog('question');
    },
    function(session,results){
        session.send('I hope that answered your question %s',session.userData.name);
        //session.delay(4000);
        //session.userData.question = {};
        //session.userData.trigger = {};
        session.beginDialog('morequestions?');
    }
]);

bot.dialog('morequestions?',[
    function(session,results,next){
        builder.Prompts.text(session,'Do you have any more questions?');
    },
    function(session,results){
        session.beginDialog('luis');
    },
    function(session,results,next){
        console.log(session.userData.intent);
        if(session.userData.intent=='yes'){
            session.userData.trigger = 'no q';
            next();
        }else if(session.userData.intent=='no'){
            next();
        }else if(session.userData.intent=='question'){
            session.beginDialog('question');
        }else{
            session.beginDialog('morequestions?');
        }
    },
    function(session,results,next){
        if(session.userData.intent == 'yes'){
            session.beginDialog('question');
        }else{
            session.endDialog(); 
        }
    },
]);

bot.dialog('issue',[
    function(session){
        session.send('%s, could you please look into this?',session.userData.poc);
        session.delay(4000);
        builder.Prompts.choice(session, 'Alternatively, you can choose an instance where you want to go...', "Mode|ID3|Experience Zone|Question|Feedback|Restart|End|Cancel", { listStyle: 4 });
    },
    function(session,results){
        if(results.response.entity=='Mode'){
            session.send('Okay, heading over to Mode...');
            session.beginDialog('confirm');
        }else if(results.response.entity=='ID3'){
            session.send('Okay, heading over to ID3...');
            session.beginDialog('id3');
        }else if(results.response.entity=='Experience Zone'){
            session.send('Okay, heading over to Experience Zone narrative');
            session.beginDialog('ezone1');
        }else if(results.response.entity=='Feedback'){
            session.send('Okay, heading over to Feedback...');
            session.beginDialog('feedback');
        }else if(results.response.entity=='Question'){
            session.send('Okay, heading over to Questions...');
            session.beginDialog('question?');
        }else if(results.response.entity=='Restart'){
            session.send('Okay, starting over...');
            session.beginDialog('/');
        }else if(results.response.entity=='End'){
            session.send('Okay...');
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

bot.dialog('end',[
    function(session){
        sendimage(session,'https://i.imgur.com/x45dZYT.png','Thank You');
        session.delay(3000);
        var bye={"bye":['Good bye!','See you','Thank you. Good bye','So long!','See you again']};
        builder.Prompts.text(session,bye.bye);
    },
    function(session,results){
        session.beginDialog('luis');
    },
    function(session,results){
        if (session.userData.intent== 'bye'){
            session.beginDialog('end');
        }else {
            session.send('The session has ended. Type help to go to a specefic instance');
            session.beginDialog('end')
        }

    }
]).triggerAction({
    matches: /^bye$|^goodbye$|^good bye*see you/i
});

function sendimage(session,url,title) {
    var msg = new builder.Message(session);
    msg.attachments([
        new builder.HeroCard(session)
            .title(title)
            .images([builder.CardImage.create(session, url)])
    ]);
    session.send(msg);
}