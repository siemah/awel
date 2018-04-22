/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import firebase from 'react-native-firebase';

import Login from "./components/Login";
import ForgetPassword from "./components/ForgetPassword";
import Register from "./components/Register";
import GloChat from "./components/GloChat";
import Friendslist from "./components/FriendList";

import { StackNavigator, DrawerNavigator, } from "react-navigation";

/*const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});*/

class Home extends Component {

  state = {
      loading: true,
      isAuthenticated: false,
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged( user => {
      // console.warn( 'USR',  user );
      if( user ) this.setState({isAuthenticated: true, loading: false});
      else this.setState({loading: false, isAuthenticated: false});
    });
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#16a085",
      elevation: null,
      color: "#FFFFFF",
    },
    header: null
  };

  render() {
    // alert( this.state.loading + " " + this.state.isAuthenticated)
    if( this.state.loading ) return <ActivityIndicator style={{alignItems: 'center', flex: 1}} size="large" color="green" />;
    else if( !this.state.isAuthenticated )
      return <Login navigation={this.props.navigation} />
    return <Friendslist navigation={ this.props.navigation } />
  }

}
const headerTitleStyle = {
  color: "#FFFFFF",
};
const headerLeft = {
  color: "#FFFFFF"
}
export default App = StackNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      title: "Home"
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      title: "Login"
    }
  },
  Register: {
    screen: Register,
    navigationOptions: {
      title: "Register",
      headerTitleStyle,
    }
  },
  ForgetPassword: {
    screen: ForgetPassword,
    navigationOptions: {
      title: "ForgetPassword"
    }
  },
  GloChat: {
    screen: GloChat,
  },
  Friendlist: {
    screen: Friendslist,
    navigationOptions: {
      title: "Friendslist"
    }
  },

});

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
