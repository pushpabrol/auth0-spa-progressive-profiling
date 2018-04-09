const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');

require('dotenv').config();

const port = process.env.CONTACTS_API_PORT;
const domain = process.env.AUTH0_DOMAIN;


var whitelist = [process.env.CORS_ALLOWED_APP];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

// Validate the access token and enable the use of the jwtCheck middleware
app.use(jwt({
  // Dynamically provide a signing key based on the kid in the header
  // and the singing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer
  audience: 'organise',
  issuer: `https://${domain}/`,
  algorithms: [ 'RS256' ]
}));

// Middleware to check scopes
const checkPermissions = function (req, res, next) {
  console.log('checkPermissions');
  if(req.user.scope.includes("deny:alloperations"))  res.status(401).send({message: 'You can not execute any operations till your profile is complete!'});
  switch (req.path) {
    case '/api/contacts': {
      var permissions = ['read:contacts'];
      for (var i = 0; i < permissions.length; i++) {
        if (req.user.scope.includes(permissions[i])) {
          console.log('checkPermissions next');
          next();
        } else {
          
          res.status(401).send({message: 'Forbidden'});
          return;
        }
      }
      break;
    }
    default:
    res.status(401).send({message: 'Forbidden'});
  }
  

};

app.use(checkPermissions);

app.get('/api/contacts', function (req, res) {
  console.log('here');
  //res.setHeader('Content-Type', 'application/json');
  res.json({ contacts: [
    { name: 'Jane', email: 'jane@example.com' },
    { name: 'John', email: 'john@example.com' }
  ] });
});

app.listen(port, function () {
  console.log('Contacts API started on port: ' + port);
});
