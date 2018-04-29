import React, { Component } from 'react';
import {
  Image,
  WebView, 
  Platform,
  StyleSheet,
  ScrollView,
  View
} from 'react-native';
import {
    Container, Header,
    Left, Body, Right,
    Title,
  } from 'native-base';

import AgreeBody from '../agreeLocation/AgreeBody';


export default class AgreeScreen extends Component<{}> {
    static navigationOptions = {
        title: '利用規約',
    };

    componentDidMount() {
    }

    render() {
        return (
            <Container>
            <Header style={styles.header}>
              <Body>
                <Title style={styles.title}>橘湾岸273 湾なび</Title>
              </Body>
            </Header>
    
            <AgreeBody />

          </Container>
        );
    }
}




const styles = StyleSheet.create({

  WebViewStyle:
  {
     justifyContent: 'center',
     alignItems: 'center',
     flex:1,
  },


  header: {
    backgroundColor: '#fff'
  },
});
