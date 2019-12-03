const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

// Room server
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const compression = require('compression');
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const requestIp = require('request-ip');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(cookieParser());
app.use(compression());

async function cryptoSeed() {
  var buf = crypto.randomBytes(48);
  token = buf.toString('hex');
  return token
}

/**
Get a crypto safe secret key that is persisted and constant between
client requests and sessions. It will be used for room id generation.
*/
async function getSecret() {
  // get crypto safe secret from firestore
  console.log('Fetching secret from database...');
  let snapshot = await admin.database().ref('/admin/secret').once('value');
  let secret = snapshot.val()
  console.log('Fetched secret', secret);
  // if not found, create and store new secret
  if (!secret) {
    secret = await cryptoSeed()
    console.log('Created new secret', secret);
    // store secret
    snapshot = await admin.database().ref('/admin').set({secret: secret});
    console.log('Inserted secret at admin/secret');
    let snapshot = await admin.database().ref('/admin/secret').once('value');
    secret = snapshot.val()
    console.log('value in db', secret);
  }
  return secret
}

getSecret().then( (secret) => {
  // enable long lived https sessions
  return app.use(
      cookieSession({
      cookie: {
        // secure: true,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
      secret,
      proxy: true,
    })
  );
}).catch((error) => {
    console.error('Error setting up cookie session:', error);
});

// Add middleware to authenticate requests
// app.use(myMiddleware);


function getClientPublicIp(req) {
  console.log('Request', req)
  console.log('Request headers', req.headers)
  console.log('Request cf-connecting-ip', req.headers['cf-connecting-ip'])
  console.log('Request ip', req.ip)
  let ip = requestIp.getClientIp(req);
  console.log('Final client public ip resolution', ip)
  if (ip) {
    return ip
  } else {
    throw new Error(
          'Unable to determine client IP address.' +
          'Please consider reporting this issue at ' +
          'https://github.com/ambianic/ambianic-pnp/issues'
    )
  }
}

//
// API server
//

// build multiple CRUD interfaces:
// app.get('/:id', (req, res) => res.send(Widgets.getById(req.params.id)));

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
app.post('/', async (req, res) => {
  // Grab the text parameter.
  console.log('POST request', req);
  console.log('POST query', req.query);
  console.log('POST body', req.body);
  const original = req.body.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  console.log('Inserting message', original);
  const snapshot = await admin.database().ref('/messages').push({original: original});
  // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
  console.log('Inserted message at', snapshot.ref.toString());
  res.redirect(303, snapshot.ref.toString());
});

// app.put('/:id', (req, res) => res.send(Widgets.update(req.params.id, req.body)));
// app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));
// app.get('/', (req, res) => res.send(Widgets.list()));

/**
  Get unique room id based on client's public IP hash.
  Presumably clients located in the same room share the same
  trusted local WiFi/LAN and hence same public IP.

  Clients can find each other on the LAN once they exchange
  WebRTC SDP offers via the shared firebase room.

  Room id ensures that clients with
  the same public IP will always find each other in the same room id.

  Clients that do not share the same public IP should be unable to
  accidentally or intentionally land in anyone else's room.
*/
app.get('/room', async (req, res) => {
  const ip = getClientPublicIp(req)
  const name = crypto
    .createHmac('sha1', await getSecret())
    .update(ip)
    .digest('hex');
  res.json({ name });
});

/**
  Create a firebase authentication token
  for a remote client, so it can access data
  in its designated firebase room space.
*/
app.get('/auth', async (req, res) => {
  const ip = getClientPublicIp(req);
  const userId = uuidv1();
  let additionalClaims = {
    public_ip: ip
  };
  customToken = await admin.auth().createCustomToken(userId, additionalClaims)
  res.json({ id: userId, customToken, public_ip: ip });
});


// Expose Express API as a single Cloud Function:
exports.pnp = functions.https.onRequest(app);

// exports.addMessage = functions.https.onRequest(async (req, res) => );

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
/*
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
      // Grab the current value of what was written to the Realtime Database.
      const original = snapshot.val();
      console.log('Uppercasing', context.params.pushId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return snapshot.ref.parent.child('uppercase').set(uppercase);
    });
*/
