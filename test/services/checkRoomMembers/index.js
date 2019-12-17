const { expect } = require('chai');
const Client = require('../../../src/models/client');
const Realm = require('../../../src/models/pnpRealm');
const checkRoomMembersBuilder = require('../../../src/services/checkRoomMembers');

describe('checkRoomMembers service', () => {
    it('should remove room member after 2 checks', (done) => {
        const realm = new Realm();
        const checkRoomMembers = checkRoomMembersBuilder(
          { realm,
            checkInterval: 30
          });
        const client = new Client({ id: 'id', token: '' });
        realm.setClient(client, 'id');
        realm.joinRoom(client.id, 'roomId')

        checkRoomMembers.start();

        setTimeout(() => {
            expect(realm.getRoomMembers('roomId').length).to.eq(1);
        }, checkRoomMembers.CHECK_INTERVAL * 1);

        setTimeout(() => {
            realm.removeClientById(client.id);
        }, checkRoomMembers.CHECK_INTERVAL * 2);

        setTimeout(() => {
            expect(realm.getRoomMembers('roomId').length).to.eq(0);
            checkRoomMembers.stop();
            done();
        }, checkRoomMembers.CHECK_INTERVAL * 3);

    });

});
