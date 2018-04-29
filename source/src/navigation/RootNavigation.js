import React, { Component } from 'react';
import {
  AsyncStorage,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { Platform } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';

//Config
import {COLORS, STORAGE_KEY, SOUNDS} from '../lib/config';
import MainTabNavigator from './MainTabNavigator';
import HomeScreen from '../screens/HomeScreen';
import Home from '../home/Home';

import AgreeLocation from '../agreeLocation/AgreeLocation';




class Root extends Component<{}> {
  componentDidMount() {
    let navigation = this.props.navigation;
    let params = {username: undefined};
    let page = "";

    //AsyncStorage.setItem(STORAGE_KEY.AgreeLocation, '');
    //AsyncStorage.setItem(STORAGE_KEY.UserName, '');

    AsyncStorage.multiGet([STORAGE_KEY.AgreeLocation, STORAGE_KEY.UserName], (err, store) => {
      let isAreeLocation = store[0][1];
      let userName = store[1][1];
      if (userName) params.username = userName;

      //Alert.alert('isAreeLocation', isAreeLocation,[{text: 'OK', onPress: () => {}},],{ cancelable: false });
      //Alert.alert('userName', userName,[{text: 'OK', onPress: () => {}},],{ cancelable: false });

      if (isAreeLocation == 'agree' && userName != '') { 
        page = "Main";
      }else if (isAreeLocation != 'agree' ) {
        page = "AgreeLocation";
      }else{
        page = "Home";
      }

      navigation.dispatch(NavigationActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({ routeName: page, params: params})
        ]
      }));
    });

  }

  componentWillUnmount() {
  }

  render() {
    return (<View></View>);
  }

}



export default class RootNavigator extends React.Component {
  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return <RootStackNavigator />;
  }

}


const RootStackNavigator = StackNavigator(
  {
    Root: {
      screen: Root,
    },
    Main: {
      screen: MainTabNavigator,
    },
    Home: {
      screen: Home,
    },
    AgreeLocation: {
      screen: AgreeLocation,
    }
  },
  {
    initialRouteName: 'Root',
    headerMode: 'none',
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'normal',
      },
    }),
    onTransitionStart: (transition) => {

    }
    
  }
);
