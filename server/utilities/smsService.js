
const accountSid = 'AC5f3e503e5baa5c305989ed678a8bad65';
const authToken = '99dd1a785af06a058bfa8a602b2a2f26';
const client = require('twilio')(accountSid, authToken);

const sendSMS = (body) => {
    client.messages
        .create({
            body: body.message,
            from: '+15707638989',
            to: body.to
        })
        .then(message => console.log(message.sid))
        .done();
};

module.exports = {sendSMS};