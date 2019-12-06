const { expect } = require('chai');
const PnpRealm = require('../../src/models/pnpRealm');

describe('PnpRealm', () => {
  describe('#getSecret', () => {
    it('should generate a 36-character UUID', () => {
      const realm = new PnpRealm();
      expect(realm.getSecret().length).to.eq(36);
    });
  });

  describe('#getRoom', () => {
    it('should return undefined for a non-existent room', () => {
      const realm = new PnpRealm();
      const roomName = 'room-name';
      realm.getRoom(roomName);
      expect(realm.getRoom(roomName)).to.be.undefined;
    });

    it('should return Set with clientIds added to the room', () => {
      const realm = new PnpRealm();
      const roomName = 'room-name';
      const clientId = 'clientId';
      const members1 = realm.joinRoom(clientId, roomName);
      const members2 = realm.getRoom(roomName)
      expect(members1).to.deep.eq(members2)
      expect(members2.size).to.eq(1)
      expect(members2.has(clientId)).to.eq(true)
    });
  });

  describe('#joinRoom', () => {
    it('should add a clientId to a room', () => {
      const realm = new PnpRealm();
      const roomName = 'room-name';
      const clientId = 'clientId';
      const members = realm.joinRoom(clientId, roomName);
      expect(members.size).to.eq(1)
      expect(members.has(clientId)).to.be.true;
    });
  });

  describe('#leaveRoom', () => {
    it('should remove a clientId from a room', () => {
      const realm = new PnpRealm();
      const roomName = 'room-name';
      const clientId = 'clientId';
      const members = realm.joinRoom(clientId, roomName);
      const wasInRoom = realm.leaveRoom(clientId, roomName);
      expect(wasInRoom).to.be.true;
      expect(members.has(clientId)).to.be.false;
      expect(members.size).to.eq(0);
    });
  });
});
