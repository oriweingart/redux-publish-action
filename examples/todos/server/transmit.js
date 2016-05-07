'user strict';

const EVENTS = {
    'publish_state':    'publish_state',
    'new_state':        'new_state',
    'restart_client':   'restart_client',
    'connection':       'connection',
    'disconnect':       'disconnect'
}
/**
 * Start storing and publishing state with socket io
 * @param io
 */
const init = (io) => {
    var states = [];
    io.on(EVENTS.connection, (socket) => {
        /**
         * In case of receiver -> emit all stored states
         */
        if (isReceiver(socket)) {
            sendUserAllStates(socket, states);
        }
        /**
         * In case of server -> register for it's state event
         */
        if (isSender(socket)) {
            socket.on(EVENTS.publish_state, (state) => {
                var stateToStore = sendAllUsersState(io, state);
                states.push(stateToStore);
            })
            // When sender is disconnected -> emit reset to client and clear stored events
            socket.on(EVENTS.disconnect, () => {
                io.emit(EVENTS.restart_client);
                states = [];
            });
        }
    });
}
/**
 * Send the state to all the receiver users
 * @param io
 * @param state
 */
const sendAllUsersState = (io, state) => {
    state = JSON.parse(state);
    state.force = true;
    io.emit(EVENTS.new_state, state);
    return state;
}
/**
 * Send all stored states to a new receiver user
 * @param socket
 * @param states
 */
const STATE_DELAY = 200;
const sendUserAllStates = (socket, states) => {
    states.map((state, index) => {
        setTimeout(() => {
            socket.emit(EVENTS.new_state, state);
        } , STATE_DELAY * index)
    })
}
/**
 * Is this a sender user
 * @param socket
 * @returns {*}
 */
const isSender = socket => socket.handshake.query.sender;
/**
 * Is this a receiver user
 * @param socket
 * @returns {*}
 */
const isReceiver = socket => socket.handshake.query.receiver;

module.exports = init;
