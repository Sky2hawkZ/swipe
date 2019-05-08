import React, { Component } from 'react';
import { View, Animated, PanResponder } from 'react-native';

export default class Deck extends Component {
    position = new Animated.ValueXY();

    panResponder = new PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
            this.position.setValue({ x: gesture.dx, y: gesture.dy })
        },
        onPanResponderEnd: (event, gesture) => {
        }
    });

    state = {
        panResponder: this.panResponder,
        position: this.position
    }

    renderCards = () => {
        return this.props.data.map(item => {
            return this.props.renderCard(item);
        });
    };

    render() {
        return <Animated.View
            style={this.state.position.getLayout()}
            {...this.panResponder.panHandlers}>{this.renderCards()}
        </Animated.View>
    }
}