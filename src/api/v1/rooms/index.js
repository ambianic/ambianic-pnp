// Room server
const express = require('express');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const compression = require('compression');
const crypto = require('crypto');
const requestIp = require('request-ip');

module.exports = ({ realm }) => {
  // console.log('realm', realm)
  // const app = new ExpressRoom(realm);

  const app = express.Router({ mergeParams: true });

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
    // console.log('Request', req)
    // console.log('Request headers', req.headers)
    // console.log('Request cf-connecting-ip', req.headers['cf-connecting-ip'])
    console.log('rooms: getClientPublicIp Http Request ip', req.ip)
    let ip = requestIp.getClientIp(req);
    console.log('rooms: Final client public ip resolution', ip)
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
    Get unique room ID based on client's public IP address.
    Presumably devices located in the same physical room share the same
    trusted local WiFi/LAN and hence same public IP.

    Clients can find each other on the LAN once they exchange
    WebRTC SDP offers via the shared pnp room.

    Room ID is generated such that all clients with
    the same public IP will find each other in the same room.

    Clients that do not share the same public IP should not be unable to
    accidentally or intentionally join each other's rooms.
  */
  app.get('/id', async (req, res, next) => {
    const { id } = req.params;

    console.log('rooms: Client id %s requested room id. Request url: %s, params %s',
      id, req.originalUrl, req.params)

    if (!id) return next();

    const ip = getClientPublicIp(req)
    console.log('rooms: Calculating room name for public IP', ip)
    const roomId = crypto
      .createHmac('sha1', realm.getSecret())
      .update(ip)
      .digest('hex');
    console.log('rooms: Calculated room name %s for public IP %s', roomId, ip)
    return res.send({ roomId });
  });

  /**
    Get a list of all member peers in the same room (same room key).
    Requires room key.
  */
  app.get('/:roomId/members', (req, res, next) => {
    const { id, roomId } = req.params;
    console.log('rooms: Client id %s obtaining room id %s members.', id, roomId)
    if (!id || !roomId) return next();
    const clientsIds = realm.getRoomMembers(roomId);
    console.log('rooms: Room id %s members: %s', roomId, clientsIds)
    return res.send(clientsIds);
  });

  /**
    Join a peer room.
  */
  app.post('/:roomId/join', (req, res, next) => {
    const { id, roomId } = req.params;
    console.log('rooms: Client id %s joining room id %s.', id, roomId)
    if (!id || !roomId) return next();
    const clientsIds = realm.joinRoom(id, roomId);
    console.log('rooms: Room id %s members after client id %s joined: %s.',
      roomId, id, clientsIds)
    return res.send({ clientsIds });
  });

  /**
    Get a list of all member peers in the same room.
  */
  app.post('/:roomId/leave', (req, res, next) => {
    const { id, roomId } = req.params;
    console.log('rooms: Client id %s leaving room id %s.', id, roomId)
    if (!id || !roomId) return next();
    const wasInRoom = realm.leaveRoom(id, roomId);
    return res.send({ wasInRoom });
  });

  return app;

}
