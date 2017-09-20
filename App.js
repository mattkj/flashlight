import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, Permissions } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      hasCameraPermission: null,
      flashMode: Camera.Constants.FlashMode.torch,
      strobeState: false
    };
  }

  flashLight(flashMode){
    const FlashMode = Camera.Constants.FlashMode;
    let newFlash = (flashMode === FlashMode.off) ? FlashMode.torch : FlashMode.off;
    this.setState({flashMode: newFlash})
  }

  strobe(strobeState){
    if (strobeState === true) {
      clearInterval(this.strobeInterval);
      this.setState({strobeState: false});
    } else {
      // this.strobeInterval = setInterval(this.flashLight(this.state.flashMode), 1000);
      this.strobeInterval = setInterval(() => {
        const FlashMode = Camera.Constants.FlashMode;
        let newFlash = (this.state.flashMode === FlashMode.off) ? FlashMode.torch : FlashMode.off;
        this.setState({flashMode: newFlash});
      }, 1000);
      this.setState({strobeState: true});
    }
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ 
      hasCameraPermission: status === 'granted'
    });
  }
  
  render() {
    const { hasCameraPermission, flashMode } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Please allow access to camera</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Camera flashMode={flashMode} />
          <TouchableOpacity activeOpacity={1} onPress={() => this.flashLight(flashMode)}>
            <MaterialCommunityIcons 
              name={(flashMode === Camera.Constants.FlashMode.off) ? 'flashlight-off' : 'flashlight'} 
              size={100}
              color={(flashMode === Camera.Constants.FlashMode.off) ? '#666666' : 'white'} 
            />
          </TouchableOpacity>
          <Button title="Strobe!" onPress={() => this.strobe(this.state.strobeState)} />
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
  text: {
    color: 'white'
  }
});
