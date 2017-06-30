/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  Text,
  But
} from 'react-native';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { appReducer } from './app/redux/abcRedux'
import App from './app/containers/App'

const store = createStore(appReducer)
const Assignment2 = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

AppRegistry.registerComponent('Assignment2', () => Assignment2);
