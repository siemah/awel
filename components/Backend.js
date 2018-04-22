import firebase from 'react-native-firebase';

class Backend {
  uid = ''
  messagesRef = null

  /** check if user is authenticated with firebase and set uid */
  constructor(){
  	firebase.auth().onAuthStateChanged( user => {
      if( user ) this.uid = this.setUid(user.uid)

    });
  }

  /**
   * set the user id
   * @param { String } user id
   */
  setUid = value => {
    this.uid = value
  }

  /** get this user id */
  getUid = () => this.uid

  /** retreive the message from */
   loadMessages = cb => {
     this.messagesRef = firebase.database().ref('messages');
     this.messagesRef.off();
     const onReceive = data => {
       const message = data.val();
       cb({
         _id: data.key,
         text: message.text,
         createdAt: new Date(message.createdAt),
         user: {
           _id: message.user._id,
           name: message.user.name
         }
       });
     };
    this.messagesRef.limitToLast(20).on("child_added", onReceive);
   }

   /** send message to firebase cloud services */
   sendMessage = message => {
     for (var i = 0; i < message.length; i++) {
       this.messagesRef.push({
         text: message[i].text,
         user: message[i].user,
         createdAt: firebase.database.ServerValue.TIMESTAMP
       });
     }
   }

   /** */
   closeChat = () => {
     if( this.messagesRef )
      this.messagesRef.off();
   }

}

export default new Backend();
