const listenPort = 6215;
require('dotenv').config();

const hostname = 'node.pymnts.com';
const privateKeyPath = `/etc/letsencrypt/live/${hostname}/privkey.pem`;
const fullchainPath = `/etc/letsencrypt/live/${hostname}/fullchain.pem`;

const mailgun = require("mailgun-js");
const express = require('express');
const https = require('https');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.static('public'));
app.use(express.json({limit: '200mb'})); 
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});


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

const httpsServer = https.createServer({
    key: fs.readFileSync(privateKeyPath),
    cert: fs.readFileSync(fullchainPath),
  }, app);
  

  httpsServer.listen(listenPort, () => {
    console.log(`HTTPS Server running on port ${listenPort}`);
});



//sendVerificationEmail('mwood@pymnts.com', , 'Hello <b>Michael</b>');
