import React, { Component } from 'react';
import {
  View,
  Alert,
} from 'react-native';


//for example
// <CustomButton onClick={() => this._onClick()}/>


// Import native-base UI components
import {
    Button,
    Text,
} from 'native-base';

export default class CustomButton extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
  
    render() {
      return (
        <View >
            <Button info onPress={this.props.onClick} ><Text>aaaaaa</Text></Button>
        </View>
      );
    }
  
  }
  