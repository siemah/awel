import React from 'react';
import { Text, View, StyleSheet, } from 'react-native';

import { GiftedChat } from 'react-native-gifted-chat';
import firebase from 'react-native-firebase';

export default class GloChat extends React.Component {

  constructor(props){
  	super(props);
  	this.state = {
      name: false,
      messages: [],
    };
    // current user
    this.user = firebase.auth().currentUser;
    // retreive uid of select user to chat with
    const { uid } = this.getParams();
    // chatRef the reference to database collection
    this.chatRef = firebase.database().ref().child( 'chat/' + this.generateId( uid ) );
    this.chatRefData = this.chatRef.orderByChild( 'order' );
    this.onSend = this.onSend.bind( this );
  }

  /**
   * generate a id to chat room between users
   * @return { Number } the id of chat room
   */
   generateId = friendUid => {
     if( this.user.uid > friendUid ) return `${this.user.uid}+${friendUid}`;
     else return `${friendUid}+${this.user.uid}`;
   }

  /** retreive a params pass to this page */
  getParams = () => this.props.navigation.state.params

  static navigationOptions = ({ navigation }) => {
    let { name } = navigation.state.params;
    return {
      title: name || 'Chat',
    }
  }

  listenForItems = chatRefData => {
    chatRefData.on( 'value', data => {
      var items = [];
      data.forEach( child => {
        let { uid, text, createdAt, user } = child.val();
        items.push({
          _id: createdAt,
          text,
          createdAt: new Date( createdAt ),
          user: { _id: uid }
        });
      });
      // console.warn( items );
      this.setState({ loading: false, messages: items });
    });
  }

  componentDidMount() {
    this.listenForItems( this.chatRefData );
  }

  componentWillUnmount() {
    this.chatRefData.off();
  }

  onSend = ( messages = [] ) => {
    let createdAt = new Date().getTime();
    messages.forEach( message => {
      this.chatRef.push({
        _id: createdAt,
        createdAt,
        text: message.text,
        uid: this.user.uid,
        order: -1 * createdAt,
      });
    })
  }

  render() {
    return (
      <GiftedChat
        messages={ this.state.messages }
        onSend={ this.onSend }
        user={{
          _id: this.user.uid,
          // name: this.user.name,
        }}
      />
    );
  }

}

const mainStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
    backgroundColor: "rgba(45,45,45,.4)",
  }
})
