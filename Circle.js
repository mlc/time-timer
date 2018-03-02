import React, { Component } from 'react'
import {ART} from 'react-native';
import {stringify, Point} from './utils';

const { Shape } = ART;

type Props = {
  center: Point,
  radius: Number,
  color: String
}

export default class Circle extends Component<Props> {
  path(): String {
    const { center, radius } = this.props;

    return "M" + stringify(center.x) + " " + stringify(center.y) +
      " m" + stringify(-radius) + " 0" +
      " a" + stringify(radius) + " " + stringify(radius) + " 0 1 0 " + stringify(radius * 2) + " 0" +
      " a" + stringify(radius) + " " + stringify(radius) + " 0 1 0 " + stringify(-radius * 2) + " 0";
  }

  render() {
    const { color } = this.props;

    return (
      <Shape d={this.path()} fill={color}/>
    );
  }
}