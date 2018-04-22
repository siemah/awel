import React, { Component } from "react";
import {
  AppRegistry,
  KeyboardAvoidingView,
  TouchableOpacity,
  AsyncStorage,
  Image,
  TextInput,
  StyleSheet, // CSS-like styles
  Text, // Renders text
  View, // Container component
  Keyboard,
  Animated,
} from "react-native";

import { StackNavigator } from "react-navigation";
import Spinner from "react-native-loading-spinner-overlay";
import firebase from 'react-native-firebase';


export default class Login extends Component {

  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      loading: false, 
      fadeIn: new Animated.Value(-40),
      shake: new Animated.Value(0),
    };
    firebase.auth().onAuthStateChanged( user => {
      console.log("from constructor: ", user)
      if( user ) {
        this.props.navigation.navigate('Boiler');
        this.setState({ loading: false });
      }
    });
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#16a085",
      elevation: null
    },
    header: null
  };

  onLoginPress = async () => {
    //let regexp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    let { email, password } = this.state;
    
    if ( email.length < 6 || password.length < 6 ) {
      Animated.sequence([
        Animated.timing(
          this.state.shake,
          {
            toValue: 10,
            duration: 50,
          }
        ), 
        Animated.timing(
          this.state.shake,
          {
            toValue: -10,
            duration: 100,
          }
        ),
        Animated.timing(
          this.state.shake,
          {
            toValue: 0,
            duration: 50,
          }
        )
      ]).start();
      return null;
    }
    // show spinner
    this.setState({ loading: true });
    // save email and password in mobile app
    try {
      await AsyncStorage.setItem( 'email', email );
      await AsyncStorage.setItem( 'password', password );
    } catch (e) {
      console.log(e)
    }
    // auth using firebase cloud services
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then( response => {
        this.setState({ loading: false });
      })
      .catch( err => {
        this.setState({ error:`${err.code}`, loading: false });
        Animated.sequence([
          Animated.timing(
            this.state.fadeIn,
            {
              toValue: 20,
              duration: 100,
            }
          ),
          Animated.timing(
            this.state.fadeIn,
            {
              toValue: 0,
              duration: 100,
            }
          )
        ]).start();
      });
  }

  onSignUp = () => {
    this.props.navigation.navigate('Register')
  }

  render() {
    return (
      <View style={styles.container}>
        
        <View style={styles.keyboard}>

          <View style={[styles.inputContainer, { marginBottom: 20, } ]} >
            <Image source={require('../assets/user.png')} style={styles.icon} />
            <TextInput
              placeholder="Username"
              placeholderTextColor="rgba(150,150,150,0.6)"
              returnKeyType="next"
              onSubmitEditing={() => this.passwordInput.focus()}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={this.state.email}
              style={styles.input}
              onChangeText={email => this.setState({ email })}
              underlineColorAndroid="transparent"
            />
          </View>
          
          <View style={[ styles.inputContainer ]} >
            <Image source={require('../assets/password-key.png') } style={ styles.icon } />
            <TextInput
              placeholder="Password"
              placeholderTextColor="rgba(150,150,150,0.6)"
              returnKeyType="go"
              style={styles.input}
              secureTextEntry
              ref={input => (this.passwordInput = input)}
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
              underlineColorAndroid="transparent"
            />
          </View>
          

          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => this.props.navigation.navigate('ForgetPassword')}
            style={{ width: '100%', marginTop: 10, height: 20, }}
           >
            <View style={{  marginBottom: 20, position: 'relative' }}>
              <Text
                style={styles.text}
                onPress={() => this.props.navigation.navigate("ForgetPassword")}
                title="Forget Password"
              >
                Forget Password
              </Text>
            </View>
          </TouchableOpacity>

          <Animated.View
            style={[styles.buttonContainer, { transform: [{ translateX: this.state.shake }],  } ]}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={this.onLoginPress.bind(this)}
              style={{height: '100%',paddingVertical: 15,}}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
          </Animated.View>

        </View> 
        
        <View style={ styles.secondView } >
          <Text style={{fontWeight: '500', fontSize: 13, }} >Don't have an account</Text>
          <TouchableOpacity 
            activeOpacity={1} 
            style={ styles.signupBtn } 
            onPress = { this.onSignUp } >
            <Text style = { styles.signupText } > { `Sign up`.toUpperCase() } </Text>
          </TouchableOpacity>
        </View>

        <Animated.View style={{
          position: 'absolute',
          top: this.state.fadeIn,
          left: 0, 
          width: '100%',
          backgroundColor: "#D50000",
          height: 40,
          padding: 10,
        }} >
          <Text style={{ color: "#FFFFFF", }} >{this.state.error}</Text>
        </Animated.View>
        <Spinner visible={this.state.loading} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  subtext: {
    color: "#ffffff",
    marginTop: 10,
    width: 160,
    textAlign: "center",
    opacity: 0.8
  },
  keyboard:{
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flex: 3,
    position: 'relative',
  },
  buttonContainer: {
    backgroundColor: "rgba(239, 83, 80, .8)",
    width: '100%',
    position: 'absolute',
    bottom: 30,
    left: 20,
    borderRadius: 3,
    elevation: 4
  },
  buttonText: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700"
  },
  button: {
    backgroundColor: "#27ae60",
    paddingVertical: 15
  }, 
  inputContainer: {
    position: "relative",
    width: '100%',
  },
  input: {
    backgroundColor: "#f5f5f5",
    color: "#999",
    height: 45,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 3,
    width: '100%',
  }, 
  icon: {
    height: 14,
    width: 14,
    position: 'absolute',
    zIndex: 999,
    top: 15,
    left: 15,
  }, 
  text: {
    color: 'rgba(95, 95, 95, 0.7)', 
    fontSize: 12, 
    fontWeight: '500',
  }, 
  secondView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  signupBtn: {
    height: 30,
    width: 150,
  }, 
  signupText: {
    color: 'rgba(239, 83, 80, .7)',
    textAlign: 'center',
    lineHeight: 30,
    fontSize: 16,
    fontWeight: '500',
    position: 'relative',
    bottom: 5,
  }, 
});
