import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Linking,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Container, Header, Content, Footer,
  Left, Body, Right,
  Card, CardItem, 
  H1,
  Button, Icon,
  Title,
  Form, Item, Input, Label
} from 'native-base';

const MANUAL_HOST = 'https://tachibanawangan.com/wan-navi/';

export default class ManualScreen extends React.Component {
  static navigationOptions = {
    //header: null,
    title: '湾なび 使い方',
  };

  render() {
    return (
      <View style={styles.container}>

        <Header style={styles.header}>
          <Body>
            <Title style={styles.title}>使い方</Title>
          </Body>
        </Header>


        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>


          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>使い方とインストール</Text>

          </View>



            <Card style={styles.userInfo}>
              <Text style={styles.p}>以下のボタンを押す事で使い方を表示する事ができます。</Text>


              <CardItem style={{margin: 0}}>
                <Left>
                </Left>
                <Right>
                  <Button small full onPress={this.onClickViewServer.bind(this)}><Text style={styles.textWhite}>使い方を見る</Text></Button>
                </Right>
              </CardItem>
            </Card>


            <Text style={styles.getStartedText}>
              湾なびは以下のページからインストールできます。 ぜひ、お友達に教えてあげてください。
            </Text>


             <Image
              source={ require('../assets/images/qrcode_tachibanawangan-wan-navi.png')}
              style={styles.qrImage}
            />

          </View>



            <Card style={styles.userInfo}>
              <Text style={styles.p}>湾ナビは橘湾岸マラニックのランナー皆さんの完走を願って作成しました。</Text>
              <Text style={styles.p}>完走してゴールの南本公民館で会いましょう。</Text>

              <CardItem style={{margin: 0}}>
                <Left>
                </Left>
                <Right>

             <Image
              source={ require('../assets/images/opening.jpg')}
              style={styles.openingImage}
              />
                </Right>
              </CardItem>
            </Card>


        </ScrollView>

        
      </View>
    );
  }



  onClickViewServer() {
    Linking.canOpenURL(MANUAL_HOST).then(supported => {
     if (supported) {
       Linking.openURL(MANUAL_HOST);
     } else {
       console.log("Don't know how to open URI: " + this.props.url);
     }
   });
 }



}

const styles = StyleSheet.create({
  textWhite: {
    color: '#fff'
  },
  header: {
    backgroundColor: '#fff'
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 0,
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
  },

  qrImage: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },

  openingImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },


  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },





});
