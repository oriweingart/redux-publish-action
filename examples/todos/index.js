import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import todoApp from './reducers'
import App from './components/App'
import publishActions from 'redux-publish-action'

const exampleKeys = ['pub-c-aed23e3f-4684-4e63-bb13-a1923126f1a4', 'sub-c-374ea80c-1433-11e6-b7c5-02ee2ddab7fe'];
let publishActionMiddleware = publishActions(...exampleKeys);

let store = createStore(todoApp,
    applyMiddleware(publishActionMiddleware)
    )

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
