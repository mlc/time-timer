import React, {Component, PropTypes} from 'react';
import {ART, Dimensions, StyleSheet, Text, View} from 'react-native';
import {range} from 'lodash';

import {Point, stringify} from './utils';
import Circle from "./Circle";

const { Shape, Surface, Text: ARText } = ART;

const dimensionWindow = Dimensions.get('window'),
  minWindowSize = Math.min(dimensionWindow.height, dimensionWindow.width);

type Props = {
  width: Number,
  height: Number,
  minutes: Number,
  onTap: (Number) => void
}

export default class Clock extends Component<Props> {
  static defaultProps : Props = {
    width: minWindowSize,
    height: minWindowSize,
    minutes: 0,
    onTap: () => {}
  };

  state = {
    ticks: '',
    labels: [],
    pointer: ''
  };

  componentWillMount() {
    this.computeNextState(this.props);
  }

  componentWillReceiveProps() {
    this.computeNextState(this.props);
  }

  computeNextState(nextProps) {
    const {width, height, minutes} = nextProps;
    const scale = Math.min(width, height) / 18.5; // physical TimeTimer is 18.5 cm in size
    const centerX = width/2, centerY = height/2;

    const xy = (r, theta): Point => ({
      x: scale * r * Math.cos(theta) + centerX,
      y: scale * r * Math.sin(theta) + centerY
    });

    const stringifyPt = (r, theta) => {
      const p = xy(r, theta);
      return stringify(p.x) + " " + stringify(p.y);
    };

    const radians = (mins) => (45 - mins) * Math.PI / 30;

    const majorRadius = stringify(7.5 * scale);
    const arcFlags = minutes <= 30 ? "0 0" : "1 0";

    const newState = {};

    newState.ticks = range(60).map((i: Number) => {
      const length = (i % 5 === 0) ? 2 : 0.5;
      return "M" + stringifyPt(7.25, radians(i)) + "L" + stringifyPt(7.25 - length, radians(i));
    }).join('');

    newState.labels = range(0, 60, 5).map((i: Number) => {
      const point = xy(8.25, radians(i));
      return {
        key: "label_" + i,
        text: i.toString(),
        x: point.x - (i < 10 ? 9 : 18), // i can't figure out a good way to do centering
        y: point.y - 18
      };
    });

    newState.pointer = "M" + stringifyPt(0, 0) +
      "L" + stringifyPt(7.5, radians(0)) +
      "A" + majorRadius + " " + majorRadius + " 0 " + arcFlags + " " + stringifyPt(7.5, radians(minutes)) +
      "Z";

    newState.center = xy(0, 0);
    newState.blackRadius = scale;
    newState.redRadius = 0.4 * scale;
    newState.goldRadius = 0.15 * scale;

    this.setState(newState);
  }

  handleTouchEvent(evt) {
    const { locationX, locationY } = evt.nativeEvent;
    const minutes = (45 - Math.atan2(locationY - this.state.center.y, locationX - this.state.center.x) * 30 / Math.PI) % 60;
    this.props.onTap(minutes);
  }

  render() {
    return(
      <View
        style={styles.container}
        onStartShouldSetResponder={() => true}
        onResponderReject={() => console.log("we got rejected")}
        onResponderGrant={this.handleTouchEvent.bind(this)}
        onResponderMove={this.handleTouchEvent.bind(this)}
        width={this.props.width}
        height={this.props.height}>
        <Surface
          width={this.props.width}
          height={this.props.height}>
          <Shape
            d={this.state.ticks}
            stroke='#000000'
            strokeWidth={3}
          />
          {this.state.labels.map(label => (
            <ARText
              key={label.key}
              x={label.x}
              y={label.y}
              font='30px Helvetica'
              fill='#000000'>
              {label.text}
            </ARText>
          ))}
          <Circle center={this.state.center} radius={this.state.blackRadius} color='#000000'/>
          <Shape
            d={this.state.pointer}
            fill='#ff2c00bf'
          />
          <Circle center={this.state.center} radius={this.state.redRadius} color='#ff2c00'/>
          <Circle center={this.state.center} radius={this.state.goldRadius} color='#d2b73d'/>
        </Surface>
        <Text style={styles.branding}>TIME TIMER ®</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
  branding: {
    position: 'absolute',
    color: '#000000',
    padding: 8,
    fontSize: 12,
    alignSelf: 'flex-end'
  }
});