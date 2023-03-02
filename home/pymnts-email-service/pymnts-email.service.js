require('dotenv').config();


const mailgun = require("mailgun-js");

function sendVerificationEmail (to, subject, html) {
    const apiKey = process.env.MAILGUN_API_KEY;
    const baseUrl = 'https://api.mailgun.net/v3/pymnts.com';
    
    const mg = mailgun({apiKey: apiKey, domain: 'pymnts.com'});
    
    const data = {
        from: 'PYMNTS <noreply@pymnts.com>',
        to, 
        subject: 'Welcome to PYMNTS Premium', 
        html
    };
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });
}

//sendVerificationEmail('mwood@pymnts.com', , 'Hello <b>Michael</b>');
