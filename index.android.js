/*
*   Author: Mihir Karandikar
*   Started on: Tue Mar 22 2016
*/

'use strict';

var React = require('react-native');
var AppRegistry = React.AppRegistry;
var IOTAPP = require('./src/main');

//suppress issues that are not fixed in react-native library
console.ignoredYellowBox = [
      'Warning: Failed propType',
      // Other warnings you don't want like 'jsSchedulingOverhead',
    ];

AppRegistry.registerComponent('IOT', () => IOTAPP);