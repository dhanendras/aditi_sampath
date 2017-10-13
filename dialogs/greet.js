var builder = require('botbuilder');
var d = new Date();
var time = d.getHours();
var ling = require('../linguistics');

module.exports = [
 
        function(session){
            var intro ={"know": ['May I bother you to introduce yourself?','Could you please introduce yourself?','May I know your good name?']};
            builder.Prompts.text(session,intro.know);
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
                        session.userData.name={};
                        session.endDialog();
                        session.userData.trigger='not NN'
                    }
                    next();
                }); 
            }else{
                luis.luis(session.message.text).then(result => {            
                    console.log(JSON.stringify(result));
                });
                console.log(session.userData.intent);
            }
        },
        function(session,results,next){
            console.log(session.userData.name)
            if(session.userData.name!=null){
                if(session.userData.intent=='intro'){
                    if(session.userData.entityType=='name'||session.userData.entityType=='encyclopedia'){
                        session.userData.name=session.userData.entity;
                    }else{
                        session.endDialog()
                    }
                }else{
    
                }
            }else{
                next();
            }
            
        },
        function(session,results,next){
            builder.Prompts.text(session,'%s, did I get that right?');
        },
        function(session,results,next){
            session.beginDialog('luis');
        }
];
    
