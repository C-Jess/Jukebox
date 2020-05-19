const express = require('express');
const request = require('request')
const querystring = require('querystring');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

var client_id = '3c1ec652d8a9423490aa85829980d813'; // Your client id
var client_secret = '998c005db1974d98992789d78c4d66be'; // Your secret
var redirect_uri = 'http://localhost:5000/callback'; // Your redirect uri

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

            res.redirect('http://localhost:3000/player?' + querystring.stringify({
                access_token: access_token
            }));
        }
        else {
            res.redirect('http://localhost:3000/player?' + querystring.stringify({
                error: 'invalid_token'
            }));
        }
    });
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));