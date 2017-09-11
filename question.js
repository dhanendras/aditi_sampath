var builder = require('botbuilder');
var restify = require('restify');
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
var server = restify.createServer();
const conn = new mysql.createConnection(config);
server.listen(port, function() {
  console.log('%s listening at %s', server.name, server.url);
});
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2e39461e-9c53-44eb-8b3c-ebc41ce1bd2c?subscription-key=468963da9804413788459981febe3bb6&verbose=true&timezoneOffset=0&spellCheck=true&q=';
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
const intent = new builder.IntentDialog({
    recognizers: [
        new builder.LuisRecognizer(LuisModelUrl)
    ]
});
var bot = new builder.UniversalBot(connector,[
    function(session){
        session.beginDialog('asset');
    }
]);
//bot.set(`persistUserData`, false);


bot.dialog('asset',[
    function(session){
        session.userData={};
        builder.Prompts.text(session,'Let me know if you are looking for a specific information from our Asset Catalogue.');
    },
    function(session,results){
        var response = session.message.text;
        builder.LuisRecognizer.recognize(response, LuisModelUrl, function (err, intents, entities,next){
            var results = {};
            results.intents == intents;
            results.entities==entities;
            console.log('%s',JSON.stringify(entities));
            console.log('%s',JSON.stringify(intents));
            if(intents[0].intent=='asset_info'){
                if(entities.length==2){
                    if(entities[0].type=='info'){
                        session.userData.asset = entities[1].entity;
                        session.conversationData.asset = entities[1].entity;
                        session.userData.info = entities[0].entity;
                        session.beginDialog('assetInfo');
                    }else if(entities[1].type=='info'){
                        session.userData.asset = entities[0].entity;
                        session.conversationData.asset = entities[0].entity;
                        session.userData.info = entities[1].entity
                        session.beginDialog('assetInfo');
                    } else{
                        session.send('Hmm...I did not quite get that, please rephrase');
                        session.beginDialog('asset');
                    }
                }else if(entities.length==1){
                    if(entities[0].type=='asset'){
                        session.userData.asset = entities[0].entity;
                        session.conversationData.asset = entities[0].entity;
                        session.beginDialog('assetInfo');
                    }else{
                        session.send('Sorry I could not get the Asset name properly. Please rephrase?');
                        session.beginDialog('asset');
                    }
                }
                else{
                    session.send('Sorry I could not get the Asset name properly. Please rephrase?');
                    session.beginDialog('asset');
                }

            }else if(intents[0].intent=='inno_area'){
                if(entities[0].type=='area'){
                    session.userData.area = entities[0].entity;
                    session.beginDialog('getasset');
                }else{
                    session.send('Hmm...I did not quite get that, please rephrase');
                    session.beginDialog('asset');
                }
            }else if(intents[0].intent=='no'){
                session.send('Okay, let us move on...');
                session.beginDialog('questions');
            }else if(intents[0].intent=='no'){
                session.beginDialog('smallTalk');
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
        session.beginDialog('asset');
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
            if(intents[0].intent=='asset_info'){
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
    function(session,results,next){
        conn.connect();
        var we ={"we": ['We have the following Assets related %s from our catalogue','I found the following assets under %s','Our Asset Catalogue has the following assets under %s']};
        var key = session.userData.asset||session.conversationData.asset;
        var sql = "SELECT * FROM asset_demo_2 WHERE asset_keywords LIKE '%"+key+"%'";
        session.send(we.we,key);
        console.log(session.userData.asset);
        console.log(session.userData.info);
        conn.query(sql, function (err,results,fields) {
            i=0;
            console.log('%s',JSON.stringify(results));
            if(!results){
                session.send('I did not find anything related to that in our database');
                session.beginDialog('asset');
            }else{
                if(session.userData.asset!=null&&session.userData.info!=null){
                    for(i=0;i<results.length;i++){
                        var summary = results[i].asset_summary;
                        var poc = results[i].asset_poc;
                        var type = results[i].asset_type;
                        if(session.userData.info=='summary'){
                            session.send('Here is the brief summary:');
                            session.send('%s',summary);
                        }else if(session.userData.info=='poc'){
                            session.send('This team is led by %s',poc);
                        } else{
    
                        }
                    }
                } else if(session.userData.info==null){
                    session.beginDialog('assetnew');
                    //builder.Prompts.choice(session, "What would you like to know about it?", "Summary|POC|Type|Cancel", { listStyle: 4 });
                }
                next();
                
            }
                    //conn.end();
                    //builder.Prompts.choice(session, "Please choose one option", "Back to Innovation areas|Another Asset|Next", { listStyle: 4 });
            
            //console.log('%',);
        });
    },
    function(session){
        builder.Prompts.choice(session, "Please choose one option", "Back to Innovation areas|Another Asset|Next", { listStyle: 4 });
        session.userData={};
    },
    function(session,results){
        if(results.response.entity=='Back to Innovation areas'){
            session.beginDialog('asset');
        }else if(results.response.entity=='Another Asset'){
            session.beginDialog('asset');
        }else if(results.response.entity=='Next'){
            session.beginDialog('anyQuestions');
        }else{
            session.send('Invalid selection');

        }
    }
]);

bot.dialog('assetnew',[
    function(session){
        builder.Prompts.choice(session, "What would you like to know about it?", "Summary|POC|Type|Cancel", { listStyle: 4 });
    },
    function(session,results,next){
        if(results.response.entity=='Summary'){
            session.userData.info='summary';
            next();
            //session.beginDialog('assetInfo');
        }else if(results.response.entity=='POC'){
            session.userData.info='POC';
            next();
            //session.beginDialog('assetInfo');
        }else if(results.response.entity=='Type'){
            session.userData.info='type';
            next();
            //session.beginDialog('assetInfo');
        }else if(results.response.entity=='Cancel'){
            session.send('Okay, going back...')
            session.beginDialog('asset');
        }else{
            session.send('Invalid selection');
            session.beginDialog('assetnew');
        }
    },
    function(session,results){
        session.beginDialog('assetInfo');
        console.log(session.userData.asset);
        console.log(session.userData.info);
    }
]);