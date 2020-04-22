const uuidv4 = require('uuidv4');
const Realm = require('./realm');

class PnpRealm extends Realm {
  constructor () {
    super();
    this._secret;
    this._rooms = new Map();
  }

  getSecret () {
    if (!this._secret) {
      this._secret = uuidv4.uuid();
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
    let room
    if (roomId) {
      room =  this._rooms.get(roomId);
    }
    if (room) {
      const roomMembers = [...room]
      console.log('room id: %s, members: %s', roomId, roomMembers)
      return roomMembers
    } else {
      console.log('room id: %s does not exist in realm.', roomId)
      return []
    }
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
    const roomMembers = [...room]
    // console.debug('Client id %s joined room %s with members %s',
    //  clientId, roomId, roomMembers)
    return roomMembers
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
