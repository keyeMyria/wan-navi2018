import React, { Component } from 'react';
import {
  AsyncStorage,
  View,
  Text,
  StyleSheet
} from 'react-native';
import { Platform } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import HomeScreen from '../screens/HomeScreen';
import Home from '../home/Home';

class Root extends Component<{}> {
  componentDidMount() {
    let navigation = this.props.navigation;
    let params = {username: undefined};
    let page = "";

    //AsyncStorage.setItem("@tachibanawanganWannavi:username", '');

    // Append username to route params.
    AsyncStorage.getItem("@tachibanawanganWannavi:username", (err, username) => {
      // Append username to route-params
      if (username) { 
        params.username = username; 
        page = "Main";
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
