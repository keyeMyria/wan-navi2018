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
  Item as FormItem,
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
    this.settingsService = SettingsService.getInstance();
  }


  onChangeNickname(value) {
    if (!value) return;
    this.setState({username: value});
  }


  onClickNavigate() {
    if (! this.state.username || this.state.username == ''){
      Alert.alert('', 'ニックネームを入力してください',[{text: 'OK', onPress: () => {}},],{ cancelable: false });
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY.UserName, this.state.username , (err, store) => {
      let page = "Main";
      
      //ユーザー名をサーバーに送信
      this.settingsService.fetchAsync(this.state.username);

      //画面遷移する
      this._navigat();
    });
  }


  _navigat() {
    let navigation = this.props.navigation;
    let page = "Main";
    let params = {username: this.state.username};
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
            <Text style={styles.startedText}>橘湾岸273 スーパーマラニック</Text>
          </View>

          <View style={styles.welcomeContainer}>
             <Image
              source={ require('../assets/images/opening.jpg')}
              style={styles.openingImage}
            />
          </View>
        
          <Text style={styles.startedText}></Text>
          <View style={styles.welcomeContainer}>
            <Text style={styles.alert}>ニックネームを入力してください</Text>
          <FormItem inlineLabel key="username" style={styles.formItem}>
              <Input placeholder="ニックネーム" value={this.state.username} onChangeText={this.onChangeNickname.bind(this)} />
          </FormItem>

          </View>

        </View>


        <Footer style={styles.footer}>
            <Card style={styles.userInfo}>
              <View style={{margin: 0}}>
                <Right>
                  <Button full style={styles.button} onPress={() => this.onClickNavigate()}><Text>はじめる</Text></Button>
                </Right>
              </View>
            </Card>
        </Footer>


      </Container>
    );
  }
  
}




const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 0,
  },

  formItem: {
    backgroundColor: "#fff",
    minHeight: 50,
    marginLeft: 10,
    marginRight: 10,
  },


  footer: {
    backgroundColor:"transparent",
    height: 80
  },

  alert: {
    color: '#ff3333',
  },

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
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
  },

  openingImage: {
    width: 150,
    height: 200,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },

  userInfo: {
    padding: 10
  }
});
