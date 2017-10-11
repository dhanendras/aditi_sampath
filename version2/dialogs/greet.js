var builder = require('botbuilder');
var d = new Date();
var time = d.getHours();
var connector = new builder.ChatConnector({
    appId: '9513ae39-73af-4ac0-bef8-d09c700976f4',
    appPassword: 'NXyqhPz3kDjuUFEmdyekWeB'
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector,[

]);

module.exports = [
    bot.dialog('/',[

    ]);
    bot.dialog('one',[
        function(session){
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
            i=0;
            if(i==0){next();}
        },
        
    ]);
    bot.dialog('name',[
        function(session){
            var intro ={"know": ['May I bother you to introduce yourself?','Could you please introduce yourself?','May I know your good name?']};
            builder.Prompts.text(session,intro.know);
        },
        function(session,results){
            var tokens = session.message.text.split(" ");
            if(tokens.length==1){
                console.log(tokens);
                ling.ling(session.message.text).then(result => {            
                    console.log(JSON.stringify(result));
                    if(result=='NN'){
                        session.userData.name=session.message.text;
                    }else{
                        session.userData.name={};
                    }
                    next();
                }); 
            }else{
                session.beginDialog('luis');
            }
        },
        function(session,results){
            if(session.userData.name=={}){
    
            }
        }
    ]);
],
    
exports.name = text =>{
    
}
