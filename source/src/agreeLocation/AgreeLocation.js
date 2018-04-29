import React, { Component } from 'react';
import {
  Image,
  WebView, 
  Platform,
  StyleSheet,
  AsyncStorage,
  Alert,
  Linking,
  ScrollView,
  View
} from 'react-native';
import {
  Container, Header, Content, Footer,
  Left, Body, Right,
  Card, CardItem,
  Text, H1,
  Button, Icon,
  Title,
  Form, Item, Input, Label
} from 'native-base';

import { NavigationActions } from 'react-navigation';

import AgreeBody from './AgreeBody';
import {COLORS, STORAGE_KEY, SOUNDS} from '../lib/config';



export default class AgreeLocation extends Component<{}> {
  constructor(props) {
    super(props);

    let navigation = props.navigation;
    this.state = {
      username: navigation.state.params.username,
      url: navigation.state.params.username
    }
  }

  componentDidMount() {
  }

  onClickNavigate() {

    Alert.alert(
      '再確認',
      '本当に利用規約に合意しますか？',
      [
        {text: 'No', onPress: () => {
          Alert.alert('', '利用規約に同意しないと本アプリを使用できません',[{text: 'OK', onPress: () => {}},],{ cancelable: false });
        }, style: 'cancel'},
        {text: 'Yes', onPress: () => {
          this.setAgreeLocationWithNavigate();
        }
      },
      ],
      { cancelable: false }
    )

  }


  setAgreeLocationWithNavigate() {
    AsyncStorage.removeItem(STORAGE_KEY.AgreeLocation);
    AsyncStorage.setItem(STORAGE_KEY.AgreeLocation, "agree" , (err, store) => {
      let page = "Home";
      //画面遷移する
      this._navigat(page);
    });
  }


  _navigat(page) {
    let navigation = this.props.navigation;
    navigation.dispatch(NavigationActions.reset({
      index: 0, key: null,
      actions: [
        NavigationActions.navigate({ routeName: page, params: {}  })
      ]
    }));
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

        <Footer style={styles.footer}>
            <Card style={styles.userInfo}>
              <Text style={styles.p}>湾岸ナビゲーションを利用するには利用規約への合意が必要です。</Text>

              <View style={{margin: 0}}>
                <Right>
                  <Button full style={styles.button} onPress={() => this.onClickNavigate()}><Text>利用規約に同意して進む</Text></Button>
                </Right>
              </View>
            </Card>
        </Footer>
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
  title: {
    color: '#000'
  },
  body: {
    width: '100%',
    justifyContent: 'center',
    backgroundColor:'#fff'
  },
  h1: {
    color: '#fff',
    marginBottom: 20
  },
  p: {
    fontSize: 12,
    marginBottom: 5
  },
  url: {
    fontSize: 12,
    textAlign: 'center'
  },
  button: {
    marginBottom: 10
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  contentContainer: {
    paddingTop: 0,
  },

  footer: {
    backgroundColor:"transparent",
    height: 100
  },
  userInfo: {
    padding: 10
  }
});
