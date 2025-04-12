import React, { useState, useRef } from 'react';
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

// Use roughly 45% of the screen height for the keyboard.
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const KEYBOARD_HEIGHT = SCREEN_HEIGHT * 0.45;

// Adjust swipe sensitivity as needed.
const SWIPE_THRESHOLD = 30;

// ------------------------
// Helper: Detect swipe direction based on dx/dy
// We use specific names that match our key mappings.
function getSwipeDirection(dx: number, dy: number): string {
  // If the movement is very small, we treat it as a tap.
  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD)
    return 'tap';

  // For our purposes, we define:
  // - topUp: strong upward movement (dy negative)
  // - topRight: movement up and to the right
  // - rightSide: primarily rightward (for O key, right swipe: yields "C")
  // - bottomRight: down and right
  // - bottomDown: strong downward
  // - bottomLeft: down and left
  // - leftSide: primarily leftward swipe
  // - topLeft: up and left

  if (dx > 0 && dy < -SWIPE_THRESHOLD) {
    // Up & Right: decide between topRight vs. rightSide.
    return Math.abs(dx) > Math.abs(dy) ? 'topRight' : 'topUp';
  }
  if (dx < 0 && dy < -SWIPE_THRESHOLD) {
    return Math.abs(dx) > Math.abs(dy) ? 'topLeft' : 'topUp';
  }
  if (dx > 0 && dy > SWIPE_THRESHOLD) {
    // Down & Right: decide between bottomRight vs. bottomDown.
    return Math.abs(dx) > Math.abs(dy) ? 'bottomRight' : 'bottomDown';
  }
  if (dx < 0 && dy > SWIPE_THRESHOLD) {
    // Down & Left: decide between bottomLeft vs. bottomDown.
    return Math.abs(dx) > Math.abs(dy) ? 'bottomLeft' : 'bottomDown';
  }
  if (Math.abs(dx) >= SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
    // Horizontal swipe
    return dx > 0 ? 'rightSide' : 'leftSide';
  }
  if (Math.abs(dy) >= SWIPE_THRESHOLD && Math.abs(dx) < SWIPE_THRESHOLD) {
    // Vertical swipe
    return dy > 0 ? 'bottomDown' : 'topUp';
  }
  return 'tap';
}

// ------------------------
// Single Key Component
// It displays the main (big) letter in the center and mapping keys positioned along the edges/corners.
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
interface CustomKeyProps {
  keyDef: KeyDefinition | string; // In numLock mode, keyDef can simply be a string (digit).
  isNumLock: boolean;
  onPress: (char: string) => void;
}
const CustomKey: React.FC<CustomKeyProps> = ({
  keyDef,
  isNumLock,
  onPress,
}) => {
  // For numlock mode, keyDef is a string.
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
  // Local state for displaying a "trail" (a small circle that follows the gesture).
  const [trailPos, setTrailPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (
        _evt: GestureResponderEvent,
        _gestureState: PanResponderGestureState,
      ) => {
        setTrailPos({ x: 35, y: 35 }); // Start near the center (you may wish to adjust these coordinates)
      },
      onPanResponderMove: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        // Update trail to follow the finger relative to key block dimensions.
        setTrailPos({ x: 35 + gestureState.dx, y: 35 + gestureState.dy });
      },
      onPanResponderRelease: (
        _evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const { dx, dy } = gestureState;
        const direction = getSwipeDirection(dx, dy);

        // Determine output character. Always output upper case.
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

        // Clear the trail.
        setTrailPos(null);
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderTerminate: () => {
        setTrailPos(null);
      },
    }),
  ).current;

  return (
    <View {...panResponder.panHandlers} style={styles.keyBlock}>
      {/* Main Big Letter (centered) */}
      <Text style={styles.bigLetter}>{bigLetter.toUpperCase()}</Text>

      {/* Mapping keys positioned in their respective areas.
          We render each if defined in the mapping. */}
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

      {/* Trail indicator */}
      {trailPos && (
        <View style={[styles.trail, { left: trailPos.x, top: trailPos.y }]} />
      )}
    </View>
  );
};

// ------------------------
// Main Custom Keyboard Component
interface CustomKeyboardProps {
  onClose: () => void;
  onBackspace: () => void;
  onEnter: () => void;
  onKeyPress: (char: string) => void;
}
const CustomKeyboard: React.FC<CustomKeyboardProps> = ({
  onClose,
  onBackspace,
  onEnter,
  onKeyPress,
}) => {
  const [numLock, setNumLock] = useState(false);

  // Define your 9 keys in letter mode.
  // Note: For the R key, we change leftSide swipe mapping to "M".
  const letterKeys: KeyDefinition[] = [
    {
      bigLetter: 'A',
      mapping: { bottomRight: 'V' }, // A swiping bottom-right yields V.
    },
    {
      bigLetter: 'N',
      mapping: { bottomDown: 'L' }, // N swiping bottom-down yields L.
    },
    {
      bigLetter: 'I',
      mapping: { bottomLeft: 'X' }, // I swiping bottom-left yields X.
    },
    {
      bigLetter: 'H',
      mapping: { leftSide: 'K' }, // H swiping left yields K.
    },
    {
      bigLetter: 'O',
      mapping: {
        topUp: 'U', // O swiping top-up yields U.
        bottomDown: 'D', // O swiping bottom-down yields D.
        leftSide: 'B', // O swiping left yields B.
        rightSide: 'C', // O swiping right yields C.
        topRight: 'P', // O swiping top-right yields P.
        topLeft: 'Q', // O swiping top-left yields Q.
        bottomLeft: 'G', // O swiping bottom-left yields G.
        bottomRight: 'J', // O swiping bottom-right yields J.
      },
    },
    {
      bigLetter: 'R',
      // Now with left swipe returning M.
      mapping: { leftSide: 'M' },
    },
    {
      bigLetter: 'T',
      mapping: { topRight: 'Y' }, // T swiping top-right yields Y.
    },
    {
      bigLetter: 'E',
      mapping: {
        topUp: 'W', // E swiping top-up yields W.
        rightSide: 'Z', // E swiping right yields Z.
      },
    },
    {
      bigLetter: 'S',
      mapping: { topLeft: 'F' }, // S swiping top-left yields F.
    },
  ];

  // Numeric mode: display digits 1-9.
  const numericKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  // Render the left side (3×3 keys + space bar).
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
              onPress={(char) => onKeyPress(char)}
            />
          ))}
        </View>,
      );
    }

    // Space bar row: In letter mode display "SPACE", in num lock mode, display half "0" and half "SPACE"
    return (
      <View style={styles.leftContainer}>
        {rows}
        <View style={styles.spaceRow}>
          <TouchableOpacity
            style={[styles.spaceBar]}
            onPress={() => onKeyPress(numLock ? '0' : ' ')}
          >
            {numLock ? (
              // Display a two-part label: half "0" and half "SPACE"
              <View style={styles.spaceContent}>
                <Text style={styles.spaceText}>0</Text>
                <Text style={styles.spaceText}>SPACE</Text>
              </View>
            ) : (
              <Text style={styles.spaceText}>SPACE</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Render the right side buttons.
  const renderRightSide = () => {
    return (
      <View style={styles.rightContainer}>
        {/* Keyboard Close */}
        <TouchableOpacity style={styles.sideButton} onPress={onClose}>
          <Text style={styles.sideButtonText}>×</Text>
        </TouchableOpacity>

        {/* NumLock Toggle: show ABC when active, and #123 when not */}
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => setNumLock(!numLock)}
        >
          <Text style={styles.sideButtonText}>{numLock ? 'ABC' : '#123'}</Text>
        </TouchableOpacity>

        {/* Backspace */}
        <TouchableOpacity style={styles.sideButton} onPress={onBackspace}>
          <Text style={styles.sideButtonText}>⌫</Text>
        </TouchableOpacity>

        {/* Enter */}
        <TouchableOpacity style={styles.sideButton} onPress={onEnter}>
          <Text style={styles.sideButtonText}>⏎</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.keyboardWrapper, { height: KEYBOARD_HEIGHT }]}>
      {renderLeftSide()}
      {renderRightSide()}
    </View>
  );
};

export default CustomKeyboard;

// ------------------------
// STYLES
const styles = StyleSheet.create({
  keyboardWrapper: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#ddd',
    // Ensure the keyboard is pinned to the bottom in your main screen layout.
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
    color: '#000',
  },
  // Mapping hint texts positioned in the key block.
  mappingText: {
    position: 'absolute',
    fontSize: 10,
    color: '#333',
  },
  topUp: {
    top: 2,
    left: '50%',
    transform: [{ translateX: -7 }],
  },
  topRight: {
    top: 2,
    right: 2,
  },
  rightSide: {
    right: 2,
    top: '50%',
    transform: [{ translateY: -7 }],
  },
  bottomRight: {
    bottom: 2,
    right: 2,
  },
  bottomDown: {
    bottom: 2,
    left: '50%',
    transform: [{ translateX: -7 }],
  },
  bottomLeft: {
    bottom: 2,
    left: 2,
  },
  leftSide: {
    left: 2,
    top: '50%',
    transform: [{ translateY: -7 }],
  },
  topLeft: {
    top: 2,
    left: 2,
  },
  // Trail indicator: a small circle that follows the finger.
  trail: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 255, 0.5)',
  },
  // Space bar row styling.
  spaceRow: {
    flexDirection: 'row',
    flex: 1,
  },
  spaceBar: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 5,
  },
  spaceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  // Right side (vertical) buttons.
  rightContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  sideButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#888',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
