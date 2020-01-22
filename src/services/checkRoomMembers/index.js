/**
  Periodically clean up room membership.
*/
const DEFAULT_CHECK_INTERVAL = 3000;

module.exports = ({ realm, checkInterval = DEFAULT_CHECK_INTERVAL }) => {
  /**
    Go through room members and remove
    the ones that are not connected to the server.
  */
  const checkRoomMembers = () => {
    const roomIds = realm.getRoomIds();

    for (const roomId of roomIds) {

      const clientsIds = realm.getRoomMembers(roomId);

      for (const clientId of clientsIds) {
        const client = realm.getClientById(clientId);
        if (!client) {
          realm.leaveRoom(clientId, roomId)
        }
      }
    }
  };

  let timeoutId;

  const start = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      checkRoomMembers();

      timeoutId = null;

      start();
    }, checkInterval);
  };

  const stop = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return {
    start,
    stop,
    CHECK_INTERVAL: checkInterval
  };
};
