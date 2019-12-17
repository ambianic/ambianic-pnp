const { expect } = require('chai');
const PnpRealm = require('../../src/models/pnpRealm');

describe('PnpRealm', () => {
  describe('#getSecret', () => {
    it('should generate a 36-character UUID', () => {
      const realm = new PnpRealm();
      expect(realm.getSecret().length).to.eq(36);
    });
  });

  describe('#getRoomMembers', () => {
    it('should return [] for a non-existent room', () => {
      const realm = new PnpRealm();
      const roomName = 'room-name';
      const members = realm.getRoomMembers(roomName)
      console.log('room members: %s', members)
      expect(members.length).to.eq(0);
    });

    it('should return array with clientIds added to the room', () => {
      const realm = new PnpRealm();
      const roomName = 'room-name';
      const clientId = 'clientId';
      const members1 = realm.joinRoom(clientId, roomName);
      console.log('members1', members1)
      expect(members1.length).to.eq(1)
      const members2 = realm.getRoomMembers(roomName)
      console.log('members2', members2)
      expect(members2.length).to.eq(1)
      expect(members1).to.deep.eq(members2)
      expect(members2.includes(clientId)).to.eq(true)
    });
  });

  describe('#joinRoom', () => {
    it('should add a clientId to a room', () => {
      const realm = new PnpRealm();
      const roomName = 'room-name';
      const clientId = 'clientId';
      const members = realm.joinRoom(clientId, roomName);
      expect(members.length).to.eq(1)
      expect(members.includes(clientId)).to.be.true;
    });
  });

  describe('#leaveRoom', () => {
    it('should remove a clientId from a room', () => {
      const realm = new PnpRealm();
      const roomName = 'room-name';
      const clientId = 'clientId';
      const members = realm.joinRoom(clientId, roomName);
      expect(members.includes(clientId)).to.be.true;
      const wasInRoom = realm.leaveRoom(clientId, roomName);
      expect(wasInRoom).to.be.true;
      const membersAfter = realm.getRoomMembers(roomName);
      expect(membersAfter.includes(clientId)).to.be.false;
      expect(membersAfter.length).to.eq(0);
    });
  });
});
