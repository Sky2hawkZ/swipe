import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
export default class Deck extends Component {
    position = new Animated.ValueXY();

    panResponder = new PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
            this.position.setValue({ x: gesture.dx, y: gesture.dy })
        },
        onPanResponderRelease: (event, gesture) => {
            if (gesture.dx > SWIPE_THRESHOLD) {
                this.forceSwipe('right');
            } else if (gesture.dx < -SWIPE_THRESHOLD) {
                this.forceSwipe('left');
            } else {
                this.resetPosition();
            }
        }
    });

    state = {
        panResponder: this.panResponder,
        position: this.position
    }

    forceSwipe(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));

        onSwipeComplete(direction) {
            const { onSwipeLeft, onSwipeRight } = this.props;

            direction === 'right' ? onSwipeRight() : onSwipeLeft();
        }
    }
    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    getCardStyle() {
        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 3, 0, SCREEN_WIDTH * 3],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        return {
            ...position.getLayout(),
            transform: [{ rotate }]
        };
    }

    renderCards = () => {
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View
                        key={item.id}
                        style={this.getCardStyle()}
                        {...this.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                )
            }

            return this.props.renderCard(item);
        });
    };

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        )
    }
}