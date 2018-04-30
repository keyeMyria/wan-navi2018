import React from 'react';
import {
  Image,
  AsyncStorage,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  View,
  TextInput,
  Button,
  TouchableHighlight, TouchableOpacity, TouchableNativeFeedback, TouchableWithoutFeedback,
} from 'react-native';

import {
  Container, Header, Body,Title,
} from 'native-base';

import { NavigationActions } from 'react-navigation';

import DeviceInfo from 'react-native-device-info';
//Config
import {COLORS, STORAGE_KEY, SOUNDS} from '../lib/config';
import SettingsService from '../lib/SettingsService';



export default class ExpoScreen extends React.Component {
  constructor(props) {
    super(props);

    let navigation = props.navigation;

    if (!navigation.state.params.username) navigation.state.params.username = "";

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




  onClickNavigate() {

    if (this.state.username === ''){
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

  _onPressButton() {
    Alert.alert('You tapped the button!')
  }

  _onLongPressButton() {
    Alert.alert('You long-pressed the button!')
  }


  render() {
    return (

      <Container style={styles.container}>

        <Header style={styles.header}>
          <Body>
            <Title style={styles.title}>橘湾岸273 湾なび</Title>
          </Body>
        </Header>

        <View style = {styles.bodyContainer}>

          <Text style={styles.getStartedText}>湾なびには名前が必要です</Text>

          <View>
            <TextInput
              placeholder="名前を入力してください" 
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => this.setState({username: text})}
            />
            <Text style={styles.tabBarInfoText}>{'your name: ' + this.state.username}</Text>
          </View>


          <View style={styles.welcomeContainer}>
             <Image
              source={ require('../assets/images/opening.jpg')}
              style={styles.openingImage}
            />
          </View>

          <View style={styles.marginBottom}></View>

          <TouchableOpacity onPress={() => this.onClickNavigate()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>はじめる</Text>
            </View>
          </TouchableOpacity>


        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },

  header: {
    backgroundColor: '#fff'
  },
  title: {
    color: '#000'
  },
  body: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor:'#fff'
  },


    
  bodyContainer: {
    paddingTop: 23,
    backgroundColor: '#fff',
    marginLeft: 30,
    marginRight: 30,
  },


  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3'
  },
  buttonText: {
    padding: 20,
    color: 'white'
  },


  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },

  tabBarInfoText: {
    fontSize: 14,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },

  marginBottom: {
    marginBottom: 20,
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

})
