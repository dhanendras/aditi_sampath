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

/*function sendInline(session, filePath, contentType, attachmentFileName) {
    fs.readFile(filePath, function (err, data) {
        if (err) {
            return session.send('Oops. Error reading file.');
        }

        var base64 = Buffer.from(data).toString('base64');

        var msg = new builder.Message(session)
            .addAttachment({
                contentUrl: util.format('data:%s;base64,%s', contentType, base64),
                contentType: contentType,
                name: attachmentFileName
            });

        session.send(msg);
    });
}*/

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
    if(session.userData.demotype=='Quick'){
        session.delay(3000);
        session.send('The infographic displays the geographical locations of our innovation centres and the areas where each centre primarily focuses.');
        session.delay(8000);
        session.send('The labs in Trivandrum and Aliso Vejo have the maximum customer exposure.');
        session.delay(5000);
        session.send('Each lab has a particular focus area mentioned.');
        session.delay(4000);
        session.endDialog();
    }else{
        session.delay(3000);
        session.send('The inphographic displays the geographical locations of our innovation centres and the areas where each centre primarily focuses.');
        session.delay(5000);
        session.send('The labs in Trivandrum and Aliso Vejo have the maximum customer exposure.');
        session.delay(4000);
        session.send('The lab in Trivandrum focuses on Digital Technologies. The lab in Aliso Vejo focuses on Legacy modernization. We have a retail focus lab in Bentonville, cyber security focus lab in Tel Aviv and a fintech lab in Madrid.');
        session.delay(10000);
        session.send('Leon, London, Costa Rica and Bangalore...These labs are in our pipeline for further expansion');
        session.delay(7000);
        session.endDialog();
    }
    
}

function assets(session, results, next){
    session.delay(3000);
    session.send('These are our assets categorized according to the fields');
    session.delay(4000);
    session.send('The red boxes indicate finished Products');
    session.send('The green boxes are the assets in MVC stage ');
    session.delay(4000);
    session.send('The white boxes indicates assets that are in the MVP stage');
    session.delay(4000);
    session.endDialog();
}

function research(session,results,next){
    session.delay(3000);
    session.send('These are the various areas we focus on...');
    session.delay(4000);
    session.endDialog();
}
function success(session,results){
    session.send('Since our inception, we had over 150 academic interns, solved over 70 business problems and organised over 25 Hackathons');
    session.delay(11000);
    session.endDialog();
}
