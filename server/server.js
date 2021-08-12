require('dotenv').config();
const express = require('express');
const request = require('request')
const querystring = require('querystring');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const port = process.env.PORT;
const host = process.env.HOST;

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = process.env.REDIRECT_URI;

app.get('/login', (req,res) => {
    var scope = 'streaming user-read-email user-read-private user-modify-playback-state user-read-playback-state';
    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri
    }));
});

app.get('/callback', (req,res) => {
    var code = req.query.code
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
  
            var access_token = body.access_token;

            res.redirect('/player?' + querystring.stringify({
                access_token: access_token
            }));
        }
        else {
            res.redirect('/player?' + querystring.stringify({
                error: 'invalid_token'
            }));
        }
    });
});

app.listen(port, host, () => console.log(`Server started on ${host}:${port}`));