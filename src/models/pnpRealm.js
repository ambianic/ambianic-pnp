const uuidv4 = require('uuid/v4');
const Realm = require('./realm');

class PnpRealm extends Realm {
  constructor () {
    super();
    this._secret;
    this._rooms = new Map();
  }

  getSecret () {
    if (!this._secret) {
      this._secret = uuidv4();
    }
    return this._secret;
  }

  /**
    Return room set with all present member clientIds.
  */
  getRoom (roomName) {
    let room =  this._rooms.get(roomName);
    return room
  }

  /**
   *  Add member with clientId to room named roomName.
   *  Return room set with all present member clientIds.
   */
  joinRoom (clientId, roomName) {
    let room =  this._rooms.get(roomName);
    if (!room) {
      // first member joining this room
      room = new Set()
      this._rooms.set(roomName, room)
    }
    room.add(clientId)
    return room
  }

  /**
    Remove member with clientId from room.
    Returns true if clientId was found in the room
    false otherwise.
  */
  leaveRoom (clientId, roomName) {
    let room =  this._rooms.get(roomName);
    if (!room) {
      // all members already left this room
      return false
    } else {
      let wasInRoom = room.delete(clientId)
      // true if the clientId member was in the room
      // false otherwise
      return wasInRoom
    }
  }

}

module.exports = PnpRealm;
