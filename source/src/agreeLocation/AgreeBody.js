import React, { Component } from 'react';
import {
  Image,
  WebView, 
} from 'react-native';



export default class AgreeBody extends React.Component {
  render() {
    return (
        <WebView
        source={require('./AgreeBody.html')}
        />
    );
  }

}
