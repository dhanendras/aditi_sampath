var builder = require('botbuilder');
var fs = require('fs');
var util = require('util');

module.exports = [
    function(session,results,next){
        if(session.userData.trigger=='ezone 1'){
            session.userData.image='locations';
            sendInline(session, 'https://imgur.com/sYolJEp', 'Locations');
        }else{
            next();
        }
    },
    function(session,results,next){
        if(session.userData.trigger=='ezone 2'){
            session.userData.image='pods';
            sendInline(session,'./images/innopods.png','image/png','Pods');
        }else{
            next();
        }
    },
    function(session,results,next){
        
    }

]
function sendInline(session, contentUrl, name) {
    var msg = new builder.Message(session)
    .addAttachment({
        contentUrl: contenturl,
        contentType: 'image/png',
        name: name
    });

        session.send(msg);
        if(session.userData.image=='locations'){
            locations(session);
        }else if(session.userData.image=='pods'){
            pods(session);
        }else if(session.userData.image=='assets'){
            assets(session);
        }
        
    }

function locations(session, results, next){
    session.delay(3000);
    session.send('The inphographic displays the geographical locations of our innovation centres and the areas where each centre primarily focuses.');
    session.delay(2000);
    session.send('The labs in Trivanrum and Aliso Vejo have the maximum customer exposure.');
    session.send('The lab in Trivandrum focuses on Digital Technologies. The lab in Aliso Vejo focuses on Legacy modernization. We have a retail focus lab in Bentonville, cyber security focus lab in Tel Aviv and a fintech lab in Madrid.');
    session.delay(2000);
    session.send('Leon, London, Costa Rica and Bangalore...These labs are in our pipeline for further expansion');
    session.endDialog();
}

function pods(session, results, next){
    session.delay(3000);
    session.send('Innovation pods is UST\'s innovation acceleration method that we have developed to discover and develop' );
    session.delay(2000);
    session.send('The labs in Trivanrum and Aliso Vejo have the maximum customer exposure.');
    session.send('The lab in Trivandrum focuses on Digital Technologies. The lab in Aliso Vejo focuses on Legacy modernization. We have a retail focus lab in Bentonville, cyber security focus lab in Tel Aviv and a fintech lab in Madrid.');
    session.delay(2000);
    session.send('Leon, London, Costa Rica and Bangalore...These labs are in our pipeline for further expansion');
    builder.Prompts.text(session,'Next, we will move on to Innovation Pods. Is that alright?');
}


