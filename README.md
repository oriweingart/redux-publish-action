# redux-publish-action [![Circle CI](https://circleci.com/gh/oriweingart/redux-publish-action/tree/master.svg?style=shield)](https://circleci.com/gh/oriweingart/redux-publish-action/tree/master)

Redux [middleware](http://redux.js.org/docs/advanced/Middleware.html) 
for showing another user's interaction with your application in your browser using [PubNub] (https://www.pubnub.com).

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
Users wishing to show their interactions with the application should add ?sender=true to the application url
```bash
http://your.app.com?sender=true
```
Users wishing to see another user's interactions with the application should add add ?receiver=true to the application url
```bash
http://your.app.com?receiver=true
```

## Installation

```bash
$ npm install redux-publish-action
```

## Requirements

[PbNub] (https://www.pubnub.com) account with publish and subscribe keys.


## Examples

todos app from [Redux examples page](https://github.com/reactjs/redux/tree/master/examples) with ```redux-publish-action```.

```bash
$ git clone git@github.com:oriweingart/redux-publish-action.git
$ cd redux-publish-action
$ npm install
$ cd examples/todos
$ npm install
$ npm start
```
Open the sender browser on
```bash
http://localhost:3000?sender=true
```
Open the receiver browser on
```bash
http://localhost:3000?receiver=true
```
All UI interactions performed by the sender will be displayed in the receiver's browser.


## License

Apache.
