import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, Permissions } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      hasCameraPermission: null,
      flashMode: Camera.Constants.FlashMode.torch
    };
  }

  flashLight(flashMode){
    const FlashMode = Camera.Constants.FlashMode;
    let newFlash = (flashMode === FlashMode.off) ? FlashMode.torch : FlashMode.off;
    this.setState({flashMode: newFlash})
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ 
      hasCameraPermission: status === 'granted'
    });
  }
  
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return (
        <View style={styles.container}>
          <Text style={{color: 'white'}}>Please allow access to camera</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Camera flashMode={this.state.flashMode} />
          <TouchableOpacity activeOpacity={1} onPress={() => this.flashLight(this.state.flashMode)}>
            <MaterialCommunityIcons 
              name={(this.state.flashMode === Camera.Constants.FlashMode.off) ? 'flashlight-off' : 'flashlight'} 
              size={100}
              color={(this.state.flashMode === Camera.Constants.FlashMode.off) ? '#666666' : 'white'} 
            />
          </TouchableOpacity>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
