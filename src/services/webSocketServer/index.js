const WSS = require('ws').Server;
const url = require('url');
const EventEmitter = require('events');
const { MessageType, Errors } = require('../../enums');
const Client = require('../../models/client');

class WebSocketServer extends EventEmitter {
  constructor({ server, realm, config }) {
    super();
    this.setMaxListeners(0);
    this.realm = realm;
    this.config = config;

    let path = this.config.path;
    path = path + (path[path.length - 1] !== '/' ? '/' : '') + 'peerjs';

    this._wss = new WSS({ path, server });

    this._wss.on('connection', (socket, req) => this._onSocketConnection(socket, req));
    this._wss.on('error', (error) => this._onSocketError(error));
  }

  _onSocketConnection(socket, req) {
    const { query = {} } = url.parse(req.url, true);

    const { id, token, key } = query;

    if (!id || !token || !key) {
      console.warning('websockets: Invalid websocket parameters, id %s, token %s, key %s',
        id, token, key)
      return this._sendErrorAndClose(socket, Errors.INVALID_WS_PARAMETERS);
    }

    if (key !== this.config.key) {
      console.warning('websockets: Invalid key: %s')
      return this._sendErrorAndClose(socket, Errors.INVALID_KEY);
    }

    const client = this.realm.getClientById(id);

    if (client) {
      if (token !== client.getToken()) {
        console.info('websockets: ID %s is taken. Invalid token: %s', id, token)
        // ID-taken, invalid token
        socket.send(JSON.stringify({
          type: MessageType.ID_TAKEN,
          payload: { msg: 'ID is taken' }
        }));

        return socket.close();
      }

      return this._configureWS(socket, client);
    }

    this._registerClient({ socket, id, token });
  }

  _onSocketError(error) {
    // handle error
    this.emit('error', error);
  }

  _registerClient({ socket, id, token }) {
    // Check concurrent limit
    const clientsCount = this.realm.getClientsIds().length;

    if (clientsCount >= this.config.concurrent_limit) {
      return this._sendErrorAndClose(socket, Errors.CONNECTION_LIMIT_EXCEED);
    }

    const newClient = new Client({ id, token });
    this.realm.setClient(newClient, id);
    socket.send(JSON.stringify({ type: MessageType.OPEN }));

    console.log('websockets: Client id %s registered.', id)

    this._configureWS(socket, newClient);
  }

  _configureWS(socket, client) {
    client.setSocket(socket);

    // Cleanup after a socket closes.
    socket.on('close', () => {
      if (client.socket === socket) {
        this.realm.removeClientById(client.getId());

        console.log('websockets: Client id %s disconected.',
          client.getId());

        this.emit('close', client);
      }
    });

    // Handle messages from peers.
    socket.on('message', (data) => {
      try {
        const message = JSON.parse(data);

        message.src = client.getId();

        console.log('websockets: Client id %s sent a message %s',
          client.getId(), message);

        this.emit('message', client, message);
      } catch (e) {
        this.emit('error', e);
      }
    });

    // Handle RFC standard pings from peers.
    // https://tools.ietf.org/html/rfc6455#section-5.5.2
    socket.on('ping', () => {
      try {
        const type = MessageType.HEARTBEAT;
        const src = client.getId();
        const message = { type, src }
        console.log('websockets: Client id %s sent an RFC6455 ping message',
          client.getId());
        this.emit('message', client, message);
      } catch (e) {
        this.emit('error', e);
      }
    });

    console.log('websockets: Client id %s connected to signaling server.',
      client.getId());
    this.emit('connection', client);
  }

  _sendErrorAndClose(socket, msg) {
    socket.send(
      JSON.stringify({
        type: MessageType.ERROR,
        payload: { msg }
      })
    );

    socket.close();
  }
}

module.exports = WebSocketServer;
