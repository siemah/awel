import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Button,
  Animated,
  ActivityIndicator,
  DrawerLayoutAndroid,
} from 'react-native';
// import dependency from node_modules
import { DrawerNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import Spinner from "react-native-loading-spinner-overlay";
// import custom component
import Drawer from './widgets/Drawer';
// variables declaration
const { width, height } = Dimensions.get('window');

export default class Friendslist extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return{
      drawerLabel: 'ChatHome',
      header: null,
    }
  }

  constructor( props ) {
    super( props );
    this.state = {
      loading: true,
      dataSource: [],
      uid: null,
      email: '',
      name: '',
      positionX: new Animated.Value(-width),
    }
    this.friendsRef = firebase.database().ref().child( 'friends' );
  }

  componentDidMount() {
    this.listenForItems( this.friendsRef );
  }

  /**
   * retreive all friends user
   * @param { String } the ref to firebase row
   */
  listenForItems = (friendsRef) => {
    // get  current user (loggedin user)
    let user = firebase.auth().currentUser;
    // console.warn("currentuser", user);
    // listen to value event
    friendsRef.on( 'value', snap =>{
      let dataSource = [];
      snap.forEach( item => {
        if( item.val().email !== user.email ) {
          let { name, email, uid } = item.val();
          dataSource.push({name, uid, email});
        }
      });
      // console.warn("Friends list", dataSource);
      // add results to datasource state
      this.setState({ dataSource, loading: false });
    });
  }

  renderFriendsList = ({ item, index }) => {
    let { uid, email, name } = item;
    // alert(name);
    return (
      <TouchableOpacity style={ style.friend }
        onPress={ () => {
          this.props.navigation.navigate( "GloChat", { uid, email, name, });
        }}
        activeOpacity={1}
        key={index}
        >
        <Image 
          source={{ uri: 'https://i.pinimg.com/originals/31/96/a4/3196a4c9a3f32e6cb3b9d4fe80a3a4ee.jpg' }} 
          style={{ position: 'absolute', top: 0, left: 0, right: 0, width: width - 40 , height: 120 }} />
        <Text style={{ fontSize: 25, fontWeight: '500', color: 'white', backgroundColor: 'rgba(45,45,45,0.6)',paddingHorizontal: 5 }} >{ name.toUpperCase() }</Text>
        <Text style={ style.fakeImg } >{ 'G' }</Text>
      </TouchableOpacity>
    );
  }

  _animeDrawer = positionX => {
    Animated.timing(
      this.state.positionX,
      {
        duration: 100,
        toValue: positionX,
      }
    ).start();
  }
  
  render() {
    return (
      <View style={ style.container } >

        {/* DrawerNavigator for android */}
        <Drawer 
          closeDrawer={ () => this._animeDrawer(-width) }
          position={{x: this.state.positionX , y: 0}}>
          <Button
            color='#ae4535'
            title='logout'
            onPress={() => {
              firebase
                .auth()
                .signOut()
                .then(
                  () => navigation.navigate('Login'),
                  err => console.log('error =>', err),
              );
            }}
            style={{ elevation: 0, }}
          />
        </Drawer>

        <View style={ style.header } >

          <View style={{ flex: 1, marginLeft: 10, }} >
            <TouchableOpacity activeOpacity={.9} onPress={ () => this._animeDrawer(0) } >
              <View style={[ style.burger, { marginTop: 0, } ]} ></View>
              <View style={[ style.burger, { marginTop: 8, width: 20, } ]} ></View>
              <View style={[ style.burger, { marginTop: 8, } ]} ></View>
            </TouchableOpacity>
          </View>

          <View style={{marginRight: 10}} >
            <TouchableOpacity activeOpacity={0.9} onPress={() => alert('search') }>
              <Image source={ require('../assets/search.png') } style={{width: 24, height: 24}} /> 
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ margin: 20, marginTop: 10, }} >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: '500', }} >Friends</Text>
        </View>
        
        <View>
          {
            (
              !this.state.dataSource.length &&
              <ActivityIndicator size="large" style={{ position: 'absolute', top: '20%', left: '40%' }} color='red' />
            ) ||
            <FlatList
              data={ this.state.dataSource }
              renderItem={ (item, index) => this.renderFriendsList(item) }
              style={{marginHorizontal: 20, }}
            />
          }
        </View>

      </View>
    );
  }

}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: "#4e046d",
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    margin: 10,
    marginVertical: 20,
  },
  friend: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fefefe',
    elevation: 4,
    position: 'relative',
    borderRadius: 3,
    overflow: 'hidden',
  },
  rightBtn: {
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 5,
    padding: 0,
  },
  fakeImg: {
    height: 40,
    width: 40,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#78ce54',
    textAlign: 'center',
    marginRight: 10,
    overflow: 'hidden',
    fontSize: 20,
    lineHeight: 35,
    fontWeight: '700',
    color: "white",
    backgroundColor: '#78de54',
    elevation: 5,
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  burger: {
    backgroundColor: '#FFF',
    height: 3,
    width: 30,
    borderRadius: 3,
  }
});


/*

          */