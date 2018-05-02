import React, { Component } from 'react';
import {
  View,
  Alert,
  StyleSheet,
} from 'react-native';

// Import native-base UI components
import {
  Switch,
} from 'native-base';
import SettingsService from '../lib/SettingsService';
import {COLORS, STORAGE_KEY, SOUNDS} from '../lib/config';


//使用例：<SlideSwich onValueChange={(enabled) => this.onToggleEnabled(enabled)} value={this.state.enabled}/>


export default class SlideSwich extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSwichOn: props.value,
    };
    //settingsService
    this.settingsService = SettingsService.getInstance();
  }

  render() {
    return (
      <View>
        <Switch onValueChange={() => this.onValueChange()} value={this.state.isSwichOn} style={styles.SlideSwichBox} />
      </View>
    );
  }

  //スライドの変更イベント
  onValueChange(value) {
    this.settingsService.playSound('BUTTON_CLICK');

    //ステータス変更
    let isSwichOn = !this.state.isSwichOn;
    this.setState({isSwichOn: !this.state.isSwichOn});


    let title;
    let message;
    
    if (isSwichOn) {
      title = 'スタート？';
      message = '記録を開始しますか？';
    } else {
       title = 'ゴール？';
       message = '終了しますか？一時停止の場合には下の三角ボタンを押してください';
    }

    //確認Alertを表示。OKが押されたらonToggleEnabledを呼ぶ
    Alert.alert( title, message,
    [
        {text: 'いいえ', onPress: () => {
          //いいえを選んだらスイッチ操作を元に戻す
          this.setState({isSwichOn: !this.state.isSwichOn});
        }, style: 'cancel'},
        {text: 'はい', onPress: () => {
          this.onToggleEnabled();
        }
      },],{ cancelable: false }
    )

  }


　//親へイベントコール
  onToggleEnabled(value) {
    this.props.onValueChange(this.state.isSwichOn);
  }

}


const styles = StyleSheet.create({
  SlideSwichBox: {
    backgroundColor: COLORS.white
  },
});


/*
SlideSwich.propTypes = {
  value: PropTypes.bool,
};

*/