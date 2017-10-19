var qna = require('../client');
var builder = require('botbuilder');

exports.client = (session,text) => {      
    // Post user's question to QnA smalltalk kb
    qna.post({ question: text }, function (err, results) {
        if (err) {
            console.error('Error from callback:', err);
            session.send('Oops - something went wrong.');
            return;
        }
        if (results) {
            // Send reply from QnA back to user
            session.send(results);
            session.userData.question = 'yes';
            console.log('no err');
            //session.endDialog();
        } else {
            // Put whatever default message/attachments you want here
            //session.endDialog();
            console.log('no answer');
            session.userData.question = 'no';
        }
    });
}