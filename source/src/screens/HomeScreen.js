
import React, { Component } from 'react';
import {
  Platform,
  Image,
  StyleSheet,
  AsyncStorage,
  View,
  AppState,
  Alert,
  Linking, 
  KeyboardAvoidingView,
  TextInput
} from 'react-native';
import { NavigationActions } from 'react-navigation';

// For posting to tracker.transistorsoft.com
import DeviceInfo from 'react-native-device-info';
import ActionButton from 'react-native-action-button';

// Import native-base UI components
import {
  Container,
  Button, 
  Icon,
  Text,
  Header, Footer, Title,
  Content,
  Left, Body, Right,
  Switch,
  Spinner
} from 'native-base';

////
// Import BackgroundGeolocation plugin
// Note: normally you will not specify a relative url ../ here.  I do this in the sample app
// because the plugin can be installed from 2 sources:
//
// 1.  npm:  react-native-background-geolocation
// 2.  private github repo (customers only):  react-native-background-geolocation-android
//
// This simply allows one to change the import in a single file.
import BackgroundGeolocation from '../react-native-background-geolocation';

// react-native-maps
import MapView from 'react-native-maps';
const LATITUDE_DELTA = 0.00922;
const LONGITUDE_DELTA = 0.00421;

import App from '../App';

import {COLORS, STORAGE_KEY, SOUNDS} from '../lib/config';
import SettingsView from './SettingsView';
import SettingsService from '../lib/SettingsService';


//components
import SlideSwich from '../components/SlideSwich';
import CustomButton from '../components/CustomButton';

//const
//const TRACKER_HOST = 'http://tracker.transistorsoft.com/locations/';
//cconst TRACKER_HOST = 'http://localhost:5000/api/RunnerSave/';
const TRACKER_HOST = 'https://wan-navi.azurewebsites.net/api/RunnerSave/';

const TRACKER_SERVER_HOST = 'https://sugasaki.github.io/wan-navi2/wan-navi2/';

const RUNNER_TRACKER_HOST = 'https://wan-navi.azurewebsites.net/api/RunnerLog/';

const PASSOWRD_HOST = 'https://tachibanawangan.com/map/geojson/password.json';


const STATIONARY_REGION_FILL_COLOR = "rgba(200,0,0,0.2)"
const STATIONARY_REGION_STROKE_COLOR = "rgba(200,0,0,0.2)"
const GEOFENCE_STROKE_COLOR = "rgba(17,183,0,0.5)"
const GEOFENCE_FILL_COLOR   ="rgba(17,183,0,0.2)"
const GEOFENCE_STROKE_COLOR_ACTIVATED = "rgba(127,127,127,0.5)";
const GEOFENCE_FILL_COLOR_ACTIVATED = "rgba(127,127,127, 0.2)";
const POLYLINE_STROKE_COLOR = "rgba(32,64,255,0.6)";

// FAB button / map-menu position is tricky per platform / device.
let ACTION_BUTTON_OFFSET_Y  = 25;
if (Platform.OS == 'android') {
  ACTION_BUTTON_OFFSET_Y = 25;
} else if (DeviceInfo.getModel() === 'iPhone X') {
  ACTION_BUTTON_OFFSET_Y = 35;
}

/*
import Road55 from '../assets/geojson/55.json';
import Road80 from '../assets/geojson/80.json';
import Road173 from '../assets/geojson/173.json';
import Road217 from '../assets/geojson/217.json';
*/


//map data
import E217 from '../assets/geojson/E前半 EL合流まで.json';
import L173 from '../assets/geojson/L前半 EL合流まで.json';
import M80 from '../assets/geojson/M80～茂木.json';
import S55 from '../assets/geojson/S55～日見.json';

import ELMogi from '../assets/geojson/EL合流～茂木.json';
import MogiHimi from '../assets/geojson/茂木～日見.json';
import Himi from '../assets/geojson/日見以降.json';


import iconAid from '../assets/images/icon_aid.png';
import wangan from '../assets/images/wangan.png';

import runner from '../assets/images/runner.png';
import runner2 from '../assets/images/runner2.png';




//import aid173 from '../assets/aid/aid173.json';
//import cp173 from '../assets/aid/cp173.json';


let Road217 ;

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
    title: 'MAP',
  };

  constructor(props) {
    super(props);

    AsyncStorage.setItem("@tachibanawanganWannavi:url", TRACKER_HOST);


    let navigation = props.navigation;
    this.lastMotionChangeLocation = undefined;

    this.state = {
      username: navigation.state.params.username,
      params: navigation.state.params,
      enabled: false,
      isMoving: false,
      motionActivity: {activity: 'unknown', confidence: 100},
      odometer: 0,
      // ActionButton state
      isMainMenuOpen: true,
      isSyncing: false,
      isEmailingLog: false,
      isDestroyingLocations: false,
      // Map state
      centerCoordinate: {
        latitude: 0,
        longitude: 0
      },
      isPressingOnMap: false,
      mapScrollEnabled: false,
      showsUserLocation: false,
      followsUserLocation: false,
      stationaryLocation: {timestamp: '',latitude:0,longitude:0},
      stationaryRadius: 0,
      markers: [],
      stopZones: [],
      geofences: [],
      geofencesHit: [],
      geofencesHitEvents: [],
      coordinates: [],
      // Application settings
      settings: {},
      // BackgroundGeolocation state
      bgGeo: {},


      initialRegion: {
        latitude: 32.74230,
        longitude: 129.869925,
        latitudeDelta: 0.8,
        longitudeDelta: 0.8,
      },

      navigateRoad: {},
      
      hideAidMarkers: false,
      hideCPMarkers: false,
      hideRunnerAllMarkers: true,

      
      runnerAll: null,
    };

    this.settingsService = SettingsService.getInstance();
    this.settingsService.setUsername(this.state.username);
  }


  //
  loadGPX(){

    let E217_Coordinates =  E217.features[0].geometry.coordinates.map((point, index) => {return  {latitude : point[1],longitude : point[0]}})
    let L173_Coordinates =  L173.features[0].geometry.coordinates.map((point, index) => {return  {latitude : point[1],longitude : point[0]}})
    let M80_Coordinates =  M80.features[0].geometry.coordinates.map((point, index) => {return  {latitude : point[1],longitude : point[0]}})
    let S55_Coordinates =  S55.features[0].geometry.coordinates.map((point, index) => {return  {latitude : point[1],longitude : point[0]}})

    let ELMogi_Coordinates =  ELMogi.features[0].geometry.coordinates.map((point, index) => {return  {latitude : point[1],longitude : point[0]}})
    let MogiHimi_Coordinates =  MogiHimi.features[0].geometry.coordinates.map((point, index) => {return  {latitude : point[1],longitude : point[0]}})
    let Himi_Coordinates =  Himi.features[0].geometry.coordinates.map((point, index) => {return  {latitude : point[1],longitude : point[0]}})


    //let AidFeatures =  AidMap[0].title;
    //alert(AidFeatures);


    Road217 = E217_Coordinates.concat(ELMogi_Coordinates);
    Road217 = Road217.concat(MogiHimi_Coordinates);
    Road217 = Road217.concat(Himi_Coordinates);


    var Road173 = L173_Coordinates.concat(ELMogi_Coordinates);
    Road173 = Road173.concat(MogiHimi_Coordinates);
    Road173 = Road173.concat(Himi_Coordinates);


    var Road80 = M80_Coordinates.concat(MogiHimi_Coordinates);
    Road80 = Road80.concat(Himi_Coordinates);

    var Road55 = S55_Coordinates.concat(Himi_Coordinates);


    this.setState({
      Road217: Road217,
      Road173: Road173,
      Road80: Road80,
      Road55: Road55,
    });


    this.setState({
      navigateRoad:  {
        coordinates: Road173,
      },
      aidFeatures: null, //aid173.features,
      cpFeatures: null, //cp173.features,
    });

  }


fetchAsync  = async (filename) => {

  let url = "https://tachibanawangan.com/map/geojson/" + filename + ".json";

  await fetch(url)
  .then((response) => response.json())
  .then((responseJson) => {

    switch (filename) {
    case "aid217":
      this.setState({aid217: responseJson.features});
      break;
    case "cp217":
      this.setState({cp217: responseJson.features});
      break;
    case "aid173":
      this.setState({aid173: responseJson.features});
      break;
    case "cp173":
      this.setState({cp173: responseJson.features});
      break;
    case "aid80":
      this.setState({aid80: responseJson.features});
      break;
    case "cp80":
      this.setState({cp80: responseJson.features});
      break;
    case "aid55":
      this.setState({aid55: responseJson.features});
      break;
    case "cp55":
      this.setState({cp55: responseJson.features});
      break;
    }


  });

};


fetcｈRunnerAsync  = async (filename) => {

  this.setState({ isRunnerSyncing: true  });

  await fetch(RUNNER_TRACKER_HOST)
  .then((response) => response.json())
  .then((responseJson) => {
    this.setState({runnerAll: responseJson.features});
    this.setState({ isRunnerSyncing: false  });
  });

};


fetcｈPassowordAsync  = async () => {

  await fetch(PASSOWRD_HOST)
  .then((response) => response.json())
  .then((responseJson) => {
    this.setState({ nowPassword: responseJson.password});
    //alert(responseJson.password);
  });

};

fetchAll() {

  this.setState({
    aid217: null,
    cp217: null,
    aid173: null,
    cp173: null,
    aid80: null,
    cp80: null,
    aid55: null,
    cp55: null,
  });

  this.fetchAsync("aid217");
  this.fetchAsync("cp217");
  this.fetchAsync("aid173");
  this.fetchAsync("cp173");
  this.fetchAsync("aid80");
  this.fetchAsync("cp80");
  this.fetchAsync("aid55");
  this.fetchAsync("cp55");
}


  componentDidMount() {

    this.setState({
      region: this.state.initialRegion
    });

    this.loadGPX();

    this.fetchAll();

    this.fetcｈPassowordAsync();


    /* dosn't work 2018.4.30
    AsyncStorage.getItem(STORAGE_KEY.isMainMenuOpen, (err, isMainMenuOpen) => {
      if (!isMainMenuOpen) isMainMenuOpen = true;
      //Alert.alert('isMainMenuOpen:', isMainMenuOpen,[{text: 'OK', onPress: () => {}},],{ cancelable: false });
      //JSON.parse(isMainMenuOpen)
      this.setState({
        isMainMenuOpen: false
      }); 
    });
    */

    // Fetch BackgroundGeolocation current state and use that as our config object.  we use the config as persisted by the
    // Settings screen to configure the plugin.

    this.configureBackgroundGeolocation();

    // Fetch current app settings state.
    this.settingsService.getApplicationState((state) => {

      state.hideMarkers = false;
      state.hidePolyline = false;
      state.hideGeofenceHits = false;

      this.setState({
        settings: state
      });
    });


  }

  componentWillUnmount() {
    BackgroundGeolocation.removeListeners();
  }

  configureBackgroundGeolocation() {

    // Step 1:  Listen to events:
    BackgroundGeolocation.on('location', this.onLocation.bind(this));
    BackgroundGeolocation.on('motionchange', this.onMotionChange.bind(this));
    BackgroundGeolocation.on('heartbeat', this.onHeartbeat.bind(this));
    BackgroundGeolocation.on('http', this.onHttp.bind(this));
    BackgroundGeolocation.on("geofence", this.onGeofence.bind(this));
    BackgroundGeolocation.on("schedule", this.onSchedule.bind(this));
    BackgroundGeolocation.on('activitychange', this.onActivityChange.bind(this));
    BackgroundGeolocation.on('providerchange', this.onProviderChange.bind(this));
    BackgroundGeolocation.on('geofenceschange', this.onGeofencesChange.bind(this));
    BackgroundGeolocation.on('powersavechange', this.onPowerSaveChange.bind(this));
    BackgroundGeolocation.on("connectivitychange", this.onConnectivityChange.bind(this));
    BackgroundGeolocation.on("enabledchange", this.onEnabledChange.bind(this));
    // Step 2:  #ready:
    // If you want to override any config options provided by the Settings screen, this is the place to do it, eg:
    // config.stopTimeout = 5;
    //

    BackgroundGeolocation.ready({
      debug: false,
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      foregroundService: true,
      autoSync: true,
      autoSyncThreshold: 5,
      batchSync: true,
      stopOnTerminate: false,
      url: TRACKER_HOST, 
      startOnBoot: true,
      heartbeatInterval: 60,
      enabledHeadless: true,
      params: {
        device: {
          uuid: DeviceInfo.getUniqueID(),
          model: DeviceInfo.getModel(),
          platform: DeviceInfo.getSystemName(),
          manufacturer: DeviceInfo.getManufacturer(),
          version: DeviceInfo.getSystemVersion(),
          framework: 'ReactNative'
        }
      }
    }, (state) => {
      this.setState({
        enabled: state.enabled,
        isMoving: state.isMoving,
        followsUserLocation: state.enabled,
        showsUserLocation: state.enabled,
        bgGeo: state
      });
    }, (error) => {
      console.warn('BackgroundGeolocation error: ', error)
    });


    this.setState({
      logUrl: TRACKER_SERVER_HOST + '#' + DeviceInfo.getUniqueID(), 
    });

  }
  /**
  * @event location
  */
  onLocation(location) {
    console.log('[event] - location: ', location);

    if (!location.sample) {
      this.addMarker(location);
      this.setState({
        odometer: (location.odometer/1000).toFixed(1)
      });
    }
    this.setCenter(location);
  }
  /**
  * @event motionchange
  */
  onMotionChange(event) {
    console.log('[event] - motionchange: ', event.isMoving, event.location);
    let location = event.location;

    let state = {
      isMoving: event.isMoving
    };
    if (event.isMoving) {
      if (this.lastMotionChangeLocation) {
        state.stopZones = [...this.state.stopZones, {
          coordinate: {
            latitude: this.lastMotionChangeLocation.coords.latitude,
            longitude: this.lastMotionChangeLocation.coords.longitude
          },
          key: this.lastMotionChangeLocation.timestamp
        }];
      }
      state.stationaryRadius = 0,
      state.stationaryLocation = {
        timestamp: '',
        latitude: 0,
        longitude: 0
      };
    } else {
      state.stationaryRadius = (this.state.bgGeo.trackingMode) ? 200 : (this.state.bgGeo.geofenceProximityRadius/2);
      state.stationaryLocation = {
        timestamp: location.timestamp,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    }
    this.setState(state);
    this.lastMotionChangeLocation = location;
  }
  /**
  * @event activitychange
  */
  onActivityChange(event) {
    console.log('[event] - activitychange: ', event);
    this.setState({
      motionActivity: event
    });
  }
  /**
  * @event heartbeat
  */
  onHeartbeat(params) {
    console.log("[event] - heartbeat: ", params.location);
  }

  /**
  * @event providerchange
  */
  onProviderChange(event) {
    console.log('[event] - providerchange', event);
  }
  /**
  * @event http
  */
  onHttp(response) {
    console.log('[event] - http ' + response.status);
    console.log(response.responseText);
  }
  /**
  * @event geofenceschange
  */
  onGeofencesChange(event) {
    var on  = event.on;
    var off = event.off;
    var geofences  = this.state.geofences;

    // Filter out all "off" geofences.
    geofences = geofences.filter(function(geofence) {
      return off.indexOf(geofence.identifier) < 0;
    });

    console.log('[event] - geofenceschange: ', event);
    // Add new "on" geofences.
    on.forEach(function(geofence) {
      var marker = geofences.find(function(m) { return m.identifier === geofence.identifier;});
      if (marker) { return; }
      geofences.push(this.createGeofenceMarker(geofence));
    }.bind(this));

    this.setState({
      geofences: geofences
    });
  }
  /**
  * @event geofence
  */
  onGeofence(geofence) {
    let location = geofence.location;
    var marker = this.state.geofences.find((m) => {
      return m.identifier === geofence.identifier;
    });
    if (!marker) { return; }

    marker.fillColor = GEOFENCE_STROKE_COLOR_ACTIVATED;
    marker.strokeColor = GEOFENCE_STROKE_COLOR_ACTIVATED;

    let coords = location.coords;

    let hit = this.state.geofencesHit.find((hit) => {
      return hit.identifier === geofence.identifier;
    });

    if (!hit) {
      hit = {
        identifier: geofence.identifier,
        radius: marker.radius,
        center: {
          latitude: marker.center.latitude,
          longitude: marker.center.longitude
        },
        events: []
      };
      this.setState({
        geofencesHit: [...this.state.geofencesHit, hit]
      });
    }
    // Get bearing of location relative to geofence center.
    let bearing = this.getBearing(marker.center, location.coords);
    let edgeCoordinate = this.computeOffsetCoordinate(marker.center, marker.radius, bearing);
    let event = {
      coordinates: [
        //edgeCoordinate,
        {latitude: coords.latitude, longitude: coords.longitude},
      ],
      action: geofence.action,
      key: geofence.identifier + ":" + geofence.action + ":" + location.timestamp
    };
    this.setState({
      geofencesHitEvents: [...this.state.geofencesHitEvents, event]
    });
  }
  /**
  * @event schedule
  */
  onSchedule(state) {
    console.log("[event] - schedule", state.enabled, state);
    this.setState({
      enabled: state.enabled
    });
  }
  /**
  * @event powersavechange
  */
  onPowerSaveChange(isPowerSaveMode) {
    console.log('[event] - powersavechange', isPowerSaveMode);
  }
  /**
  * @event connectivitychange
  */
  onConnectivityChange(event) {
    console.log('[event] - connectivitychange', event);
    this.settingsService.toast('[event] connectivitychange: ' + event.connected);
  }
  /**
  * @event enabledchange
  */
  onEnabledChange(event) {
    console.log('[event] - enabledchange', event);
    this.settingsService.toast('[event] enabledchange: ' + event.enabled);
  }



  /**
  * Toggle button handler to #start / #stop the plugin
  */
  onToggleEnabled(enabled) {
    //if (enabled){ alert("ON")}else{alert("OFF")}
   
    this.setState({
      enabled: enabled,
      isMoving: false,
      showsUserLocation: false,
      followsUserLocation: false
    });

    if (enabled) {
      BackgroundGeolocation.start((state) => {
        this.setState({
          showsUserLocation: enabled,
          followsUserLocation: enabled
        });
      });
    } else {
      BackgroundGeolocation.stop();
      // Clear markers, polyline, geofences, stationary-region
      // this.clearMarkers();
      this.setState({
        stationaryRadius: 0,
        stationaryLocation: {
          timestamp: '',
          latitude: 0,
          longitude: 0
        }
      });


    }
  }





  /**
  * get current position button handler
  */
  onClickGetCurrentPosition() {
    this.settingsService.playSound('BUTTON_CLICK');

    // When getCurrentPosition button is pressed, enable followsUserLocation
    // PanDrag will disable it.
    this.setState({
      followsUserLocation: true
    });

    BackgroundGeolocation.getCurrentPosition({persist: true, samples: 1}).then(location => {
      console.log('- getCurrentPosition success: ', location);
    }).catch(error => {
      console.warn('- getCurrentPosition error: ', error);
    });
  }

  /**
  * [>] / [||] button executes #changePace
  */
  onClickChangePace() {
    console.log('- onClickChangePace');
    let isMoving = !this.state.isMoving;
    this.setState({isMoving: isMoving});
    BackgroundGeolocation.changePace(isMoving);
  }


  /**
  * FAB button show/hide handler
  */
  onClickMainMenu() {

    let isMainMenuOpen = !this.state.isMainMenuOpen;
    let soundId = (isMainMenuOpen) ? 'OPEN' : 'CLOSE';
    this.settingsService.playSound(soundId);
    this.setState({
      isMainMenuOpen: isMainMenuOpen
    });

    AsyncStorage.setItem(STORAGE_KEY.isMainMenuOpen, JSON.stringify(isMainMenuOpen))
  }


  getMainMenuIcon() {
    return <Icon name="ios-add" size={20}/>
  }
  /**
  * FAB Button command handler
  */
  onSelectMainMenu(command) {
    switch(command) {
      case 'settings':
        this.settingsService.playSound('OPEN');
        this.props.navigation.navigate('Settings');
        break;
      case 'resetOdometer':
        this.settingsService.playSound('BUTTON_CLICK');
        this.resetOdometer();
        break;
      case 'emailLog':
        this.settingsService.playSound('BUTTON_CLICK');
        this.emailLog();
        break;
      case 'sync':
        this.settingsService.playSound('BUTTON_CLICK');
        this.sync();
        break;
      case 'destroyLocations':
        this.settingsService.playSound('BUTTON_CLICK');
        this.destroyLocations();
        break;
    }
  }

  resetOdometer() {
    this.clearMarkers();
    this.setState({isResettingOdometer: true, odometer: '0.0'});
    BackgroundGeolocation.setOdometer(0).then(location => {
      this.setState({isResettingOdometer: false});
      this.settingsService.toast('Reset odometer success');
    }).catch(error => {
      this.setState({isResettingOdometer: false});
      this.settingsService.toast('Reset odometer failure: ' + error);
    });
  }

  emailLog() {
    // First fetch the email from settingsService.
    this.settingsService.getEmail((email) => {
      if (!email) { return; }  // <-- [Cancel] returns null
      // Confirm email
      this.settingsService.yesNo('Email log', 'Use email address: ' + email + '?', () => {
        // Here we go...
        this.setState({isEmailingLog: true});
        BackgroundGeolocation.emailLog(email, () => {
          this.setState({isEmailingLog: false});
        }, (error) => {
          this.setState({isEmailingLog: false});
          this.settingsService.toast("Email log failure: " + error);
        });
      }, () => {
        // User said [NO]:  The want to change their email.  Clear it and recursively restart the process.
        this.settingsService.set('email', null);
        this.emailLog();
      });
    });
  }

  async sync() {
    let count = await BackgroundGeolocation.getCount();
    if (!count) {
      this.settingsService.toast('Locations database is empty');
      return;
    }
    this.settingsService.confirm('Confirm Sync', 'Sync ' + count + ' records?', () => {
      this.setState({isSyncing: true});
      BackgroundGeolocation.sync((rs) => {
        this.settingsService.toast('Sync success (' + count + ' records)');
        this.settingsService.playSound('MESSAGE_SENT');
        this.setState({isSyncing: false});
      }, (error) => {
        this.settingsService.toast('Sync error: ' + error);
        this.setState({isSyncing: false});
      });
    });
  }
  

  async destroyLocations() {
    let count = BackgroundGeolocation.getCount();
    if (!count) {
      this.settingsService.toast('Locations database is empty');
      return;
    }
    this.settingsService.confirm('Confirm Delete', 'Destroy ' + count + ' records?', () => {
      this.setState({isDestroyingLocations: true});
      BackgroundGeolocation.destroyLocations(() => {
        this.setState({isDestroyingLocations: false});
        this.settingsService.toast('Destroyed ' + count + ' records');
      }, (error) => {
        this.setState({isDestroyingLocations: false});
        this.settingsService.toast('Destroy locations error: ' + error, null, 'LONG');
      });
    });
  }

  /**
  * Top-right map menu button-handler
  * [show/hide marker] [show/hide polyline] [show/hide geofence hits]
  */
  onClickMapMenu(command) {
    this.settingsService.playSound('BUTTON_CLICK');

    let enabled = !this.state.settings[command];
    this.settingsService.set(command, enabled);

    let settings = Object.assign({}, this.state.settings);
    settings[command] = enabled;

    this.setState({
      settings: settings
    });

    let message = ((enabled) ? 'Hide' : 'Show');
    switch (command) {
      case 'hideMarkers':
        message += ' map markers';
        break;
      case 'hidePolyline':
        message += ' polyline';
        break;
      case 'hideGeofenceHits':
        message += ' geofence transitions';
        break;
    }
    this.settingsService.toast(message, 'SHORT');
  }

  _onClick() {
    alert('_onClick');
    this.setState({
      enabled: true
    });
  }


  _onClickKaisi(value) {
    this.setState({
      enabled: value
    });
  }
  

  render() {

    return (
      <Container style={styles.container}>

        <MapView
          ref="map"
          style={styles.map}
          showsUserLocation={this.state.showsUserLocation}
          followsUserLocation={false}
          onLongPress={this.onLongPress.bind(this)}
          onPanDrag={this.onMapPanDrag.bind(this)}
          scrollEnabled={this.state.mapScrollEnabled}
          showsMyLocationButton={true}
          showsPointsOfInterest={false}
          showsScale={true}
          showsTraffic={false}
          toolbarEnabled={false}
          initialRegion={this.state.region}
        >
    
          <MapView.Circle
            key={this.state.stationaryLocation.timestamp}
            radius={this.state.stationaryRadius}
            fillColor={STATIONARY_REGION_FILL_COLOR}
            strokeColor={STATIONARY_REGION_STROKE_COLOR}
            strokeWidth={1}
            center={{latitude: this.state.stationaryLocation.latitude, longitude: this.state.stationaryLocation.longitude}}
          />

          <MapView.Polyline
            key="polyline"
            coordinates={(!this.state.settings.hidePolyline) ? this.state.coordinates : []}
            geodesic={true}
            strokeColor='rgba(0,179,253, 0.6)'
            strokeWidth={6}
            zIndex={0}
          />

          <MapView.Polyline
            key="polyline2"
            coordinates={ this.state.navigateRoad.coordinates }
            geodesic={true}
            strokeColor='rgba(222,0,0, 0.6)'
            strokeWidth={3}
            zIndex={0}
          />



          {this.renderAidMarkers()}
          {this.renderCPMarkers()}
          
          {this.renderRunnerAllMarkers()}

          {this.renderMarkers()}
          {this.renderStopZoneMarkers()}
          {this.renderActiveGeofences()}
          {this.renderGeofencesHit()}
          {this.renderGeofencesHitEvents()}
        </MapView>


        <View style={styles.mapMenu}>
          <View style={styles.startBorder}>
            <Text style={styles.startBorderText}>出走開始・停止</Text>
            <SlideSwich onValueChange={(enabled) => this.onToggleEnabled(enabled)} value={this.state.enabled} password={this.state.nowPassword}/>
         </View>
        </View>



        <View style={styles.mapMenu2}>

          <Icon name="ios-refresh-circle-outline" onPress={() => this.fetchAll() } />

          <Button info light={this.state.hideAidMarkers} style={styles.mapMenuButton} onPress={() => this.onClickAidMenu() }>
            <Image source={ iconAid } style={styles.mapMenuButtonIcon} />
          </Button>

          <Button info light={this.state.hideCPMarkers} style={styles.mapMenuButton} onPress={() => this.onClickCPMenu()}>
            <Image source={ wangan } style={styles.mapMenuButtonIcon} />
          </Button>
          
          <Button light={this.state.hideRunnerAllMarkers} style={styles.mapMenuButton} onPress={() => this.onClickRunnerAllMenu()}>
            {!this.state.isRunnerSyncing ? (<Image source={ runner2 } style={styles.mapMenuButtonIcon} />) : (<Spinner color="#000" size="small" />)}
          </Button>
          

        </View>
        

        <View style={styles.mapMenuBottom}>
          <Left style={{flex:0.3}}>
            <Title style={styles.title}>湾なび</Title>
          </Left>
          <Body style={styles.footerBody}>
            <Text style={styles.status}>{this.state.motionActivity.activity}:{this.state.motionActivity.confidence}% &middot; {this.state.odometer}km</Text>
          </Body>


          <Right style={{flex: 0.3}}>
            <Button danger={this.state.isMoving}
              success={!this.state.isMoving}
              disabled={!this.state.enabled}
              onPress={this.onClickChangePace.bind(this)}>
              <Icon active name={(this.state.isMoving) ? 'pause' : 'play'} style={styles.icon}/>
            </Button>
          </Right>
        </View>


        <ActionButton
          position="left"
          hideShadow={false}
          autoInactive={false}
          active={this.state.isMainMenuOpen}
          backgroundTappable={true}
          onPress={this.onClickMainMenu.bind(this)}
          verticalOrientation="down"
          //buttonColor="rgba(254,221,30,1)"
          buttonColor="#3498db"
          buttonTextStyle={{color: "#ffffff"}}
          spacing={15}
          offsetX={10}
          offsetY={ACTION_BUTTON_OFFSET_Y}
          activeOpacity={0.85}
          >

          <ActionButton.Item size={40} buttonColor={COLORS.skyblue} onPress={() => this.onClickGetCurrentPosition()}>
            <Icon name="ios-navigate" style={styles.actionButtonIcon} />
            <Text style={styles.iconText}>現在</Text>
          </ActionButton.Item>
          

          <ActionButton.Item size={40} buttonColor={COLORS.light_gold} onPress={() => this.onNavigateRoadChange(this.state.Road55, this.state.aid55, this.state.cp55)}>
            <Title style={styles.title}>55</Title>
          </ActionButton.Item>


          <ActionButton.Item size={40} buttonColor={COLORS.light_gold} onPress={() => this.onNavigateRoadChange(this.state.Road80, this.state.aid80, this.state.cp80)}>
            <Title style={styles.title}>80</Title>
          </ActionButton.Item>


          <ActionButton.Item size={40} buttonColor={COLORS.light_gold} onPress={() => this.onNavigateRoadChange(this.state.Road173, this.state.aid173, this.state.cp173)}>
            <Title style={styles.title}>173</Title>
          </ActionButton.Item>

          <ActionButton.Item size={40} buttonColor={COLORS.light_gold} onPress={() => this.onNavigateRoadChange(this.state.Road217, this.state.aid217, this.state.cp217)}>
            <Title style={styles.title}>217</Title>
          </ActionButton.Item>


          <ActionButton.Item size={40} buttonColor={COLORS.green} onPress={() => this.onClickViewServer(this)}>
            <Icon name="ios-contacts" style={styles.actionButtonIcon} />
          </ActionButton.Item>


        </ActionButton>

        <View style={styles.mapMenuBottom}>
        <Button
          onPress={this.onPressLearnMore}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        </View>

      </Container>
    );
  }

  

  onClickViewServer() {
    Alert.alert(
      '位置確認',
      'Webで移動の軌跡を表示しますか',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {
          Linking.openURL(this.state.logUrl);
        }
      },
      ],
      { cancelable: false }
    )

 }



  onNavigateRoadChange(value, aid, cp) {
    this.settingsService.playSound('ADD_GEOFENCE');
    this.setState({
      navigateRoad: {
        coordinates: value
      },
    });


    this.setState({
      aidFeatures: aid, 
      cpFeatures: cp, 
    });

  }


  onClickAidMenu() {
    this.settingsService.playSound('BUTTON_CLICK');
    this.setState({
      hideAidMarkers: !this.state.hideAidMarkers
    });
  }
  onClickCPMenu() {
    this.settingsService.playSound('BUTTON_CLICK');
    this.setState({
      hideCPMarkers: !this.state.hideCPMarkers
    });
  }


  onClickRunnerAllMenu() {
    this.settingsService.playSound('BUTTON_CLICK');

    this.setState({
      hideRunnerAllMarkers: !this.state.hideRunnerAllMarkers,
    });

    //
    if (this.state.hideRunnerAllMarkers) {
      this.fetcｈRunnerAsync();
    }

  }
  

  renderAidMarkers() {
    if (this.state.hideAidMarkers) { return; }
    if (!this.state.aidFeatures) { return; }
    let id = 0;
    let rs = [];

    this.state.aidFeatures.map((marker) => {
      rs.push((
        <MapView.Marker
          key={id++}
          coordinate={{
            latitude: marker.geometry.coordinates[1],
            longitude: marker.geometry.coordinates[0],
          } }
          anchor={{x:0, y:0.1}}
          title={marker.properties.place }
          description={marker.properties.comment + ", " + marker.properties.note + ", " + marker.properties.gatetime}
          image={iconAid}
          >
        </MapView.Marker>
      ));
    });

    return rs;
  }


  renderCPMarkers() {
    if (this.state.hideCPMarkers) { return; }
    if (!this.state.cpFeatures) { return; }
    let id = 0;
    let rs = [];

    this.state.cpFeatures.map((marker) => {
      rs.push((
        <MapView.Marker
          key={"cp"+id++}
          coordinate={{
            latitude: marker.geometry.coordinates[1],
            longitude: marker.geometry.coordinates[0],
          } }
          anchor={{x:0, y:0.1}}
          title={marker.properties.place }
          description={marker.properties.comment + ", " + marker.properties.note}
          image={wangan}
          opacity={1.0}
          >
        </MapView.Marker>
      ));
    });

    return rs;
  }


  renderRunnerAllMarkers() {
    if (this.state.hideRunnerAllMarkers) { return; }
    if (!this.state.runnerAll) { return; }
    let id = 0;
    let rs = [];

    this.state.runnerAll.map((marker) => {
      rs.push((
        <MapView.Marker
          key={id++}
          coordinate={{
            latitude: marker.geometry.coordinates[1],
            longitude: marker.geometry.coordinates[0],
          } }
          anchor={{x:0, y:0.1}}
          title={marker.properties.name }
          description={marker.properties.comment + ", " + marker.properties.note}
          image={runner}
          >
        </MapView.Marker>
      ));
    });

    return rs;
  }

  


  getMotionActivityIcon() {
    this.state.motionActivity.activity
    switch (this.state.motionActivity.activity) {
      case 'unknown':
        return 'ios-help-circle';
      case 'still':
        return 'ios-body';
      case 'on_foot':
        return 'ios-walk';
      case 'walking':
        return 'ios-walk';
      case 'running':
        return 'ios-walk';
      case 'in_vehicle':
        return 'ios-car';
      case 'on_bicycle':
        return 'ios-bicycle';
      default:
        return 'ios-help-cirlce';
    }
  }

  renderMarkers() {
    if (this.state.settings.hideMarkers) { return; }
    let rs = [];
    this.state.markers.map((marker) => {
      rs.push((
        <MapView.Marker
          key={marker.key}
          coordinate={marker.coordinate}
          anchor={{x:0, y:0.1}}
          title={marker.title}>
          <View style={[styles.markerIcon]}></View>
        </MapView.Marker>
      ));
    });
    return rs;
  }

  renderStopZoneMarkers() {
    return this.state.stopZones.map((stopZone) => (
      <MapView.Marker
        key={stopZone.key}
        coordinate={stopZone.coordinate}
        anchor={{x:0, y:0}}>
        <View style={[styles.stopZoneMarker]}></View>
      </MapView.Marker>
    ));
  }

  renderActiveGeofences() {
    return this.state.geofences.map((geofence) => (
      <MapView.Circle
        key={geofence.identifier}
        radius={geofence.radius}
        center={geofence.center}
        strokeWidth={1}
        strokeColor={geofence.strokeColor}
        fillColor={geofence.fillColor}
        onPress={this.onPressGeofence}
      />
    ));
  }

  renderGeofencesHit() {
    if (this.state.settings.hideGeofenceHits) { return; }
    let rs = [];
    return this.state.geofencesHit.map((hit) => {
      return (
        <MapView.Circle
          key={"hit:" + hit.identifier}
          radius={hit.radius+1}
          center={hit.center}
          strokeWidth={1}
          strokeColor={COLORS.black}>
        </MapView.Circle>
      );
    });
  }

  renderGeofencesHitEvents() {
    if (this.state.settings.hideGeofenceHits) { return; }
    return this.state.geofencesHitEvents.map((event) => {
      let isEnter = (event.action === 'ENTER');
      let color = undefined;
      switch(event.action) {
        case 'ENTER':
          color = COLORS.green;
          break;
        case 'EXIT':
          color = COLORS.red;
          break;
        case 'DWELL':
          color = COLORS.gold;
          break;
      }
      let markerStyle = {
        backgroundColor: color
      };
      return (
        <View key={event.key}>
          <MapView.Polyline
            key="polyline"
            coordinates={event.coordinates}
            geodesic={true}
            strokeColor={COLORS.black}
            strokeWidth={1}
            style={styles.geofenceHitPolyline}
            zIndex={1}
            lineCap="square" />
          <MapView.Marker
            key="edge_marker"
            coordinate={event.coordinates[0]}
            anchor={{x:0, y:0.1}}>
            <View style={[styles.geofenceHitMarker, markerStyle]}></View>
          </MapView.Marker>
          <MapView.Marker
            key="location_marker"
            coordinate={event.coordinates[1]}
            anchor={{x:0, y:0.1}}>
            <View style={styles.markerIcon}></View>
          </MapView.Marker>
        </View>
      );
    });
  }

  /**
  * Map methods
  */
  setCenter(location) {
    if (!this.refs.map) { return; }
    if (!this.state.followsUserLocation) { return; }

    this.refs.map.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    });
  }

  addMarker(location) {
    let marker = {
      key: location.uuid,
      title: location.timestamp,
      heading: location.coords.heading,
      coordinate: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
    };

    this.setState({
      markers: [...this.state.markers, marker],
      coordinates: [...this.state.coordinates, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }]
    });
  }

  createGeofenceMarker(geofence) {
    return {
      radius: geofence.radius,
      center: {
        latitude: geofence.latitude,
        longitude: geofence.longitude
      },
      identifier: geofence.identifier,
      strokeColor:GEOFENCE_STROKE_COLOR,
      fillColor: GEOFENCE_FILL_COLOR
    }
  }

  onMapPanDrag() {
    this.setState({
      followsUserLocation: false,
      mapScrollEnabled: true
    });
  }

  onLongPress(params) {
    var coordinate = params.nativeEvent.coordinate;
    this.settingsService.playSound('LONG_PRESS_ACTIVATE');
    this.props.navigation.navigate('Geofence', {
      coordinate: coordinate
    });
  }

  clearMarkers() {
    this.setState({
      coordinates: [],
      markers: [],
      stopZones: [],
      geofencesHit: [],
      geofencesHitEvents: []
    });
  }

  /**
  * Map geometry methods for calculating Geofence hit-markers
  * TODO move to Utility class
  */
  toRad(n) {
    return n * (Math.PI / 180);
  }
  toDeg(n) {
    return n * (180 / Math.PI);
  }

  getBearing(start, end){
    let startLat = this.toRad(start.latitude);
    let startLong = this.toRad(start.longitude);
    let endLat = this.toRad(end.latitude);
    let endLong = this.toRad(end.longitude);

    let dLong = endLong - startLong;

    let dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
    if (Math.abs(dLong) > Math.PI){
      if (dLong > 0.0)
         dLong = -(2.0 * Math.PI - dLong);
      else
         dLong = (2.0 * Math.PI + dLong);
    }
    return (this.toDeg(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
  }

  computeOffsetCoordinate(coordinate, distance, heading) {
    distance = distance / (6371*1000);
    heading = this.toRad(heading);

    var lat1 = this.toRad(coordinate.latitude), lon1 = this.toRad(coordinate.longitude);
    var lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance) +
                        Math.cos(lat1) * Math.sin(distance) * Math.cos(heading));

    var lon2 = lon1 + Math.atan2(Math.sin(heading) * Math.sin(distance) *
                                Math.cos(lat1),
                                Math.cos(distance) - Math.sin(lat1) *
                                Math.sin(lat2));

    if (isNaN(lat2) || isNaN(lon2)) return null;

    return {
      latitude: this.toDeg(lat2),
      longitude: this.toDeg(lon2)
    };
  }
}

var styles = StyleSheet.create({
  container: {
    //backgroundColor: '#272727'
  },

  title: {
    color: '#000'
  },


  startBorder: {
    width: 190,
    borderColor:'#000000',
    right: 5,

    position:'absolute',
    flexDirection: 'row'
  },

  startBorderText: {
    color: '#ff0000',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight:5,
  },


  iconText: {
    color: '#fff',
    fontSize: 10
  },


  mapIcon: {
    width: 10,
    height: 10
  },

  icon: {
    color: '#fff'
  },
  map: {
    flex: 1
  },
  actionButtonIcon: {
    fontSize: 24,
    color: '#fff'
  },

  actionButtonIcon2: {
    fontSize: 24,
    color: '#000'
  },


  status: {
    fontSize: 12
  },
  markerIcon: {
    borderWidth:1,
    borderColor:'#000000',
    backgroundColor: 'rgba(0,179,253, 0.6)',
    width: 10,
    height: 10,
    borderRadius: 5
  },
  stopZoneMarker: {
    borderWidth:1,
    borderColor: 'red',
    backgroundColor: COLORS.red,
    opacity: 0.2,
    borderRadius: 15,
    zIndex: 0,
    width: 30,
    height: 30
  },
  geofenceHitMarker: {
    borderWidth:1,
    borderColor:'black',
    borderRadius: 6,
    zIndex: 10,
    width: 12,
    height:12
  },
  markerIcon: {
    borderWidth:1,
    borderColor:'#000000',
    backgroundColor: COLORS.polyline_color,
    width: 10,
    height: 10,
    borderRadius: 5
  },
  // Map Menu on top-right.  What a pain to style this thing...
  mapMenu: {
    position:'absolute',
    right: 5,
    top: ACTION_BUTTON_OFFSET_Y,
    flexDirection: 'row'
  },

  mapMenu2: {
    position:'absolute',
    right: 15,
    bottom: 60,
    flexDirection: 'row'
  },

  mapMenu2Icon: {
    color: COLORS.custom_blue
  },


  mapMenuButton: {
    width: 30,
    height: 30,
    marginLeft: 10
  },

  mapMenuButtonIcon: {
    width: 10,
    height: 10,
  },



  mapMenuIcon: {
    color: '#000'
  },
  mapMenuButtonIcon: {
    marginRight: 0
  },
  motionActivityIcon: {
    fontSize: 24
  },


  SlideSwichBox: {
    marginLeft: 10,
    justifyContent: 'center',
  },


  mapMenuBottom: {
    position:'absolute',
    bottom: 5,
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5
  },


  footer: {
    backgroundColor: COLORS.skyblue,
    paddingLeft: 5,
    paddingRight: 5
  },
  footerBody: {
    justifyContent: 'center',
    width: 200,
    flex: 1
  },


});
