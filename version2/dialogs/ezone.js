var builder = require('botbuilder');
var fs = require('fs');
var util = require('util');
var luis = require('../luis');
module.exports = [
    function(session,results){
        session.userData.image='locations';
        sendInline(session, './images/locations.png', 'image/png', 'Locations');
    },
    function(session,results,next){
        luis.luis(session.message.text).then(result => {            
            console.log(JSON.stringify(result));
            if(intents[0].intent=='yes'){
                next();
            }else if(intents[0].intent=='no'){
                session.endDialog();
                session.userData.trigger='pod not continue';
            }
        });
    },
    function(session,results,next){
        session.userData.image='pods';
        sendInline(session,'./images/innopods.png','image/png','Pods');
    },

]
function sendInline(session, filePath, contentType, attachmentFileName) {
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
        if(session.userData.image=='locations'){
            locations(session);
        }else if(session.userData.image=='pods'){
            pods(session);
        }else if(session.userData.image=='assets'){
            assets(session);
        }
        
    });
}

function locations(session, results, next){
    session.delay(3000);
    session.send('The inphographic displays the geographical locations of our innovation centres and the areas where each centre primarily focuses.');
    session.delay(2000);
    session.send('The labs in Trivanrum and Aliso Vejo have the maximum customer exposure.');
    session.send('The lab in Trivandrum focuses on Digital Technologies. The lab in Aliso Vejo focuses on Legacy modernization. We have a retail focus lab in Bentonville, cyber security focus lab in Tel Aviv and a fintech lab in Madrid.');
    session.delay(2000);
    session.send('Leon, London, Costa Rica and Bangalore...These labs are in our pipeline for further expansion');
    builder.Prompts.text(session,'Next, we will move on to Innovation Pods. Is that alright?');
}

function lpods(session, results, next){
    session.delay(3000);
    session.send('The inphographic displays the geographical locations of our innovation centres and the areas where each centre primarily focuses.');
    session.delay(2000);
    session.send('The labs in Trivanrum and Aliso Vejo have the maximum customer exposure.');
    session.send('The lab in Trivandrum focuses on Digital Technologies. The lab in Aliso Vejo focuses on Legacy modernization. We have a retail focus lab in Bentonville, cyber security focus lab in Tel Aviv and a fintech lab in Madrid.');
    session.delay(2000);
    session.send('Leon, London, Costa Rica and Bangalore...These labs are in our pipeline for further expansion');
    builder.Prompts.text(session,'Next, we will move on to Innovation Pods. Is that alright?');
}

