import React from 'react';
import { Platform } from 'react-native';
import { TabNavigator, TabBarBottom } from 'react-navigation';
//import { Icon } from 'native-base';
import Icon from 'react-native-ionicons'

import Colors from '../constants/Colors';

//import Main from '../home/Home';

import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import ManualScreen from '../screens/ManualScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CommentScreen from '../screens/CommentScreen';
import AgreeScreen from '../screens/AgreeScreen';


export default TabNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Comment: {
      screen: CommentScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
    Manual: {
      screen: ManualScreen,
    },
    Agree: {
      screen: AgreeScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        switch (routeName) {
          case 'Home':
            iconName = Platform.OS === 'ios' ? `ios-map${focused ? '' : '-outline'}` : 'md-map';
            break;
          case 'Comment':
            iconName = Platform.OS === 'ios' ? `ios-people${focused ? '' : '-outline'}` : 'md-people';
            break;
          case 'Manual':
            iconName = Platform.OS === 'ios' ? `ios-help${focused ? '' : '-outline'}` : 'md-help';
            break;            
          case 'Settings':
            iconName = Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options';
            break;   
          case 'Agree':
            iconName = Platform.OS === 'ios' ? `ios-alert${focused ? '' : '-outline'}` : 'md-options';
            break;   

        }
        return (
          <Icon
            name={iconName}
            size={28}
            style={{ marginBottom: -3, width: 25 }}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
          />
        );
      },
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
