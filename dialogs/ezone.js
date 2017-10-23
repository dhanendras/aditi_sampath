var builder = require('botbuilder');
var fs = require('fs');
var util = require('util');

module.exports = [
    function(session,results,next){
        if(session.userData.trigger=='ezone 1'){
            session.userData.image='locations';
            sendimage(session, 'https://i.imgur.com/ZcOQHUB.png','Locations worldwide');
       }else{
            next();
        }
    },
    function(session,results,next){
        if(session.userData.trigger=='ezone 2'){
            session.userData.image='assets';
            sendimage(session,'https://i.imgur.com/9hpNji2.png','Asset Catalog');
        }else{
            next();
        }
    },
    function(session,results,next){
        if(session.userData.trigger=='ezone 3'){
            session.userData.image='research';
            sendimage(session,'https://i.imgur.com/SkghhSa.png','Research Areas');
        }else{
            next();
        }
    },
    function(session,results,next){
        session.userData.image='success';
        sendimage(session,'https://i.imgur.com/EZ78zrb.png','Success Story');
    }

]

function sendimage(session,url,title) {
    var msg = new builder.Message(session);
    msg.attachments([
        new builder.HeroCard(session)
            .title(title)
            .images([builder.CardImage.create(session, url)])
    ]);
    session.send(msg);
    if(session.userData.image=='locations'){
        locations(session);
    }else if(session.userData.image=='assets'){
        assets(session);
    }else if(session.userData.image=='research'){
        research(session);
    }else{
        success(session);
    }
}


function locations(session, results, next){
    session.delay(3000);
    session.send('The infographic displays the geographical locations of our innovation centres and the areas where each centre primarily focuses. The labs in Trivandrum and Aliso Vejo have the maximum customer exposure. Leon, London, Costa Rica and Bangalore These labs are in our pipeline for further expansion');
    session.delay(10000);
    session.endDialog();
}

function assets(session, results, next){
    session.delay(2000);
    session.send('The assets in green are in the MVC stage, those in white are in the MVP stage and the assets in red indicate finished products');
    session.delay(5000);
    session.endDialog();
}

function research(session,results,next){
    session.delay(2000);
    session.send('These are the various areas we focus on ');
    session.delay(3000);
    session.endDialog();
}
function success(session,results){
    session.send('Since our inception, we had over 150 academic interns, solved over 70 business problems and organised over 25 Hackathons');
    session.delay(7000);
    session.endDialog();
}
