# redux-publish-action [![Circle CI](https://circleci.com/gh/oriweingart/redux-publish-action/tree/master.svg?style=shield)](https://circleci.com/gh/oriweingart/redux-publish-action/tree/master)

Redux [middleware](http://redux.js.org/docs/advanced/Middleware.html) for simulating user's interaction in other user's browser using [PbNub] (https://www.pubnub.com).

Using this [middleware](http://redux.js.org/docs/advanced/Middleware.html) you can see what your users see in their application or you can show them what you see on your end.
Useful for demos and debug sessions.


## Usage

```js
import { createStore, applyMiddleware } from 'redux';
import publishAction from 'redux-publish-action';

// Add PubNub publish and subscribe keys
let publishActionMiddleware = publishAction('pub-key-123', 'sub-key-123');
const store = createStore(
  yourApp,
  applyMiddleware(publishActionMiddleware)
);
```
For user that present his interaction - add ?sender=true to the application url
```bash
http://your.app.com?sender=true
```
For users that receive the intercations from the sender - add ?receiver=true to the application url
```bash
http://your.app.com?receiver=true
```

## Installation

```bash
$ npm install redux-publish-action
```

## Requirements

[PbNub] (https://www.pubnub.com) account with publish and subscribe keys. 

## License

Apache.

