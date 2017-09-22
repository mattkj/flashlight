import React from 'react';
import { Button, Slider, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, Permissions } from 'expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      hasCameraPermission: null,
      flashMode: Camera.Constants.FlashMode.off,
      strobeState: false,
      strobeDelay: 1000
    };
  }

  toggleFlashLight = () => {
    const FlashMode = Camera.Constants.FlashMode;
    let newFlash = (this.state.flashMode === FlashMode.off) ? FlashMode.torch : FlashMode.off;
    this.setState({flashMode: newFlash})
  }

  adjustStrobe(delay){
    this.setState({
      strobeDelay: (2000 - delay) + 100
    }, 
    () => this.strobe(true))
  }

  strobe(slider = false){
    if (!slider && this.state.strobeState === true) {
      clearInterval(this.strobeInterval);
      this.setState({strobeState: false});
    } else {
      clearInterval(this.strobeInterval);
      this.strobeInterval = setInterval(this.toggleFlashLight, this.state.strobeDelay);
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
          <TouchableOpacity activeOpacity={1} onPress={this.toggleFlashLight}>
            <MaterialCommunityIcons 
              name='flashlight'
              size={100}
              color={(flashMode === Camera.Constants.FlashMode.off) ? '#666666' : 'white'} 
            />
          </TouchableOpacity>
          <Button title="Strobe!" onPress={() => this.strobe()} />
          <View style={{width: '100%', margin: 20, height: 50}}>
            { this.state.strobeState &&
              <Slider 
                minimumTrackTintColor='white'
                maximumTrackTintColor='rgba(255,255,255,0.5)'
                minimumValue={100}
                maximumValue={2000}
                step={100}
                value={(2000 - this.state.strobeDelay) + 100}
                onSlidingComplete={delay => this.adjustStrobe(delay)}
              />
            }
          </View>
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
