import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Camera, Permissions } from 'expo';

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      flashMode: Camera.Constants.FlashMode.off
    };
  }

  swapCamera(type){
    const Type = Camera.Constants.Type;
    let newType = (type === Type.front) ? Type.back : Type.front;
    this.setState({type: newType})
  }

  flashLight(flashMode){
    const FlashMode = Camera.Constants.FlashMode;
    let newFlash = (flashMode === FlashMode.off) ? FlashMode.torch : FlashMode.off;
    this.setState({flashMode: newFlash})
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  
  render() {
    return (
      <View style={{flex: 1}}>
        <Camera style={styles.camera} type={this.state.type} flashMode={this.state.flashMode}>
          <Button title="Swap" onPress={() => this.swapCamera(this.state.type)} />
          <Button title="Flash" onPress={() => this.flashLight(this.state.flashMode)} />
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
});
