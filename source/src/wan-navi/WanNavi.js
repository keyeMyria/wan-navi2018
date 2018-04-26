/**
* The AdvancedApp contains its own child-router for routing to:
* - SettingsView
* - GeofenceView
* - AboutView
*/
import React, { Component } from 'react';

import { StackNavigator, NavigationActions } from 'react-navigation';

import HomeView from './HomeView';
import SettingsView from './SettingsView';


export default WanNavi = StackNavigator({
  Home: {
    screen: HomeView
  },
  Settings: {
    screen: SettingsView
  },
}, {
  initialRouteName: 'Home',
  headerMode: 'none',
  mode: 'modal'  
});