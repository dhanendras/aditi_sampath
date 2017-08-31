
var builder = require('botbuilder');
var restify = require('restify');
var analyticsService = require('./models/text-analytics');
var QnAClient = require('./client');
const mysql = require('mysql2');

var port = process.env.PORT || 8080;
var config =
{
    host: 'myserver4adithipro.mysql.database.azure.com',
    user: 'adithi.pro@myserver4adithipro',
    password: 'Bot@1234',
    database: 'adithipro_db',
    port: 3306,
    ssl: true
};

const conn = new mysql.createConnection(config);

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);
server.get(/\/public\/?.*/, restify.serveStatic({
    directory: __dirname
}));
server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00075350-0d1e-4f2d-8f6e-75e253066b43?subscription-key=468963da9804413788459981febe3bb6&timezoneOffset=0&verbose=true&q= ';



// Create bot

var connector = new builder.ChatConnector({
    appId: '6c3e1d15-2432-402b-86b2-4b6b8f5b25a1',
    appPassword: 'iKXaa1a6Tap6Un6XBLjFk6i'
});

var qnaClient = new QnAClient({
    knowledgeBaseId: 'fe330b26-130f-4cba-b303-c4e3d509de94',
    subscriptionKey: 'ce99e7727cad4a788f15ead7b57a01ab'
    // Optional field: Score threshold
});

server.post('/api/messages', connector.listen());

//luis intent recogniser
const intent = new builder.IntentDialog({
    recognizers: [
        new builder.LuisRecognizer(LuisModelUrl)
    ]
});

/*
var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

*/

var bot = new builder.UniversalBot(connector,[
    function(session){
       session.send('Welcome to Infinity Labs.');
        session.send('My name is Aditi');
        session.beginDialog('name');
    },
    
    
function(session,results){
    session.beginDialog('error');
},
    function(session){
        session.beginDialog('asset');
    }
]);

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});

bot.dialog('name',[
    function(session){
        var intro ={"know": ['May I bother you to introduce yourself?','Could you please introduce yourself?','May I know your name(s)?','How about you?','And you are?']};
        builder.Prompts.text(session,intro.know);
    },
    function(session,next){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.entities == entities;
            results.intents == intents;
            console.log('%s',JSON.stringify(intents));
            topIntent = intents[0].intent;
            if(topIntent=='intro'){
                console.log('intent intro');
                var response = session.message.text;
                builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
                    var results = {};
                    results.entities == entities;
                    //session.send('%s',JSON.stringify(entities));
                    i = 0;
                    session.userData.names = {};
                    for(i==0;i<entities.length;i++){
                    if(entities[i].type=='name'||entities[0].entity=='encyclopedia'){
                        var name = entities[i].entity;
                        var hey ={"hey": ['Hello %s','Hey %s','Nice to meet you %s','Hey there %s','Hola %s','Great meeting you %s']};
                        session.send(hey.hey,name);   
                        //session.beginDialog('greet');
                    }else{
                        session.send('That name is too elegant for me. Care to repeat it?');
                        session.beginDialog('name');    
                    }
                }
                session.userData.name=name;
                session.beginDialog('greet');
                
                })
                
            }
            else{
                if(topIntent=='SmallTalk'){
                    session.beginDialog('smallTalk');
                }else if(topIntent=='no'){
                    session.send('Sorry but I need to know your name');
                    session.beginDialog('name');
                } else{
                    session.send('Sorry, I did not quite get that');
                    session.beginDialog('name');
                }
            }
    })
},
    function(session,results){
        var back ={"back":['Okay let us get back to introduction','So where were we again? yes..','What were we talking about? yes...']};
        session.send(back.back)
        session.beginDialog('name');
    }
]);

bot.dialog('greet',[    
    function(session,results,args,next){
        var day = {"day": ['How was your day so far?','Had a good day so far?',]}
        builder.Prompts.text(session,day.day);
    },
    function(session,results){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            topIntent=intents[0].intent;
            console.log('%s',JSON.stringify(intents));
            if(topIntent=='SmallTalk' && intents[0].score>0.8){
                session.beginDialog('smallTalk');
            } else{
                analyticsService.getScore(response).then(score => {            
                    var newScore = parseFloat(score);
                    if (!isNaN(newScore)) {
                            if (newScore > 0.75) {
                                var good = {"good" :['Great','That is good to hear','Excellent','Good to know that']};
                                session.send(good.good);
                                session.beginDialog('ezone1')
                            } 
                            else if (newScore < 0.25) {
                                var bad = {"bad":['I am sorry to hear that','That is unfortunate','Oh I am sorry','Oh oh']};
                                session.send(bad.bad);
                                session.send('Maybe this presentation will cheer you up')
                                session.beginDialog('ezone1');
                            } 
                            else {
                                var zero = {"zero":['Same here','Just an other ordinary day then','Seems alright','Good to know']};
                                session.send(zero.zero);
                                session.beginDialog('ezone1');
                            }
                        }
                })
            }
                 
                    
        })
    },
    function(session,results){
        var back ={"back":['So where were we again? yes..','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('greet');
    }
]);

bot.dialog('ezone1',[
    function(session){
        var fol ={"fol":['Please follow the directions on screen to our Experience Zone','The next session is in our Experience Zone. Please move on there...','Let us continue our discussion in our Experience Zone. Please move on there']};
        session.send(fol.fol);
        builder.Prompts.text(session, 'Let me know when you are done');
    },
    function(session,results,args){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            if(intents[0].intent=='SmallTalk'){
                session.beginDialog('smallTalk');
            }else if(intents[0].intent=='yes'||intents[0].intent=='done'){
                session.beginDialog('ezone2');
            }else{
                session.send('I did not quite get that');
                session.beginDialog('ezone1');
            }
        })
    },
    function(session,results){
        var back ={"back":['So where were we again? yes..','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('ezone1');
    }
]);

bot.dialog('ezone2',[

    function(session,results){
        var on ={"on":['Shall we move on to our Innovation Ecosystem?','Let us move on to our Innovation Ecosystem, shall we?','All right, let us start with our Innovation Ecosystem shall we?']}
        builder.Prompts.text(session,on.on);
    },
    function(session,results,args){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            if(intents[0].intent=='yes'||intents[0].intent=='done'){
                session.beginDialog('ezone3');
            }else if(intents[0].intent=='no'){
                builder.Prompts.text(session,'Are you sure you want to skip it?');
            
                
                
            }else if(intents[0].intent=='SmallTalk'){
                session.beginDialog('smallTalk');
            }else{
                session.send('I did not quite get that');
                session.beginDialog('ezone2');
            }
        })
    },
    function(session,results){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            if(intents[0].intent=='yes'){
                session.send('Okay, let us skip it');
                session.beginDialog('asset');
            }else{
                session.send('Great, I promise you it will be worth it');
                session.beginDialog('ezone3');
            }
        })
    }
]);

bot.dialog('ezone3',[

    function(session,results){
        session.send('Let us start with a brief video which talks about our Innovation Ecosystem.');
        const msg = new builder.Message(session);
        msg.addAttachment({contentType: 'video/mp4', contentUrl: 'https://www.youtube.com/watch?v=BenViYeVyLE'});
        session.send(msg);
        session.beginDialog('ezone4');
    }]);
    
bot.dialog('ezone4',[
    function(session,results){
        builder.Prompts.text(session,'Please let me know when you are done with the video');
    },
    function(session,results,args){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            if(intents[0].intent=='SmallTalk'){
                session.beginDialog('smallTalk');
            }else if(intents[0].intent=='yes'||intents[0].intent=='done'){
                session.send('Hope you got a fair understanding of our Innovation ecosystem. The presentations might continue for 20 more mins. Please feel free to make the best use of the chairs around');
                session.send('Now that you have an idea on the areas we focus,');
                session.beginDialog('asset');
            }else{
                session.send('I did not quite get that');
                session.beginDialog('ezone4');
            }
        })
    },
    function(session,results){
        var back ={"back":['So where were we again? yes..','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('ezone4');
    }
]);


bot.dialog('smallTalk',[
    function(session,args){        
        // Post user's question to QnA smalltalk kb
        qnaClient.post({ question: session.message.text }, function (err, results) {
            if (err) {
                console.error('Error from callback:', err);
                session.send('Oops - something went wrong.');
                return;
            }

            if (results) {
                // Send reply from QnA back to user
                session.send(results);
                session.endDialog();
            } else {
                // Put whatever default message/attachments you want here
                session.send('Hmm, I didn\'t quite understand you there. Care to rephrase?')
            }
        });
    }
]);


bot.dialog('asset',[
    function(session){
        builder.Prompts.text(session,'Let me know if you are looking for a specific innovation area from our Asset Catalogue.');
    },
    function(session,results){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            results.entities==entities;
            console.log('%s',JSON.stringify(intents));
            if(intents[0].intent=='question'){
                if(entities[0].type=='area'){
                    session.userData.area = entities[0].entity;
                    session.beginDialog('getasset');
                }else{
                    session.send('Sorry I could not get the innovation area, please rephrase');
                    session.beginDialog('asset');
                }
            }else if(intents[0].intent=='SmallTalk'){
                    session.beginDialog('smallTalk');
            }else if(intents[0].intent=='no'){
                session.send('Okay, let us move on...');
            }else{
                session.send('Please ask for an innovation area');
                session.beginDialog('asset');
            }
        })
    },
    function(session,results){
        var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('asset');
    }
]);


bot.dialog('hey',[
    function(session,results){
        session.send('Hey there! I thought we were done with the introduction');
    }
]).triggerAction({
    matches : 'greet',
    onSelectAction : (session,args,next) => {
        session.beginDialog(args,action, args);
    }
});

bot.dialog('getasset',[
    function(session,results,next){
        conn.connect();
        var we ={"we": ['We have the following Assets in %s from our catalogue','I found the following assets under %s','Our Asset Catalogue has the following assets under %s']};
        var key = session.userData.area;
        var sql = "SELECT * FROM asset_demo_2 WHERE asset_keywords LIKE '%"+key+"%'";
        session.send(we.we,key);
        conn.query(sql, function (err,results,fields) {
            i=0;
            console.log('%s',JSON.stringify(results));
            for(i=0;i<results.length;i++){
            var assets = results[i].asset_name;
            session.send('%d. %s',i+1,assets);
            console.log('%',assets);
            }
        }
        );
        //conn.end();
        if(results!={}){
            next();
        }
        //session.beginDialog('assetSelect');
    },
    function(session,results){
        session.beginDialog('assetSelect');
    }
]);

bot.dialog('assetSelect',[

    function(session,results){
        var more = {"more":['Would you like to know more about these assets?','Need more information about any of these assets?']};
        builder.Prompts.text(session,more.more)
    },
    function(session,results){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            results.entities==entities;
            console.log('%s',JSON.stringify(intents));
            if(intents[0].intent=='question'){
                if(entities[0].type=='area'){
                    session.userData.asset = entities[0].entity;
                    session.beginDialog('assetInfo');
                }else{
                    session.send('Sorry I could not get the Asset name, please rephrase');
                    session.beginDialog('assetSelect');
                }
            }else if(intents[0].intent=='no'){
                session.beginDialog('questions');
            }else{
                if(intents[0].intent=='SmallTalk'){
                    session.beginDialog('smallTalk');
                }
                session.send('Please ask for an Asset name');
                session.beginDialog('assetSelect');
            }
        })
    },
    function(session,results){
        var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('assetSelect');
    }
]);

bot.dialog('assetInfo',[
    function(session,results){
        conn.connect();
        var we ={"we": ['We have the following Assets in %s from our catalogue','I found the following assets under %s','Our Asset Catalogue has the following assets under %s']};
        var key = session.userData.asset;
        var sql = "SELECT * FROM asset_demo_2 WHERE asset_keywords LIKE '%"+key+"%'";
        session.send(we.we,key);
        conn.query(sql, function (err,results,fields) {
            i=0;
            console.log('%s',JSON.stringify(results));
            if(!results){
                session.send('I did not find anything related to that in our database');
                session.beginDialog('asset');
            }else{
            for(i=0;i<results.length;i++){
            var summary = results[i].asset_summary;
            var poc = results[i].asset_poc;
            var type = results[i].asset_type;
            session.send('This product type is %s',type);
            session.send('Here is the brief summary:');
            session.send('%s',summary);
            session.send('This team is led by %s',poc);
            }
            //conn.end();
            builder.Prompts.choice(session, "Please choose one option", "Back to Innovation areas|Another Asset|Next", { listStyle: 4 });
            //console.log('%',);
        }
        });
    },
    function(session,results){
        if(results.response.entity=='Back to Innovation areas'){
            session.beginDialog('asset');
        }else if(results.response.entity=='Another Asset'){
            session.beginDialog('assetSelect');
        }else if(results.response.entity=='Next'){
            session.beginDialog('anyQuestions');
        }else{
            session.send('Invalid selection');

        }
    }
]);

bot.dialog('anyQuestions',[
    function(session){
        session.send('Okay %s',session.userData.name);
        builder.Prompts.text(session,'Do you have any questions?');
    },
    function(session,results,args,next){
        var responseThree = session.message.text;
        builder.LuisRecognizer.recognize(responseThree, LuisModelUrl, function (err, intents, entities) {
            var resultTwo = {};
            resultTwo.intents = intents;
            if (intents[0].intent == 'yes') {
                    session.send('Okay');
                    session.beginDialog('question')
                } else if(intents[0].intent=='no'){
                    session.send('Okay, let us continue');
                    session.beginDialog('feedback');
                } else{
                    session.send('I did not quite get that.')
                    session.beginDialog('anyQuestions')
                }
            
            })
    }   

])

bot.dialog('question',[
    function(session,results){
        builder.Prompts.text(session,'It seems you have a question. Could you please repeat it for me?');
        ////var question = session.message.text;
        // add question to DB
    },
    function(session,results,next){
        session.send('<POC> would be able to explain you in detail');
        builder.Prompts.text(session,'<POC>, please let me know when you are done');
    },
    function(session,results){
        //wait
        builder.Prompts.text(session,'I hope that answered your question?');    
    },
    function(session,results,args,next){
        var responseThree = session.message.text;
        builder.LuisRecognizer.recognize(responseThree, LuisModelUrl, function (err, intents, entities) {
            var resultTwo = {};
            resultTwo.intents = intents;
            if (intents[0].intent == 'yes') {
                    session.send('Glad to hear');
                    session.beginDialog('moreQuestions');
                } else{
                    session.send('Hmm...Maybe the rest of the presentation would bring you more clarity');
                    session.beginDialog('moreQuestions');
                } 
            
            })
    }   
/*]).triggerAction({
    matches : 'question',
    onSelectAction : (session,args,next) => {
        session.beginDialog(args,action, args);
    }*/
]);

bot.dialog('moreQuestions',[
    function(session,args,next){
        builder.Prompts.text(session,'Any more questions on this topic?');
    },
    function(session,results){
        var responseFour = session.message.text;
        builder.LuisRecognizer.recognize(responseFour, LuisModelUrl, function (err, intents, entities) {
            var resultThree = {};
            resultThree.intents = intents;
            if (intents[0].intent == 'yes') {
                    session.send('Okay');
                    session.beginDialog('question');
                } else if(intents[0].intent=='no') {
                    session.send('Wonderful. Let us continue.');
                    session.endDialog();
                } else {
                    session.send('I did not quite get that');
                    session.beginDialog('moreQuestions');
                }
            })               
    },
        function(session,results){
            session.endDialog();
        }
]);

bot.dialog('help',[
    function(session){
        builder.Prompts.choice(session, "Please choose one option", "Innovation Ecosystem|Asset Catalog|Questions|Feedback|Restart", { listStyle: 4 });
    },
    function(session,results){
        if(results.response.entity=='Innovation Ecosystem'){
            session.send('Okay, heading over to Innovation Ecosystem...');
            session.beginDialog('ezone2');
        }else if(results.response.entity=='Asset Catalog'){
            session.send('Okay, heading over to Asset Catalog...');
            session.beginDialog('asset');
        }else if(results.response.entity=='Questions'){
            session.send('Okay, heading over to Questions...');
            session.beginDialog('anyQuestions');
        }else if(results.response.entity=='Restart'){
            session.send('Okay, starting over...');
            session.beginDialog('/');

        }else if(results.response.entity=='Feedback'){
            session.send('Okay, heading over to Feedback section');
            session.beginDialog('feedback');
        } else{
            session.beginDialog('help')
        }
}]).triggerAction({
    matches: /^help$|^start over$|^go back*restart/i
});



bot.dialog('feedback',[
    function(session){
        var fb ={"fb": ['How did you find the tour?','What do you think about the tour?','So what do have have to say about the tour?']}
        session.send(fb.fb);
        builder.Prompts.text(session,'We would appreciate a candid feedback');
    },
    function (session, results, next) {

        analyticsService.getScore(results.response).then(score => {
            
            var newScore = parseFloat(score);
            if (!isNaN(newScore)) {
                    if (newScore > 0.8) {
                        session.send('Thanks %s! It means a lot to us. Hope we get to see you again',session.userData.name);
                        next();
                    } 
                    else if (newScore > 0.5) {
                        session.send('Thanks for that positive input %s. We hope to impress you next time',session.userData.name);
                        next();
                    } 
                    else {
                        session.send('Thank you for the honest input %s. We will definetly work on it',session.userData.name);
                        next();
                    }

                }
            })
        },
        function(session,results){
            session.endConversation();
        }
    ]);