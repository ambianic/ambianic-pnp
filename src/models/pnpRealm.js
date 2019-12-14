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
    Return set with all room Ids
  */
  getRoomIds () {
    return this._rooms.keys()
  }


  /**
    Return room set with all present member clientIds.
  */
  getRoomMembers (roomId) {
    let room =  this._rooms.get(roomId);
    return room
  }

  /**
   *  Add member with clientId to room named roomName.
   *  Return room set with all present member clientIds.
   */
  joinRoom (clientId, roomId) {
    let room =  this._rooms.get(roomId);
    if (!room) {
      // first member joining this room
      room = new Set()
      this._rooms.set(roomId, room)
    }
    room.add(clientId)
    return room
  }

  /**
    Remove member with clientId from room.
    Returns true if clientId was found in the room
    false otherwise.
  */
  leaveRoom (clientId, roomId) {
    let room =  this._rooms.get(roomId);
    if (!room) {
      // all members already left this room
      return false
    } else {
      let wasInRoom = room.delete(clientId)
      // if the room is empty, remove it from the room map
      // to avoid lingering stale data
      if (room.size == 0) {
        this._rooms.delete(roomId)
      }
      // true if the clientId member was in the room
      // false otherwise
      return wasInRoom
    }
  }

}

module.exports = PnpRealm;
