import React, { Component } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  AsyncStorage,
  Alert,
  Linking,
  View
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
  Container, Header, Content, Footer,
  Left, Body, Right,
  Card, CardItem,
  Text, H1,
  Button, Icon,
  Title,
  Form, Item, Input, Label
} from 'native-base';

import BackgroundGeolocation from "../react-native-background-geolocation";
import DeviceInfo from 'react-native-device-info';

import prompt from 'react-native-prompt-android';
import SettingsService from '../lib/SettingsService';
//Config
import {COLORS, STORAGE_KEY, SOUNDS} from '../lib/config';

const DEFAULT_USERNAME = "react-native-anonymous";


export default class Home extends Component<{}> {
  constructor(props) {
    super(props);

    let navigation = props.navigation;
    this.state = {
      username: navigation.state.params.username,
    }
  }

  componentDidMount() {
    // #stop BackroundGeolocation and remove-listeners when Home Screen is rendered.
    BackgroundGeolocation.stop();
    BackgroundGeolocation.removeListeners();

    if (!this.state.username) {
      this.getUsername().then(this.doGetUsername.bind(this)).catch(() => {
        this.onClickEditUsername();
      });
    }

    this.settingsService = SettingsService.getInstance();
  }


  onClickEditUsername() {
      this.getUsername(username).then(this.doGetUsername.bind(this)).catch(() => {
        // Revert to current username on [Cancel]
        AsyncStorage.setItem(STORAGE_KEY.UserName, username);
        this.onClickEditUsername();
      });
  }


  getUsername(defaultValue) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(STORAGE_KEY.UserName, (err, username) => {
        if (username) {
          resolve(username);
        } else {
          prompt('ニックネーム', 'ニックネームを入力してください。この名前は後からいつでも変更できます。', [{
            text: 'OK',
            onPress: (username) => {
              //console.log('OK Pressed, username: ', username, username.length);
              if (!username.length) {
                Alert.alert('','ニックネームは必ず必要です.', [{
                  text: 'OK', onPress: () => {
                    reject();
                  }
                }],{
                  cancelable: false
                });
              } else {
                resolve(username);
              }
            }
          }],{
            type: 'plain-text',
            defaultValue: defaultValue || ''
          });
        }
      });
    });
  }  

  doGetUsername(username) {
    AsyncStorage.setItem(STORAGE_KEY.UserName, username , (err, store) => {
      //ユーザー名をサーバーに送信
      this.settingsService.fetchAsync(username);

      //画面遷移する
      this._navigat(username);
    });
  }

  _navigat(username) {
    let navigation = this.props.navigation;
    let page = "Main";
    let params = {username: username};
    navigation.dispatch(NavigationActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({ routeName: page, params: params})
      ]
    }));
  }

  render() {
    return (
      <Container>
        <View style={styles.container}>
          <View style={styles.startedContainer}>
            <Text style={styles.startedText}>湾なび</Text>
          </View>

          <View style={styles.welcomeContainer}>
             <Image
              source={ require('../assets/images/opening.jpg')}
              style={styles.openingImage}
            />
          </View>
        
        </View>
      </Container>
    );
  }
}




const styles = StyleSheet.create({
  startedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  startedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  welcomeContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
  },

  openingImage: {
    width: 300,
    height: 500,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },

  userInfo: {
    padding: 10
  }
});
