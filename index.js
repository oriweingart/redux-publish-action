'use strict';

import PUBNUB from 'pubnub';

const channel = 'PUBLISH_ACTIONS';
/**
 * Wrapper to store actions and send them
 */
class PubActions {
    constructor(pubnub) {
        this.actions = [];
        this.pubnub = pubnub;
    }
    add(action) {
        this.actions.push({id: this.actions.length+1, action});
        return this;
    }
    send() {
        let message = JSON.stringify([this.actions[this.actions.length-1]]);
        this.pubnub.publish({channel, message});
        return this;
    }
    sendAll() {
        let message = JSON.stringify(this.actions);
        this.pubnub.publish({channel, message});
        return this;
    }
}
/**
 * Middleware that publish it's new action to the receivers
 * @returns {Function}
 */
const sendActionMiddleware = (pubnub) => {
    const pubActions = new PubActions(pubnub);
    // When a new member joined the channel -> publish all actions
    pubnub.subscribe({ channel,
        presence: (m)=>{
            if (m.action === 'join') {
                pubActions.sendAll();
            }
        },
        message: ()=> {/* Do nothing*/ }
    });
    return store => {
        return next => action => {
            let result = next(action);
            pubActions.add(action).sendAll();
            return result;
        };
    };
};
/**
 * Middleware that:
 *      1. Block action from current user
 *      2. Continue to next action only when it was recived from sender
 * @returns {Function}
 */
const receiveActionMiddleware = (pubnub) => {
    let mainStore,
        curActionId = 0;
    pubnub.subscribe({
        channel,
        message : message  => {
            message = JSON.parse(message);
            if (Array.isArray(message)) {
                message.map(actionObj => {
                    if (shouldAddAction(actionObj)) {
                        addAction(actionObj);
                    }
                });
            }
        }
    });
    const shouldAddAction = message => message && message.id > curActionId;
    const addAction       = message => {
        message.action.force = true;
        mainStore.dispatch(message.action);
        curActionId = message.id;
    };
    return store => {
        mainStore = mainStore || store; // init main store
        return next => action => {
            if (!action.force) {
                return action; // Block action change
            } else {
                return next(action);
            }
        };
    };
};
/**
 * Middleware that doesnt do anything (in case of regular user)
 * @returns {Function}
 */
const farwardNextAction = () => {
    return store => {
        return next => action => {
            let result = next(action);
            return result;
        };
    };
};
/**
 * Helper to extract query param from url
 * @param field
 * @param url
 * @returns {null}
 */
const getQueryString = function (field) {
    let href        = window ? window.location.href : '',
        reg         = new RegExp('[?&]' + field + '=([^&#]*)', 'i'),
        string      = reg.exec(href);
    return string ? string[1] : null;
};
/**
 * Is this a sender user
 * @returns {null}
 */
const isSender = (userType) => userType ? userType == 'sender' : getQueryString('sender');
/**
 * Is this a receiver user
 * @returns {null}
 */
const isReceiver = (userType) => userType ? userType == 'receiver' : getQueryString('receiver');
/**
 * Return the middleware based on the url query param or userType:
 *  url?sender=true || userType='sender' -> will send actions to others
 *  url?receiver=true  || userType='receiver'-> will block interaction and get actions from sender
 *  otherwise -> won't do anything
 * @returns {Function}
 */
export default (publish_key, subscribe_key, userType) => {
    let uuid = new Date().getTime();
    const pubnub = PUBNUB.init({publish_key, subscribe_key, uuid});
    if (isSender(userType)) {
        return sendActionMiddleware(pubnub);
    }
    if (isReceiver(userType)) {
        return receiveActionMiddleware(pubnub);
    }
    return farwardNextAction();
}
