# redux-publish-action [![Circle CI](https://circleci.com/gh/oriweingart/redux-publish-action/tree/master.svg?style=shield)](https://circleci.com/gh/oriweingart/redux-publish-action/tree/master)

Redux [middleware](http://redux.js.org/docs/advanced/Middleware.html) for simulating user's interaction in other user's browser using [PbNub] (https://www.pubnub.com).

## Usage

```js
import { createStore, applyMiddleware } from 'redux';
import publishActions from 'redux-publish-action';

// Add PubNub publish and subscribe keys
let publishActionMiddleware = publishAction('pub-key-123', 'sub-key-123', 'sender');
const store = createStore(
  appReducer,
  applyMiddleware(publishActionMiddleware)
);
```
For user that sends it's intercations to other users ('sender')
```js
let publishActionMiddleware = publishAction('pub-key-123', 'sub-key-123', 'sender');
```
For users that receive the intercations from the sender ('receiver')
```js
let publishActionMiddleware = publishAction('pub-key-123', 'sub-key-123', 'receiver');
```


under development
