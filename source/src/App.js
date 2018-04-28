/**
 * Background Geolocation  App.
 */

import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import {StyleProvider} from "native-base";
import RootNavigation from './navigation/RootNavigation';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  
  render() {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <RootNavigation />
        </View>
      );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
