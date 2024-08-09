import React, {useRef, useState} from 'react';
import {Animated, PanResponder, StyleSheet, Text, View} from 'react-native';

const TouchGesture = ({onDxRight, onDxLeft, length_of_unit}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [dxValue, setDxValue] = useState(0);
  const intervalRef = useRef(null);

  const startDashInterval = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        onDxLeft();
      }, length_of_unit * 3 + length_of_unit);
    }
  };
  const startDotInterval = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        onDxRight();
      }, length_of_unit + length_of_unit);
    }
  };
  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        Animated.event([null, {dx: pan.x, dy: pan.y}], {
          useNativeDriver: false,
        })(event, gestureState);
        setDxValue(gestureState.dx);

        if (gestureState.dx > 10) {
          startDotInterval();
        } else if (gestureState.dx < -10) {
          startDashInterval();
        } else {
          stopInterval();
        }
      },
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <Text>dx: {dxValue}</Text>
      <Animated.View
        style={{
          transform: [{translateX: pan.x}, {translateY: pan.y}],
        }}
        {...panResponder.panHandlers}>
        <View style={styles.box} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  box: {
    height: 150,
    width: 150,
    backgroundColor: 'blue',
    borderRadius: 100,
  },
});

export default TouchGesture;
