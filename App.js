import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import Clock from './Clock';

export default class App extends Component {
  state = {
    ms: 0,
    expiry: 0
  };

  onMinutes(min) {
    const oldMs = this.state.ms;
    const newMs = min * 60000;
    console.log(oldMs, newMs, Math.abs(oldMs - newMs));
    if (oldMs <= 0 || Math.abs(oldMs - newMs) < 60000 * 50) {
      this.setState({ms: newMs, expiry: new Date() + newMs});
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Clock minutes={this.state.ms / 60000}
               onTap={this.onMinutes.bind(this)}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e7e7e7',
    alignItems: 'flex-start',
    justifyContent: 'center',
  }
});
