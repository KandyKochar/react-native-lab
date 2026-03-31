import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder
} from 'react-native';

export default function App() {

  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;

  const colors = ['#6C5CE7', '#00CEC9', '#FD79A8', '#FDCB6E'];
  const [colorIndex, setColorIndex] = useState(0);

  const panResponder = useRef(
    PanResponder.create({

      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });

        // Scale up when touched
        Animated.spring(scale, {
          toValue: 1.2,
          useNativeDriver: false,
        }).start();
      },

      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),

      onPanResponderRelease: () => {
        pan.flattenOffset();

        // Change color only (NO snap back now)
        setColorIndex((prev) => (prev + 1) % colors.length);

        // Scale back down
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }).start();
      }

    })
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Drag Me Anywhere ✨</Text>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.box,
          {
            backgroundColor: colors[colorIndex],
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: scale }
            ]
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: '#ffffff',
    fontSize: 20,
    marginBottom: 30,
    fontWeight: '600'
  },

  box: {
    width: 120,
    height: 120,
    borderRadius: 20,

    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,

    elevation: 10,
  },
});