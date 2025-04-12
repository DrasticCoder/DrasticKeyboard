import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

// For persistent settings (keyboard colors, etc.)
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// Default keyboard height is 45% of the screen.
const DEFAULT_KEYBOARD_HEIGHT = SCREEN_HEIGHT * 0.45;

const SWIPE_THRESHOLD = 20; // minimal movement (in pixels) before swipe detection

// --- Improved swipe direction using angle in degrees ---
function getSwipeDirection(dx: number, dy: number): string {
  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD)
    return 'tap';
  // Calculate angle in degrees from the positive x-axis
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  // Define ranges (example boundaries; you may refine these):
  if (angle >= -22.5 && angle < 22.5) return 'rightSide';
  if (angle >= 22.5 && angle < 67.5) return 'bottomRight';
  if (angle >= 67.5 && angle < 112.5) return 'bottomDown';
  if (angle >= 112.5 && angle < 157.5) return 'bottomLeft';
  if (angle >= 157.5 || angle < -157.5) return 'leftSide';
  if (angle >= -157.5 && angle < -112.5) return 'topLeft';
  if (angle >= -112.5 && angle < -67.5) return 'topUp';
  if (angle >= -67.5 && angle < -22.5) return 'topRight';
  return 'tap';
}

// ----- Key Definition types -----
type MappingPositions = {
  topUp?: string;
  topRight?: string;
  rightSide?: string;
  bottomRight?: string;
  bottomDown?: string;
  bottomLeft?: string;
  leftSide?: string;
  topLeft?: string;
};

export interface KeyDefinition {
  bigLetter: string;
  mapping?: MappingPositions;
}

// ----- Single Key Component -----
interface CustomKeyProps {
  keyDef: KeyDefinition | string; // string for numeric mode
  isNumLock: boolean;
  onPress: (char: string) => void;
}
const CustomKey: React.FC<CustomKeyProps> = ({
  keyDef,
  isNumLock,
  onPress,
}) => {
  if (typeof keyDef === 'string') {
    return (
      <TouchableOpacity
        style={styles.keyBlock}
        onPress={() => onPress(keyDef.toUpperCase())}
      >
        <Text style={styles.bigLetter}>{keyDef.toUpperCase()}</Text>
      </TouchableOpacity>
    );
  }

  const { bigLetter, mapping } = keyDef;
  const [trailPos, setTrailPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (_evt, _gestureState) => {
        setTrailPos({ x: 35, y: 35 });
      },
      onPanResponderMove: (_evt, gestureState) => {
        setTrailPos({ x: 35 + gestureState.dx, y: 35 + gestureState.dy });
      },
      onPanResponderRelease: (_evt, gestureState) => {
        const direction = getSwipeDirection(gestureState.dx, gestureState.dy);
        let outputChar = bigLetter;
        if (
          direction !== 'tap' &&
          mapping &&
          mapping[direction as keyof MappingPositions]
        ) {
          outputChar =
            mapping[direction as keyof MappingPositions] || bigLetter;
        }
        onPress(outputChar.toUpperCase());
        setTrailPos(null);
      },
      onPanResponderTerminate: () => setTrailPos(null),
    }),
  ).current;

  return (
    <View {...panResponder.panHandlers} style={styles.keyBlock}>
      <Text style={styles.bigLetter}>{bigLetter.toUpperCase()}</Text>
      {mapping?.topUp && (
        <Text style={[styles.mappingText, styles.topUp]}>
          {mapping.topUp.toUpperCase()}
        </Text>
      )}
      {mapping?.topRight && (
        <Text style={[styles.mappingText, styles.topRight]}>
          {mapping.topRight.toUpperCase()}
        </Text>
      )}
      {mapping?.rightSide && (
        <Text style={[styles.mappingText, styles.rightSide]}>
          {mapping.rightSide.toUpperCase()}
        </Text>
      )}
      {mapping?.bottomRight && (
        <Text style={[styles.mappingText, styles.bottomRight]}>
          {mapping.bottomRight.toUpperCase()}
        </Text>
      )}
      {mapping?.bottomDown && (
        <Text style={[styles.mappingText, styles.bottomDown]}>
          {mapping.bottomDown.toUpperCase()}
        </Text>
      )}
      {mapping?.bottomLeft && (
        <Text style={[styles.mappingText, styles.bottomLeft]}>
          {mapping.bottomLeft.toUpperCase()}
        </Text>
      )}
      {mapping?.leftSide && (
        <Text style={[styles.mappingText, styles.leftSide]}>
          {mapping.leftSide.toUpperCase()}
        </Text>
      )}
      {mapping?.topLeft && (
        <Text style={[styles.mappingText, styles.topLeft]}>
          {mapping.topLeft.toUpperCase()}
        </Text>
      )}
      {trailPos && (
        <View style={[styles.trail, { left: trailPos.x, top: trailPos.y }]} />
      )}
    </View>
  );
};

// ----- Custom Backspace Button Component -----
interface BackspaceButtonProps {
  onBackspace: (deleteWord: boolean) => void;
}
const BackspaceButton: React.FC<BackspaceButtonProps> = ({ onBackspace }) => {
  // Use a PanResponder to detect horizontal drag.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_evt, gestureState) => {
        // if dragged right more than 40 px, delete word; otherwise delete single letter.
        if (gestureState.dx > 40) {
          onBackspace(true);
        } else {
          onBackspace(false);
        }
      },
    }),
  ).current;
  return (
    <View {...panResponder.panHandlers} style={styles.sideButton}>
      <Text style={styles.sideButtonText}>⌫</Text>
    </View>
  );
};

// ----- Enter Button with Emoji Trigger -----
interface EnterButtonProps {
  onEnter: () => void;
  onEmoji: () => void;
}
const EnterButton: React.FC<EnterButtonProps> = ({ onEnter, onEmoji }) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (_evt, gestureState) => {
        // If swiped top left (dx negative, dy negative, angle ~ between -157.5 and -112.5) then trigger emoji.
        const direction = getSwipeDirection(gestureState.dx, gestureState.dy);
        if (direction === 'topLeft') {
          onEmoji();
        } else {
          onEnter();
        }
      },
    }),
  ).current;
  return (
    <View {...panResponder.panHandlers} style={styles.sideButton}>
      <Text style={styles.sideButtonText}>⏎</Text>
    </View>
  );
};

// ----- Height Adjuster for the Close Button -----
// Swiping on the close button vertically adjusts the keyboard height.
interface HeightAdjusterProps {
  onHeightChange: (delta: number) => void;
  onClose: () => void;
}
const HeightAdjuster: React.FC<HeightAdjusterProps> = ({
  onHeightChange,
  onClose,
}) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_evt, gestureState) => {
        // Use dy to adjust height. Positive dy: swipe down (decrease height), negative: increase.
        onHeightChange(-gestureState.dy * 0.3); // scale factor can be adjusted.
      },
      onPanResponderRelease: (_evt, gestureState) => {
        // If minimal movement, treat as a tap to close.
        if (Math.abs(gestureState.dy) < 10) {
          onClose();
        }
      },
    }),
  ).current;

  return (
    <View {...panResponder.panHandlers} style={styles.sideButton}>
      <Text style={styles.sideButtonText}>×</Text>
    </View>
  );
};

// ----- Main CustomKeyboard Component -----
interface CustomKeyboardProps {
  onClose: () => void;
  onBackspace: (deleteWord: boolean) => void;
  onEnter: () => void;
  onEmoji: () => void;
  onKeyPress: (char: string) => void;
}
const CustomKeyboard: React.FC<CustomKeyboardProps> = ({
  onClose,
  onBackspace,
  onEnter,
  onEmoji,
  onKeyPress,
}) => {
  const [numLock, setNumLock] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(DEFAULT_KEYBOARD_HEIGHT);
  const [settings, setSettings] = useState({
    keyboardColor: '#ddd',
    keyColor: '#888',
    swipeTrailColor: 'rgba(0, 0, 255, 0.5)',
    godMode: false,
  });

  // Load settings from storage on mount.
  useEffect(() => {
    AsyncStorage.getItem('keyboardSettings').then((stored) => {
      if (stored) setSettings(JSON.parse(stored));
    });
  }, []);

  // Define keys in letter mode (all letters output uppercase).
  // Note the updated mappings:
  // • H: now right swipe → K.
  // • O: left swipe yields C, right swipe yields B.
  const letterKeys: KeyDefinition[] = [
    { bigLetter: 'A', mapping: { bottomRight: 'V' } },
    { bigLetter: 'N', mapping: { bottomDown: 'L' } },
    { bigLetter: 'I', mapping: { bottomLeft: 'X' } },
    { bigLetter: 'H', mapping: { rightSide: 'K' } }, // changed to rightSide
    {
      bigLetter: 'O',
      mapping: {
        topUp: 'U',
        bottomDown: 'D',
        leftSide: 'C', // swapped: left now gives C
        rightSide: 'B', // right now gives B
        topRight: 'P',
        topLeft: 'Q',
        bottomLeft: 'G',
        bottomRight: 'J',
      },
    },
    { bigLetter: 'R', mapping: { leftSide: 'M' } }, // unchanged from previous
    { bigLetter: 'T', mapping: { topRight: 'Y' } },
    { bigLetter: 'E', mapping: { topUp: 'W', rightSide: 'Z' } },
    { bigLetter: 'S', mapping: { topLeft: 'F' } },
  ];

  const numericKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  // Render left side (3×3 grid and space bar)
  const renderLeftSide = () => {
    const rows = [];
    for (let row = 0; row < 3; row++) {
      const keysRow = numLock
        ? numericKeys.slice(row * 3, row * 3 + 3)
        : letterKeys.slice(row * 3, row * 3 + 3);
      rows.push(
        <View key={`row-${row}`} style={styles.row}>
          {keysRow.map((k, index) => (
            <CustomKey
              key={index}
              keyDef={k}
              isNumLock={numLock}
              onPress={onKeyPress}
            />
          ))}
        </View>,
      );
    }
    // Space Bar: If numLock is on, split the bar into two halves.
    const renderSpaceBarContent = () => {
      if (numLock) {
        return (
          <View style={styles.spaceContent}>
            <TouchableOpacity
              style={styles.spaceHalf}
              onPress={() => onKeyPress('0')}
            >
              <Text style={styles.spaceText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.spaceHalf}
              onPress={() => onKeyPress(' ')}
            >
              <Text style={styles.spaceText}>SPACE</Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        return <Text style={styles.spaceText}>SPACE</Text>;
      }
    };
    return (
      <View style={styles.leftContainer}>
        {rows}
        <View style={styles.spaceRow}>
          <TouchableOpacity
            style={styles.spaceBar}
            onPress={() => {
              if (!numLock) onKeyPress(' ');
            }}
          >
            {renderSpaceBarContent()}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render right side buttons.
  const renderRightSide = () => {
    return (
      <View style={styles.rightContainer}>
        {/* Height Adjuster / Close Button */}
        <HeightAdjuster
          onHeightChange={(delta) =>
            setKeyboardHeight((prev) => Math.max(200, prev + delta))
          }
          onClose={onClose}
        />
        {/* NumLock Toggle */}
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => setNumLock(!numLock)}
        >
          <Text style={styles.sideButtonText}>{numLock ? 'ABC' : '#123'}</Text>
        </TouchableOpacity>
        {/* Backspace Button */}
        <BackspaceButton
          onBackspace={(deleteWord) => onBackspace(deleteWord)}
        />
        {/* Enter Button with Emoji Swipe */}
        <EnterButton onEnter={onEnter} onEmoji={() => onEmoji()} />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.keyboardWrapper,
        { height: keyboardHeight, backgroundColor: settings.keyboardColor },
      ]}
    >
      {settings.godMode ? (
        // In God Mode, make keys transparent.
        <View style={{ flex: 1, backgroundColor: 'transparent' }} />
      ) : (
        <>
          {renderLeftSide()}
          {renderRightSide()}
        </>
      )}
    </View>
  );
};

export default CustomKeyboard;

// ----- STYLES -----
const styles = StyleSheet.create({
  keyboardWrapper: {
    flexDirection: 'row',
    width: '100%',
  },
  leftContainer: {
    flex: 4,
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  keyBlock: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bigLetter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  mappingText: {
    position: 'absolute',
    fontSize: 10,
    color: '#333',
  },
  topUp: { top: 2, left: '50%', transform: [{ translateX: -7 }] },
  topRight: { top: 2, right: 2 },
  rightSide: { right: 2, top: '50%', transform: [{ translateY: -7 }] },
  bottomRight: { bottom: 2, right: 2 },
  bottomDown: { bottom: 2, left: '50%', transform: [{ translateX: -7 }] },
  bottomLeft: { bottom: 2, left: 2 },
  leftSide: { left: 2, top: '50%', transform: [{ translateY: -7 }] },
  topLeft: { top: 2, left: 2 },
  trail: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
  spaceRow: { flexDirection: 'row', flex: 1 },
  spaceBar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceContent: { flexDirection: 'row', width: '100%' },
  spaceHalf: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  spaceText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  rightContainer: { flex: 1, flexDirection: 'column' },
  sideButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});
