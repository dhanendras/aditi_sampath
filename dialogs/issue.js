module.exports = [
    function(session){
        session.send('Gokul, could you please look into this?');
        builder.Prompts.choice(session, "Alternatively, you can choose an instance where you want to go...", "ID3|Garage|Experience Zone|Feedback|Restart|End|Cancel", { listStyle: 4 });
    },
    function(session,results){
        if(results.response.entity=='ID3'){
            session.send('Okay, heading over to ID3...');
            session.userData.dialog='id3';
        }else if(results.response.entity=='Garage'){
            session.send('Okay, heading over to Garage narrative...');
            session.userData.dialog='garage';
        }else if(results.response.entity=='Experience Zone'){
            session.send('Okay, heading over to E Zone narrative');
            session.userData.dialog='ezone';
        }else if(results.response.entity=='Feedback'){
            session.send('Okay, heading over to Feedback...');
            session.userData.dialog='feedback';
        }else if(results.response.entity=='Restart'){
            session.send('Okay, starting over...');
            session.userData.dialog='/';
        }else if(results.response.entity=='End'){
            session.send('Okay');
            session.userData.dialog='end';
        }else if(results.response.entity=='Cancel'){
            session.send('Okay');
            session.userData.trigger=='cancel';
        } else{
            session.beginDialog('help')
        }
    },
    function(session,results){
        session.endDialog();
    }

]