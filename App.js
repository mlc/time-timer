import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import Clock from './Clock';

function now(): Number {
  return (new Date()).getTime();
}

export default class App extends Component {
  intervalId = 0;

  state = {
    ms: 0,
    expiry: 0
  };

  onInterval() {
    const { ms, expiry } = this.state;

    if (ms > 0) {
      const newMs = Math.max(0, expiry - now());
      this.setState({ms: newMs, expiry: expiry});
    }
  }

  onMinutes(min) {
    const oldMs = this.state.ms;
    const newMs = min * 60000;
    if (oldMs <= 0 || Math.abs(oldMs - newMs) < 60000 * 50) {
      this.setState({ms: newMs, expiry: now() + newMs});
    }
  }

  componentWillMount() {
    this.intervalId = setInterval(this.onInterval.bind(this), 500);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
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
