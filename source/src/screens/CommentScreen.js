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
    Title,Text
  } from 'native-base';

import AgreeBody from '../agreeLocation/AgreeBody';


export default class CommentScreen extends Component<{}> {
    static navigationOptions = {
        title: 'コメント',
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
    
            <Text > Comming Soon 2018.5.4</Text>
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
