import React from 'react';
import { 
  View,
  ScrollView, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
} from 'react-native';

export default class Drawer extends React.Component {

  render = () => {
    return(
      <Animated.View 
        style={[ this.props.style, styles.drawerContainer, { left: this.props.position.x } ]}>
        <TouchableOpacity 
          activeOpacity={1}
          style={{ display: 'flex', }}
          onPress={ this.props.closeDrawer } >
          <ScrollView style={{ backgroundColor: '#efefef', width: 300, height: '100%', }} >
            { this.props.children }
          </ScrollView>
        </TouchableOpacity>
      </Animated.View>
    );
  }

}

const styles = StyleSheet.create({
  drawerContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,.5)',
    zIndex: 1000,
  }, 
});