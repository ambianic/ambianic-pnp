// Room server
const express = require('express');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const compression = require('compression');
const crypto = require('crypto');
const requestIp = require('request-ip');


function ExpressRoom(realm) {
  const app = express.Router();

  // Automatically allow cross-origin requests
  app.use(cors({ origin: true }));
  app.use(cookieParser());
  app.use(compression());

  // console.log('realm', realm)
  let secret = realm.getSecret();

  app.use(
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

  /**
    Get unique room name based on client's public IP address.
    Presumably devices located in the same physical room share the same
    trusted local WiFi/LAN and hence same public IP.

    Clients can find each other on the LAN once they exchange
    WebRTC SDP offers via the shared pnp room.

    Room name is generated such that all clients with
    the same public IP will find each other in the same room.

    Clients that do not share the same public IP should not be unable to
    accidentally or intentionally join each other's rooms.
  */
  app.get('/id', async (req, res) => {
    const ip = getClientPublicIp(req)
    console.log('Calculating room name for public IP', ip)
    const roomName = crypto
      .createHmac('sha1', realm.getSecret())
      .update(ip)
      .digest('hex');
    console.log('Calculated room name %s for public IP %s', roomName, ip)
    res.json({ roomName });
  });

  /**
    Get a list of all member peers in the same room (same room key).
    Requires room key.
  */
  app.get('/:roomId/members', (req, res) => {
    const { roomId } = req.params;

    const clientsIds = realm.getRoomMembers(roomId);

    return res.send(clientsIds);
  });

  /**
    Join a peer room.
  */
  app.post('/:roomId/join', (req, res) => {
    const { roomId } = req.params;

    const clientsIds = realm.joinRoom(roomId);

    return res.send(clientsIds);
  });

  /**
    Get a list of all member peers in the same room.
  */
  app.post('/:roomId/leave', (req, res) => {
    const { id, roomId } = req.params;

    const wasInRoom = realm.leaveRoom(id, roomId);

    return res.send(wasInRoom);
  });

  return app;

}


module.exports = ({ realm }) => {
  // console.log('realm', realm)
  const app = new ExpressRoom(realm);
  return app
};
