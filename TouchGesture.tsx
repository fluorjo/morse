import React, {useRef, useState} from 'react';
import {Animated, PanResponder, StyleSheet, Text, View} from 'react-native';

const TouchGesture = ({onDxExceed}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [dxValue, setDxValue] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        Animated.event([null, {dx: pan.x, dy: pan.y}], {
          useNativeDriver: false,
        })(event, gestureState);
        setDxValue(gestureState.dx);

        // dx가 일정 값 이상이 되면 onDxExceed 함수를 호출합니다.
        if (gestureState.dx > 20 && onDxExceed) {
          onDxExceed();
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
