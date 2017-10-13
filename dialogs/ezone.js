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
            session.userData.image='assets';
            sendInline(session,'https://imgur.com/u00RE5B','Assets');
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
        contentUrl: contentUrl,
        contentType: 'image/png',
        name: name
    });
    session.send(msg);
    if(session.userData.image=='locations'){
        locations(session);
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

function assets(session, results, next){
    session.delay(3000);
    session.send('These are our assets categoraized according to the fields');
    session.delay(2000);
    session.send('The red boxes');
    session.send('The green boxes ');
    session.delay(2000);
    session.send('The white boxes');
    session.endDialog();
}

