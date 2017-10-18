var builder = require('botbuilder');
var fs = require('fs');
var util = require('util');

module.exports = [
    function(session,results,next){
        if(session.userData.trigger=='ezone 1'){
            session.userData.image='locations';
            sendimage(session, 'http://imgsv.imaging.nikon.com/lineup/lens/zoom/normalzoom/af-s_dx_18-140mmf_35-56g_ed_vr/img/sample/sample1_l.jpg','Locations');
       }else{
            next();
        }
    },
    function(session,results,next){
        if(session.userData.trigger=='ezone 2'){
            session.userData.image='assets';
            sendimage(session,'http://imgsv.imaging.nikon.com/lineup/lens/zoom/normalzoom/af-s_dx_18-140mmf_35-56g_ed_vr/img/sample/sample1_l.jpg','Assets');
        }else{
            next();
        }
    },
    function(session,results,next){
        
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
    }
}

function sendurl(session, contentUrl, name) {
    var msg = new builder.Message(session)
    .addAttachment({
        contentUrl: contentUrl,
        contentType: 'image',
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
    if(session.userData.demotype=='Quick'){
        session.delay(3000);
        session.send('The inphographic displays the geographical locations of our innovation centres and the areas where each centre primarily focuses.');
        session.delay(2000);
        session.send('The labs in Trivanrum and Aliso Vejo have the maximum customer exposure.');
        session.delay(3000);
        session.send('Each lab has a particular focus area mentioned.');
        session.delay(3000);
        session.endDialog();
    }else{
        session.delay(3000);
        session.send('The inphographic displays the geographical locations of our innovation centres and the areas where each centre primarily focuses.');
        session.delay(2000);
        session.send('The labs in Trivanrum and Aliso Vejo have the maximum customer exposure.');
        session.delay(3000);
        session.send('The lab in Trivandrum focuses on Digital Technologies. The lab in Aliso Vejo focuses on Legacy modernization. We have a retail focus lab in Bentonville, cyber security focus lab in Tel Aviv and a fintech lab in Madrid.');
        session.delay(3000);
        session.send('Leon, London, Costa Rica and Bangalore...These labs are in our pipeline for further expansion');
        session.delay(3000);
        session.endDialog();
    }
    
}

function assets(session, results, next){
    session.delay(3000);
    session.send('These are our assets categoraized according to the fields');
    session.delay(2000);
    session.send('The red boxes indicate assets in the MVP stage.');
    session.send('The green boxes are the assets in MVC stage ');
    session.delay(2000);
    session.send('The white boxes indicates assets that are still in our pipeline');
    session.delay(3000);
    session.endDialog();
}

