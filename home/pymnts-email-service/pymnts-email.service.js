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

const jwt = require('jsonwebtoken');

const app = express();
app.use(express.static('public'));
app.use(express.json({limit: '200mb'})); 
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/sendVerificationEmail', (req, res) => {
    return new Promise((resolve, reject) => {
        let { firstName, lastName, title, company, country, email, html, newsLetter, key, path } = req.body;
    
        if (!firstName || !lastName || !title || !company || !country || !email || !newsLetter || !key || !html || !path) {
            res.status(400).send('missing parameters');
            return resolve('error');
        }

        console.log('sendVerificationEmail', email);
        
        if (key !== 'dkj30udjpiwer057q0roigjasogypa34yuweoifjsd;goeyrt89') {
            res.status(401).send('invalid key');
        }

        let token = jwt.sign({
            firstName, lastName, title, company, country, email, newsLetter, path
        }, process.env.SECRET_KEY, {expiresIn: '3h'});
        
        html = html.replaceAll('TOKEN_URL', `https://pymnts.com/email-services/verify-email?t=${token}`);
        //html = html.replaceAll('TOKEN_URL', `https://cnn.com`);

        sendVerificationEmail(email, html);

        res.status(200).send('ok');
    })

})


function sendVerificationEmail (to, html) {
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
