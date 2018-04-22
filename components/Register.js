import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Image,
  KeyboardAvoidingView,
  AsyncStorage,
  Animated
} from "react-native";

import { StackNavigator } from "react-navigation";
import firebase from 'react-native-firebase';
import Spinner from 'react-native-loading-spinner-overlay';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
      error: '',
      loading: false,
    };
    firebase.auth().onAuthStateChanged( user => {
      console.log("from constructor: ", user)
      if( user ) {
        // save user on friends DB
        firebase.database().ref()
          .child( 'friends' )
          .push({
            uid: user.uid,
            email: user.email,
            name: this.state.name
          });
        this.setState({ loading: false });
        this.props.navigation.navigate('Boiler');
      }
    });
  }

  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#16a085",
      elevation: null
    }
  };

  async onRegisterPress() {
    const { email, password, name } = this.state;
    this.setState({loading: true});
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("name", name);
    await AsyncStorage.setItem("password", password);
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then( response => {
        this.setState({loading: false});
      })
      .catch( err => {
        this.setState({loading: false, error: err.code });
      })
  }

  render() {
    return (
      <View behavior="padding" style={styles.container}>

        <View style={styles.logoContainer}>
          {/* <Image style={styles.logo} source={require("../assets/RNFirebase.png")} /> */}
          <Text style={styles.subtext}>Sign Up:</Text>
        </View>

        <KeyboardAvoidingView>
          <TextInput
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="next"
            onSubmitEditing={() => this.emailInput.focus()}
            underlineColorAndroid="#FFFFFF"
          />
          <TextInput
            value={this.state.email}
            underlineColorAndroid="#FFFFFF"
            onChangeText={email => this.setState({ email })}
            style={styles.input}
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="next"
            ref={input => (this.emailInput = input)}
            onSubmitEditing={() => this.passwordCInput.focus()}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Email"
          />
          <TextInput
            value={this.state.password}
            onChangeText={password => this.setState({ password })}
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="rgba(255,255,255,0.7)"
            ref={input => (this.passwordCInput = input)}
            onSubmitEditing={() => this.passwordInput.focus()}
            returnKeyType="next"
            autoCapitalize="none"
            secureTextEntry
            underlineColorAndroid="#FFFFFF"
          />
          <TextInput
            value={this.state.password}
            onChangeText={password_confirmation => this.setState({ password_confirmation })}
            style={styles.input}
            placeholder="Confirm Password"
            autoCapitalize="none"
            secureTextEntry={true}
            placeholderTextColor="rgba(255,255,255,0.7)"
            returnKeyType="go"
            secureTextEntry
            underlineColorAndroid="#FFFFFF"
            ref={input => (this.passwordInput = input)}
          />
        </KeyboardAvoidingView>

        <TouchableHighlight
          onPress={this.onRegisterPress.bind(this)}
          style={styles.button}
         >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableHighlight>

        <Text style={{color: "red"}} >{ this.state.error }</Text>
        <Spinner visible={this.state.loading} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1.2,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#16a085",
    padding: 20,
    paddingTop: 100
  },
  logoContainer: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logo: {
    width: 80,
    height: 80
  },
  input: {
    height: 40,
    width: 350,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    color: "#fff",
    paddingHorizontal: 10
  },
  button: {
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "stretch",
    marginTop: 10,
    justifyContent: "center",
    paddingVertical: 15,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 18,
    alignSelf: "center",
    textAlign: "center",
    color: "#FFF",
    fontWeight: "700"
  },
  subtext: {
    color: "#ffffff",
    width: 160,
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 20
  }
});
