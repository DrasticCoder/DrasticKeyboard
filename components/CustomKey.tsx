import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';

const SWIPE_THRESHOLD = 20;
export interface KeyMapping {
  [key: string]: string | undefined;
}

export interface CustomKeyProps {
  label: string;
  mapping?: KeyMapping;
  onKeyPress: (char: string) => void;
}

const getSwipeDirection = (dx: number, dy: number): string => {
  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD)
    return 'tap';

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle >= -22.5 && angle < 22.5) return 'swipeRight';
  if (angle >= 22.5 && angle < 67.5) return 'swipeDownRight';
  if (angle >= 67.5 && angle < 112.5) return 'swipeDown';
  if (angle >= 112.5 && angle < 157.5) return 'swipeDownLeft';
  if (angle >= 157.5 || angle < -157.5) return 'swipeLeft';
  if (angle >= -157.5 && angle < -112.5) return 'swipeUpLeft';
  if (angle >= -112.5 && angle < -67.5) return 'swipeUp';
  if (angle >= -67.5 && angle < -22.5) return 'swipeUpRight';
  return 'tap';
};

const CustomKey: React.FC<CustomKeyProps> = ({
  label,
  mapping,
  onKeyPress,
}) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (
        _evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const { dx, dy } = gestureState;
        const direction = getSwipeDirection(dx, dy);
        const selectedChar =
          direction === 'tap'
            ? label
            : mapping && mapping[direction]
            ? mapping[direction]
            : label;
        onKeyPress(selectedChar);
      },
    }),
  ).current;

  return (
    <View {...panResponder.panHandlers} style={styles.keyContainer}>
      <Text style={styles.keyText}>{label}</Text>
      {/* Optionally add small labels for swipe mappings */}
    </View>
  );
};

const styles = StyleSheet.create({
  keyContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    height: 70,
  },
  keyText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CustomKey;
