
import React, { Component } from 'react';
import {  
  AsyncStorage,
  View,
  StyleSheet,
  Platform,
  ScrollView
} from 'react-native';

import { 
  Container,
  Button, Icon,
  Text,
  Header, Title,
  Content, 
  Left, Body, Right,
  Form, Label, Input, Picker, Switch,
  Item as FormItem,
  Spinner
} from 'native-base';
import DeviceInfo from 'react-native-device-info';


const Item = Picker.Item;


import BackgroundGeolocation from "../react-native-background-geolocation";

import SettingsService from '../lib/SettingsService';
import {SOUNDS, STORAGE_KEY, COLORS} from '../lib/config';


const TRACKER_SERVER_HOST = 'https://sugasaki.github.io/wan-navi2/wan-navi2/';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: '設定',
  };


  constructor(props) {
    super(props);
    let navigation = props.navigation;
    this.settingsService = SettingsService.getInstance();

    // Default state
    this.state = {
      isDestroyingLog: false,
      isLoadingGeofences: false,
      username: navigation.state.params.username,
      params: navigation.state.params,


      geofence: {
        radius: '200',
        notifyOnEntry: true,
        notifyOnExit: false,
        notifyOnDwell: false,
        loiteringDelay: '0'
      }
    };

  }

  componentDidMount() {
    this.settingsService.getPluginState((state) => {
      this.setState({
        ...state,
        logLevel: this.decodeLogLevel(state.logLevel),
        trackingMode: this.decodeTrackingMode(state.trackingMode),
        notificationPriority: this.decodeNotificationPriority(state.notificationPriority)
      });
    });

    // Load app settings
    this.settingsService.getApplicationState((state) => {
      this.setState(state);
    });


    this.setState({
      public_url: TRACKER_SERVER_HOST + '#' + DeviceInfo.getUniqueID(), 
    });


  }  

  /**
  * Navigate back to home-screen app-switcher
  */
  onClickClose() {
    this.props.navigation.goBack();
    this.settingsService.playSound('CLOSE');
  }

  /**
  * Navigate to About screen
  */
  onClickAbout() {
    this.props.navigation.navigate('About');
  }

  onChangeTrackingMode(value) {    
    if (this.state.trackingMode === value) { return; }
    this.setState({trackingMode: value});
    if (value === 'location') {
      BackgroundGeolocation.start((state) => {
        console.log('- Start location tracking mode');
      });
    } else {
      BackgroundGeolocation.startGeofences((state) => {
        console.log('- Start geofence tracking mode');
      });
    }
  }

  onChangeNickname(value) {
    if (!value) return;
    this.setState({username: value});
    AsyncStorage.setItem(STORAGE_KEY.UserName, value);

    //ユーザー名をサーバーに送信
    this.settingsService.fetchAsync(value);
    
  }


  onClickDestroyLog() {
    this.settingsService.confirm('Confirm Destroy', 'Destroy Logs?', () => {
      this.setState({isDestroyingLog: true});
      BackgroundGeolocation.destroyLog(() => {
        this.setState({isDestroyingLog: false});
        this.settingsService.toast('Destroyed logs');
      });
    });
  }

  onClickLoadGeofences() {
    if (this.state.isLoadingGeofences) { return false; }
    this.setState({isLoadingGeofences: true});

    this.settingsService.getApplicationState((state) => {
      let geofences = this.settingsService.getTestGeofences('city_drive', state);

      BackgroundGeolocation.addGeofences(geofences, () => {
        this.settingsService.playSound('ADD_GEOFENCE');
        this.settingsService.toast('Loaded City Drive geofences');
        this.setState({isLoadingGeofences: false});
      }, () => {
        this.settingsService.toast('Loaded City Drive geofences');
        this.setState({isLoadingGeofences: false});
      });
    });
  }

  onClickClearGeofences() {
    this.settingsService.playSound('MESSAGE_SENT');
    BackgroundGeolocation.removeGeofences();
  }

  onFieldChange(setting, value) {
    let currentValue = this.state[setting.name];

    switch (setting.dataType) {
      case 'integer':
        value = parseInt(value, 10);
        break;
    }

    if (this.state[setting.name] === value) {
      return;
    }

    let state = {};
    state[setting.name] = value;
    this.setState(state);

    // Buffer field-changes by 500ms
    function doChange() {
      // Encode applicable settings for consumption by plugin.
      switch(setting.name) {
        case 'logLevel':
          value = this.encodeLogLevel(value);
          break;
        case 'notificationPriority':
          value = this.encodeNotficationPriority(value);
          break;
      }
      let config = {};
      config[setting.name] = value;

      BackgroundGeolocation.setConfig(config, (state) => {
        console.log('- setConfig success', state);
      });
    }

    if (this.changeBuffer) {
      this.changeBuffer = clearTimeout(this.changeBuffer);
    }
    this.changeBuffer = setTimeout(doChange.bind(this), 500);
  }

  onChangeGeofence(setting, value) {
    this.settingsService.onChange(setting, value);
    let state = {};
    state[setting.name] = value;
    this.setState(state);
  }





  render() {
    return (
      <ScrollView style={styles.container}>

        <Content style={styles.content}>
          <Form>
            <FormItem style={styles.headerItem}>
              <Text>省電力</Text>
            </FormItem>

            {this.renderPluginSettings('geolocation')}

            <Text style={styles.textinfo}>GPS精度: -1: GPS + Wifi + Cellular、0: Wifi + Cellular</Text>
            <Text style={styles.textinfo}>※ GPS取得間隔は速度が上がると自動で微調整されます。（値が上下します。）</Text>
            <Text style={styles.textinfo}>※ まとめて送信はGPS取得数が設定値以上に溜まったら送信します。</Text>


            <FormItem style={styles.headerItem}>
              <Text>アクティビティ</Text>
            </FormItem>

            {this.renderPluginSettings('activity recognition')}

            <Text style={styles.textinfo}>
            ※ 検出レート：値を大きくすると、GPS検出が少なくなり、バッテリ寿命が向上します。 値が0の場合、可能な限り速い速度でアクティビティが検出されます。
            </Text>

            <Text style={styles.textinfo}>
            ※ うまく記録されない場合、携帯停止時GPS自動OFFはON/OFF調整してみてください。
            </Text>

            <FormItem style={styles.headerItem}>
              <Text>アプリケーション</Text>
            </FormItem>
            {this.renderPluginSettings('application')}
            {this.renderPluginSettings('debug')}

            <Text style={styles.textinfo}>
            アプリ終了時に位置取得を停止するは通常OFFにしておいてください
            </Text>


            <FormItem style={styles.headerItem}>
              <Text>あなたの情報</Text>
            </FormItem>

              <Input placeholder="ニックネーム" value={this.state.username} onChangeText={this.onChangeNickname.bind(this)} />



            <FormItem style={styles.headerItem}>
              <Text>公開用アドレス</Text>
            </FormItem>
            <Input placeholder="" value={this.state.public_url}  />


          </Form>
        </Content>
                  
      </ScrollView>
    );
  }


/*

            {this.renderPluginSettings('http')}
{this.renderTrackingModeField()}

    <FormItem inlineLabel key="email" style={styles.formItem}>
    <Input placeholder="your@email.com" value={this.state.email} onChangeText={this.onChangeEmail.bind(this)} />
  </FormItem>
*/

/*
  <FormItem style={styles.headerItem}>
    <Text>DEBUG</Text>
  </FormItem>
  {this.getGeofenceTestSettings()}
  */



  renderPluginSettings(section) {
    return this.settingsService.getPluginSettings(section).map((setting) => {
      return this.buildField(setting, this.onFieldChange.bind(this));
    });
  }

  getGeofenceTestSettings() {
    return this.settingsService.getApplicationSettings('geofence').map((setting) => {
      console.log('- setting: ', setting);

      return this.buildField(setting, this.onChangeGeofence.bind(this));
    });
  }


  //フィールド自動作成
  buildField(setting, onValueChange) {
    let field = null;
    switch(setting.inputType) {
      case 'text':
        field = (
          <FormItem inlineLabel key={setting.name} style={styles.formItem}>
            <Input placeholder={setting.defaultValue} value={this.state[setting.name]} onChangeText={value => {onValueChange(setting, value)}}/>
          </FormItem>
        );
        break;
      case 'select':
        let items = [];
        setting.values.forEach((value) => {
          items.push((<Item label={value.toString()} value={value} key={setting.name + ":" + value} />));
        });
        field = (
          <FormItem inlineLabel key={setting.name} style={styles.formItem}>
            <Label style={styles.formLabel}>{setting.field ? setting.field : setting.name}</Label>
            <Right>
              <Picker
                mode="dropdown"
                style={{width:(Platform.OS === 'ios') ? undefined : 150}}
                selectedValue={this.state[setting.name]}
                onValueChange={value => {onValueChange(setting, value)}}
              >{items}</Picker>
            </Right>
          </FormItem>
        );
        break;
      case 'toggle':
        field = (
          <FormItem inlineLabel key={setting.name} style={styles.formItem}>
            <Label style={styles.formLabel}>{setting.field ? setting.field : setting.name}</Label>
            <Right style={{paddingRight:10}}>
              <Switch value={this.state[setting.name]} onValueChange={value => {onValueChange(setting, value)}} />
            </Right>
          </FormItem>
        );
        break;
      default:
        field = (
          <FormItem key={setting.name}>
            <Text>Unknown field-type for {setting.name} {setting.inputType}</Text>
          </FormItem>
        );
        break;
    }
    return field;
  }

  renderTrackingModeField() {
    return (
      <FormItem inlineLabel key="trackingMode" style={styles.formItem}>
        <Label style={styles.formLabel}>trackingMode</Label>
        <Right>
          <Picker
            mode="dropdown"
            selectedValue={this.state.trackingMode}
            onValueChange={this.onChangeTrackingMode.bind(this)}
            style={{width:(Platform.OS === 'ios') ? undefined : 150}}>
            <Item label="Location" value="location" />
            <Item label="Geofence" value="geofence" />
          </Picker>
        </Right>
      </FormItem>
    );
  }

  decodeTrackingMode(trackingMode) {
    return (trackingMode === 1 || trackingMode === 'location') ? 'location' : 'geofence';
  }

  decodeLogLevel(logLevel) {
    let value = 'VERBOSE';
    switch(logLevel) {
      case BackgroundGeolocation.LOG_LEVEL_OFF:
        value = 'OFF';
        break;
      case BackgroundGeolocation.LOG_LEVEL_ERROR:
        value = 'ERROR';
        break;
      case BackgroundGeolocation.LOG_LEVEL_WARNING:
        value = 'WARN';
        break;
      case BackgroundGeolocation.LOG_LEVEL_INFO:
        value = 'INFO';
        break;
      case BackgroundGeolocation.LOG_LEVEL_DEBUG:
        value = 'DEBUG';
        break;
      case BackgroundGeolocation.LOG_LEVEL_VERBOSE:
        value = 'VERBOSE';
        break;
    }
    return value;
  }

  encodeLogLevel(logLevel) {
    let value = 0;
    switch(logLevel) {
      case 'OFF':
        value = BackgroundGeolocation.LOG_LEVEL_OFF;
        break;
      case 'ERROR':
        value = BackgroundGeolocation.LOG_LEVEL_ERROR;
        break;
      case 'WARN':
        value = BackgroundGeolocation.LOG_LEVEL_WARNING;
        break;
      case 'INFO':
        value = BackgroundGeolocation.LOG_LEVEL_INFO;
        break;
      case 'DEBUG':
        value = BackgroundGeolocation.LOG_LEVEL_DEBUG;
        break;
      case 'VERBOSE':
        value = BackgroundGeolocation.LOG_LEVEL_VERBOSE;
        break;
    }
    return value;
  }

  decodeNotificationPriority(value) {
    switch(value) {
      case BackgroundGeolocation.NOTIFICATION_PRIORITY_DEFAULT:
        value = 'DEFAULT';
        break;
      case BackgroundGeolocation.NOTIFICATION_PRIORITY_HIGH:
        value = 'HIGH';
        break;
      case BackgroundGeolocation.NOTIFICATION_PRIORITY_LOW:
        value = 'LOW';
        break;
      case BackgroundGeolocation.NOTIFICATION_PRIORITY_MAX:
        value = 'MAX';
        break;
      case BackgroundGeolocation.NOTIFICATION_PRIORITY_MIN:
        value = 'MIN';
        break;
      default:
        value = BackgroundGeolocation.NOTIFICATION_PRIORITY_DEFAULT;
    }
    return value;
  }

  encodeNotficationPriority(value) {
    switch(value) {
      case 'DEFAULT':
        value = BackgroundGeolocation.NOTIFICATION_PRIORITY_DEFAULT;
        break;
      case 'HIGH':
        value = BackgroundGeolocation.NOTIFICATION_PRIORITY_HIGH;
        break;
      case 'LOW':
        value = BackgroundGeolocation.NOTIFICATION_PRIORITY_LOW;
        break;
      case 'MAX':
        value = BackgroundGeolocation.NOTIFICATION_PRIORITY_MAX;
        break;
      case 'MIN':
        value = BackgroundGeolocation.NOTIFICATION_PRIORITY_MIN;
        break;
    }
    return value;
  }


}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#fefefe'
  }, 
  header: {
    backgroundColor: '#fedd1e'
  },
  title: {
    color: '#000'
  },
  headerItem: {
    marginTop: 20,
    marginLeft: 0,
    paddingLeft: 10,
    paddingBottom: 5,
    backgroundColor: "transparent"
  },
  formItem: {
    backgroundColor: "#fff",
    minHeight: 50,
    marginLeft: 0
  },
  formLabel: {
    color: COLORS.light_blue,
    paddingLeft: 10
  },
  textinfo: {
    color: '#660000'
  },
});
