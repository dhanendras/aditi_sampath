
var builder = require('botbuilder');
var restify = require('restify');
var analyticsService = require('./models/text-analytics');
var QnAClient = require('./client');
const mysql = require('mysql2');

var port = process.env.PORT || 8080;
var config =
{
    host: 'myserver4aditibot.mysql.database.azure.com',
    user: 'aditi.bot@myserver4aditibot',
    password: 'digass@1234',
    database: 'aditidb',
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

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/00075350-0d1e-4f2d-8f6e-75e253066b43?subscription-key=e512d01835354a6f829e54078ca66503&timezoneOffset=0&verbose=true&q=  ';



// Create bot

var connector = new builder.ChatConnector({
    appId: '9513ae39-73af-4ac0-bef8-d09c700976f4',
    appPassword: 'NXyqhPz3kDjuUFEmdyekWeB'
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
        var hey ={"hey":['Hello, welcome to Infinity Labs','Hey there, welcome to Infinity Labs','Hi, welcome to Infinity Labs'],"aditi":['Aditi here','My name is Aditi','This is Aditi']};
        session.send(hey.hey);
        session.send(hey.aditi);
        session.beginDialog('name');
    },

    function(session,results){
        session.beginDialog('error');
},
    function(session){
        session.beginDialog('asset');
    }
]);

/*bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                bot.beginDialog(message.address, '/');
            }
        });
    }
});*/

bot.dialog('name',[
    function(session){
        var intro ={"know": ['May I bother you to introduce yourself?','Could you please introduce yourself?','May I know your name?','How about yours?','And you are?']};
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
                var response = session.message.text;
                builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
                    var results = {};
                    results.entities == entities;
                    console.log('%s',JSON.stringify(entities));
                    session.userData.name = {};
                    if(entities[0].type=='name'||entities[0].entity=='encyclopedia'){
                        var name = entities[0].entity;
                        var hey ={"hey": ['Hello %s','Hey %s','Nice to meet you %s','Hey there %s','Hola %s','Great meeting you %s']};
                        session.send(hey.hey,name);   
                        session.userData.name=name;
                    }else{
                        session.send('That name seems too elegant for me...');
                        session.beginDialog('name');    
                    }
                session.beginDialog('greet');
                
                })
                
            }
            else{
                if(topIntent=='SmallTalk'){
                    session.beginDialog('smallTalk');
                }else if(topIntent=='no'){
                    var he={"he":['Haha, I did not expect that...','I really need a name for a smooth conversation...','Sorry, but I need to know your name...']}
                    session.send(he.he);
                    session.beginDialog('name');
                } else{
                    session.send('Sorry, I did not quite get that');
                    session.beginDialog('name');
                }
            }
    })
},
    function(session,results){
        var back ={"back":['So where were we again? yes..','What were we talking about? yes...']};
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
        
                analyticsService.getScore(response).then(score => {            
                    var newScore = parseFloat(score);
                    if (!isNaN(newScore)) {
                            if (newScore > 0.75) {
                                var good = {"good" :['Great','That is good to hear','Excellent','Good to know that']};
                                session.send(good.good);
                                session.beginDialog('service1')
                            } 
                            else if (newScore < 0.25) {
                                var bad = {"bad":['I am sorry to hear that','That is unfortunate','Oh I am sorry','Oh oh']};
                                session.send(bad.bad);
                                //session.send('Maybe this presentation will cheer you up');
                                session.beginDialog('cheer1');
                            } 
                            else {
                                if(topIntent=='SmallTalk'&&intents[0].score>0.8){
                                    session.beginDialog('smallTalk');
                                }else if(topIntent=='no'){
                                    var bad = {"bad":['I am sorry to hear that','That is unfortunate','Oh I am sorry','Oh oh']};
                                    session.send(bad.bad);
                                    //session.send('Maybe this presentation will cheer you up');
                                    session.beginDialog('cheer1');
                                }
                                else{
                                    var zero = {"zero":['Same here','Just an other ordinary day then','Seems alright','Good to know']};
                                    session.send(zero.zero);
                                    session.beginDialog('service1');
                            }
                        }
                        }
                })
            
                 
                    
        })
    },
    function(session,results){
        var back ={"back":['So where were we again? yes..','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('greet');
    }
]);
//hello it's sampath. 
bot.dialog('garage',[
    function(session){
        session.send('This is our Innovation Garage. We have interns from universities across India working on projects related to:');
        builder.Prompts.choice(session,'Please choose an area to know more about current projects.', "Quantum computing|Mobility|Machine learning|IOT|Image processing|Cyber security|Blockchain|Augmented reality|Artificial intelligence", { listStyle: 4 });
    },
    function(session,results,next){
        if(results.response.entity=='Quantum computing'){
            session.userData.proj=1;
            next();
        }else if(results.response.entity=='Mobility'){
            session.userData.proj=2;
            next();
        }else if(results.response.entity=='Machine Learning'){
            session.userData.proj=3;
            next();
        }else if(results.response.entity=='IOT'){
            session.userData.proj=4;
            next();
        }else if(results.response.entity=='Image processing'){
            session.userData.proj=5;
            next();
        }else if(results.response.entity=='Cyber security'){
            session.userData.proj=6;
            next();
        }else if(results.response.entity=='Blockchain'){
            session.userData.proj=7;
            next();
        }else if(results.response.entity=='Augmented reality'){
            session.userData.proj=8;
            next();
        }else if(results.response.entity=='Artificial intelligence'){
            session.userData.proj=9;
            next();
        }else if(results.response.entity=='Move on'){
            session.userData.proj=9;
            session.send('Okay let us move on');
            session.beginDialog('ezone1');
        }else{
            session.send('Invalid selection');
        }
    },
    function(session,results){
        session.beginDialog('garage2');
    }
]);
bot.dialog('garage2',[
    function(session,results,next){
        if(session.userData.proj==1){
            session.send('We have the following ongoing projects: quantum cryptography, quantum blockchain,quantum machine learning ');
            next();
        }else if(session.userData.proj==2){
            session.send('We have the following ongoing projects: Task management agile projects, securing traffic violtion details of the users, development of a map view of all government institutions, simple chat application in Android and ios');
            next();
        }else if(session.userData.proj==3){
            session.send('We have the following ongoing projects: creating a digital experience of infinity labs');
            next();
        }else if(session.userData.proj==4){
            session.send('We have the following ongoing projects: tracking abandoned carts using Lora technology, electronic shelf label, integrating autonomous car');
            next();
        }else if(session.userData.proj==5){
            session.send('We have the following ongoing projects: securing authenticity using blockchain by capturing fingerprint, biometric blockchain verification');
            next();
        }else if(session.userData.proj==6){
            session.send('We have the following ongoing projects: automation of penetration tools using python and ML, developing a new communication protocol for private network, ransomware using ML ');
            next();
        }else if(session.userData.proj==7){
            session.send('We have the following ongoing projects: secruring the land registry details, media player desktop application, browser addon');
            next();
        }else if(session.userData.proj==8){
            session.send('We have the following ongoing projects: data visualisation templates, Creating an AR experience room ');
            next();
        }else if(session.userData.proj==9){
            session.send('We have the following ongoing projects: AI enabled finance trading system, development of a context sensitive dynamic feedback platform ');
            next();
        }
    },
    function(session,results){
        builder.Prompts.choice(session,'Please choose an option', "Another Area|Move on|Lab trivia", { listStyle: 4 });
    },
    function(session,results,next){
        if(results.response.entity=='Another area'){
            session.beginDialog('garage');
        }else if(results.response.entity=='Move on'){
            session.send('Okay, moving on...');
            session.beginDialog('ezone1');
        }else if(results.response.entity=='Move on'){
            session.beginDialog('garage3');
        }
    }
]);

bot.dialog('garage3',[
    function(session){
        var facts = {"facts":[' Infinity labs is UST\'s innovation incubation system.','Infinity labs is located at 5 cities worldwide(Trivandrum,Aliso Viejo,Bentonville,Tel Aviv,Madrid ) and 4 more coming in Leon,London,Costa Rica,Bangalore','These are some of the fields in which infinity labs is involved : Knowledge management system , accelerated training , industry specific models etc.','These are some of the highlights of infinity labs @ Trivandrum : Innovation in machine learning and AI , Blockchain innovations , Vibrant internship programs , Social platforms','Infinity labs occassionally conduct various programs like hackathons , ideathons , tech talks and trainings.','Infinity labs research areas includes : smart cities and digital Governments , industrial IOT , Blockchain and digital finance, cyber defence , quantum computing and cryptography.','Infinity labs have completed almost 70 business problems , 12 hackathons , 25 tech talks , 150 Academic internships and involved in many activities in 200 days.']}
        session.send('%s',facts.facts);
        builder.Prompts.text(session,'Would you like to know more facts?');
    },
    function(session,results,args){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            if(intents[0].intent=='SmallTalk'){
                session.beginDialog('smallTalk');
            }else if(intents[0].intent=='yes'||intents[0].intent=='done'){
                session.send('Sure thing %s',session.userData.name);
                session.beginDialog('garage3');
            }else if(intents[0].intent=='no'){
                session.send('Okay %s moving on');
                session.beginDialog('ezone1');
            }else{
                session.send('I did not quite get that');
                session.beginDialog('garage3');
            }
        })
    },
    function(session,results){
        var back ={"back":['So where were we again? yes..','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('garage3');
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
        var on ={"on":['Shall we move on to our first Demo?','Let us move on to our first Demo, shall we?','All right, let us start with our first Demo shall we?']};
        builder.Prompts.text(session,on.on);
    },
    function(session,results,args){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            if(intents[0].intent=='yes'||intents[0].intent=='done'){
                session.beginDialog('ezone4');
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
                session.beginDialog('ezone4');
            }
        })
    }
]);



bot.dialog('ezone4',[

    function(session,results){
        session.send('We have scheduled a demo on UST Maya Robotic Process Automation. It is led by Muralikrishnan Nair. This asset falls under our Infrastructure Management area with the puropose of resolving IMS related issues and tickets.');
        session.send('The following video would give you a better idea');
        const msg = new builder.Message(session);
        msg.addAttachment({contentType: 'video/mp4', contentUrl: 'https://www.youtube.com/watch?v=BenViYeVyLE'});
        session.send(msg);
        session.beginDialog('ezone5');
    }]);
    
bot.dialog('ezone5',[
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
                session.send('Hope you got a fair understanding of our asset');
                session.beginDialog('anyQuestions');
            }else{
                session.send('Are you done? I could not understand...');
                session.beginDialog('ezone5');
            }
        })
    },
    function(session,results){
        var back ={"back":['So where were we again? yes..','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('ezone5');
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
                session.beginDialog('question');
            }
        });
    }
]);

bot.dialog('service1',[
    function(session){
        session.send('Let me give you a brief overview of our Service Catalog...');
        var ser = {"ser":['We have the following kinds of services. Let me know which one you would like to explore...','These are our service offerings in broad terms. Let me know which one you would like to explore...','Our service offerings can be categorised into the following types. Let me know which one you would like to explore...']}
        builder.Prompts.choice(session,ser.ser, "Transformational|Technology|Lifecycle|Platforms", { listStyle: 4 });
    },
    function(session,results,next){
        if(results.response.entity=='Transformational'){
            session.userData.service1='Transformational';
            next();
        }else if(results.response.entity=='Technology'){
            session.userData.service1='Technology';
            next();
        }else if(results.response.entity=='Lifecycle'){
            session.userData.service1='Lifecycle';
            next();
        }else if(results.response.entity=='Platforms'){
            session.userData.service1='Platforms';
            next();
        }else{
            session.send('Invalid selection');
        }
    },
    function(session,results){
        session.beginDialog('service3');
    }
]);

bot.dialog('service3',[
    function(session){
        session.send();
        var ser = {"ser":['We have the following categories','These are our service offerings ','Our service offerings can be categorised into the following lines']}
        builder.Prompts.choice(session,ser.ser,'Consulting|Innovation|Security|Organizational', { listStyle: 4 });
    },
    function(session,results,next){
        if(results.response.entity=='Consulting'){
            session.userData.service2='Consulting';
            next();
        }else if(results.response.entity=='Innovation'){
            session.userData.service2='Innovation';
            next();
        }else if(results.response.entity=='Security'){
            session.userData.service2='Seurity';
            next();
        }else{
            session.send('Invalid selection');
        }
    },
    function(session,results){
        session.beginDialog('service4');
    }
]);

bot.dialog('service4',[
    function(session,results,next){
        conn.connect();
        var key = session.userData.service2;
        var sql = "SELECT * FROM service_catalog WHERE subcategory LIKE '%"+key+"%'";
        conn.query(sql, function (err,results,fields) {
            i=0;
            var service = [];
            console.log('%s',JSON.stringify(results));
            for(i=0;i<results.length;i++){
            service.push(results[0].service);
            }
            console.log('%',service);
            session.send('We have %d services related to %s under %s',results.length,session.userData.service2,session.userData.service1);
        }
        );
        //conn.end();
        if(results!={}){
            next();
        }
        //session.beginDialog('assetSelect');
    },
    function(session,results){

        session.beginDialog('service5');
    }
]);

bot.dialog('service5',[
    function(session){
        session.send('Please refer to the comprehensive list on the television screen')
        builder.Prompts.text(session,'Let me know if you are looking for a specefic service from the list');
    },
    function(session,results){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            results.entities==entities;
            console.log('%s',JSON.stringify(intents));
            console.log('%s',JSON.stringify(entities));
            if(intents[0].intent=='question'){
                if(entities[0].type=='area'){
                    session.userData.service3 = entities[0].entity;
                    session.beginDialog('getService');
                }else{
                    session.send('Oops, I could not get the service line you mentioned...');
                    session.beginDialog('service5');
                }
            }else if(intents[0].intent=='SmallTalk'){
                    session.beginDialog('smallTalk');
            }else if(intents[0].intent=='no'){
                session.send('Okay, let us move on...');
                session.beginDialog('service7');
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

bot.dialog('getService',[
    function(session,results){
        conn.connect();
        var key = session.userData.service3;
        var sql = "SELECT * FROM service_catalog WHERE service LIKE '%"+key+"%'";
        conn.query(sql, function (err,results,fields) {
            i=0;
            console.log('%s',JSON.stringify(results));
            if(!results){
                session.send('I did not find anything related to that in our database');
                session.beginDialog('service5');
            }else{
            var advantages = results[0].advantages;
            var person = results[0].person;
            var cases= results[0].case;
            session.send("This service is led by %s. %s are some related case studies. The advantage layers for this service include %s",person,cases,advantages);
            //conn.end();
            builder.Prompts.choice(session, "Please choose one option", "Another Service|Another Category|Another Servie Type|Move on", { listStyle: 4 });
            //console.log('%',);
        }
        });
    },
    function(session,results){
        if(results.response.entity=='Another Service'){
            session.beginDialog('service5');
        }else if(results.response.entity=='Another Category'){
            session.beginDialog('service3');
        }else if(results.response.entity=='Another Servie Type'){
            session.beginDialog('service1');
        }else if(results.response.entity=='Move on'){
            session.beginDialog('ezone1');
        }else{
            session.send('Invalid selection');

        }
    }
]);

bot.dialog('asset',[
    function(session){
        builder.Prompts.text(session,'Now that we are done with the demo would you like to know more about our Asset Catalog?');
    },
    function(session,results){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            results.entities==entities;
            console.log('%s',JSON.stringify(intents));
            if(intents[0].intent=='yes'){
                session.beginDialog('asset1');
                
            }else if(intents[0].intent=='SmallTalk'){
                    session.beginDialog('smallTalk');
            }else if(intents[0].intent=='no'){
                session.send('Okay, let us move on...');
                session.beginDialog('feedback');
            }else{
                session.send('Sorry I could not understand...');
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

bot.dialog('asset1',[
    function(session){
        session.send('Please refer to the television screen for a comprehensive list of our Assets.');
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



bot.dialog('getasset',[
    function(session,results,next){
        conn.connect();
        var we ={"we": ['We have the following Assets in %s from our catalogue','I found the following assets under %s','Our Asset Catalogue has the following assets under %s']};
        var key = session.userData.area;
        var sql = "SELECT * FROM asset_catalog WHERE asset_keywords LIKE '%"+key+"%'";
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
        var sql = "SELECT * FROM asset_catalog WHERE asset_keywords LIKE '%"+key+"%'";
        session.send(we.we,key);
        conn.query(sql, function (err,results,fields) {
            i=0;
            console.log('%s',JSON.stringify(results));
            if(!results){
                session.send('I did not find anything related to that in our database');
                session.beginDialog('asset');
            }else{
            var summary = results[i].asset_summary;
            var poc = results[i].asset_poc;
            var type = results[i].asset_type;
            session.send("This asset comes under the '%s' type",type);
            session.send('Here is the brief summary:');
            session.send('%s',summary);
            session.send('This team is led by %s',poc);
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
            session.beginDialog('feedback');
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
            if(responseThree.length)
            if (intents[0].intent == 'yes') {
                session.send('Okay');
                session.beginDialog('question')
            } else if(intents[0].intent=='no'){
                session.send('Okay, let us continue');
                session.beginDialog('asset');
            } else{
                session.send('I did not quite get that.')
                session.beginDialog('anyQuestions')
            }
                   
            
        })
    }   

]);

bot.dialog('question',[
    function(session,results){
        builder.Prompts.text(session,'It seems you have a question. Could you please repeat it for me?');
        ////var question = session.message.text;
        // add question to DB
    },
    function(session,results,next){
        session.send('Muralikrishnan Nair would be able to explain you in detail');
        builder.Prompts.text(session,'Murali, please let me know when you are done');
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
                    session.beginDialog('asset');
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
        builder.Prompts.choice(session, "Please choose one option", "Service|Garage|Demo|Asset|Questions|Feedback|Restart|End", { listStyle: 4 });
    },
    function(session,results){
        if(results.response.entity=='Service'){
            session.send('Okay, heading over to Service Catalog...');
            session.beginDialog('service1');
        }else if(results.response.entity=='Garage'){
            session.send('Okay, heading over to Garage narrative...');
            session.beginDialog('garage');
        }else if(results.response.entity=='Asset'){
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
        }else if(results.response.entity=='Demo'){
            session.send('Okay moving on to Demo');
            session.beginDialog('ezone1');
        }else if(results.response.entity=='End'){
            session.send('Okay');
            session.beginDialog('end');
        } else{
            session.beginDialog('help')
        }
}]).triggerAction({
    matches: /^help$|^start over$|^go back*restart/i
});



bot.dialog('feedback',[
    function(session){
        session.send('Well, that marks the end of this tour...');
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
                        session.beginDialog('morefb');
                    } 
                    else if (newScore > 0.5) {
                        session.send('Thanks for that positive input %s. We hope to impress you next time',session.userData.name);
                        session.beginDialog('morefb');
                    } 
                    else {
                        session.send('Thank you for the honest input %s. We will definetly work on it',session.userData.name);
                        session.beginDialog('input');
                    }

                }
            })
        }
    ]);

bot.dialog('input',[
    function(session){
        builder.Prompts.text(session,'Please leave a feedback mentioning the areas I can improve. I am constantly learning!');
    },
    function(session,results){
        session.send('Thank you for the input...');
        session.beginDialog('morefb');
    }
]);

bot.dialog('morefb',[
    function(session,results){
        var more = {"more":['Would you like to add anything else?','Is there anything else you would like to add?']};
        builder.Prompts.text(session,more.more)
    },
    function(session,results){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            results.entities==entities;
            console.log('%s',JSON.stringify(intents));
            if(intents[0].intent=='no'){
                session.send('Okay, moving on...');
                session.beginDialog('end');
            }else if(intents[0].intent=='yes'){
                session.beginDialog('feedback');
            }else{
                if(intents[0].intent=='SmallTalk'){
                    session.beginDialog('smallTalk');
                }
            }
        })
    },
    function(session,results){
        var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('morefb');
    }
]);

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
bot.dialog('cheer1',[
    function(session){
        var jokes = {"jokes":['The past, present and future walked into a bar. It was tense','']}
        session.send(jokes.jokes);
        session.send('Hope that made your day slightly better...');
        session.beginDialog('cheer2');
    }
]);

bot.dialog('cheer2',[
    function(session){
        builder.Prompts.text(session,'Shall we move on?');
    },
    function(session,results){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities) {
            var results = {};
            results.intents = intents;
            if (intents[0].intent == 'yes'||intents[0].intent=='done'){
                session.send('Happy to cheer you...');
                session.beginDialog('service1');
            }else if(intents[0].intnet='SmallTalk'){
                session.beginDialog('smallTalk');
            }else if(intents[0].intent=='no'){
                session.send('Well, let me tell you another joke then...');
                session.beginDialog('cheer1');
            }else{
                session.send('Sorry I did not quite get that');
                session.beginDialog('cheer2')
            }
        })
    },
    function(session,results){
        var back ={"back":['So where were we again? yes...','What were we talking about? yes...']};
        session.send(back.back);
        session.beginDialog('cheer2');
    }
]);