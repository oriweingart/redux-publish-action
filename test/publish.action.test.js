import chai from 'chai';
import configureStore from 'redux-mock-store';
import publishActionsMiddleware from '../index';


describe('publishActionsMiddleware middleware', () => {

    /**
     *
     * @type {string[]}
     */
    const testKeys = ['pub-c-6892057c-e765-4d44-b5f9-26220865480d', 'sub-c-6c1c3c02-fa52-11e5-9086-02ee2ddab7fe'];
    const createMockStore = (userType) => {
        const middlewares = [publishActionsMiddleware(...testKeys, userType)];
        return configureStore(middlewares);
    }
    const mockSenderAction = {
        type: 'SENDER_ADD_ITEM',
        payload: {
            text: "Color TV"
        }
    };
    const mockReceiverAction = {
        type: 'SENDER_ADD_ITEM',
        payload: {
            text: "Color TV"
        }
    };
    const mockRegularAction = {
        type: 'REGULAR_ADD_ITEM',
        payload: {
            text: "Color TV"
        }
    };

    describe('test publish store with one sender, one receiver and one regular user', () => {
        const senderStore = createMockStore('sender')({});
        const receiverStore = createMockStore('receiver')({});
        const regulatStore = createMockStore('none')({});


        it('should block receiver from dispatching actions', () => {
            receiverStore.dispatch(mockReceiverAction);
            const actions = receiverStore.getActions();
            chai.assert.strictEqual(actions.length, 0);
        });

        it('should send senders action to receiver ', (done) => {
            senderStore.dispatch(mockSenderAction);
            let actions = receiverStore.getActions();
            chai.assert.strictEqual(actions.length, 0);
            setTimeout(() => {
                actions = receiverStore.getActions();
                chai.assert.strictEqual(actions.length, 1);
                chai.assert.strictEqual(actions[0].type, mockSenderAction.type);
                done();
            }, 2000)
        });

        it('should send all senders actions when a new receiver join', (done) => {
            senderStore.dispatch(mockSenderAction);
            senderStore.dispatch(mockSenderAction);
            let sendersActions = senderStore.getActions();
            const newReceiverStore = createMockStore('receiver')({});
            newReceiverStore.dispatch(mockReceiverAction);
            setTimeout(() => {
                let newReceiverActions = newReceiverStore.getActions();
                chai.assert.strictEqual(newReceiverActions.length, sendersActions.length);
                chai.assert.strictEqual(newReceiverActions[0].force, true);
                done();
            }, 4000)
        });

        it('should make sure regular user wont receive senders actions', (done) => {
            senderStore.dispatch(mockSenderAction);
            regulatStore.dispatch(mockRegularAction);
            setTimeout(() => {
                let regularActions = regulatStore.getActions();
                chai.assert.strictEqual(regularActions.length, 1);
                chai.assert.strictEqual(JSON.stringify(regularActions[0]), JSON.stringify(mockRegularAction));
                done();
            }, 4000)
        });
    });
});