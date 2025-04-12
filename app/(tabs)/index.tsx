// app/(tabs)/index.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import CustomKeyboard from '../../components/CustomKeyboard';

export default function HomeScreen() {
  const [inputText, setInputText] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const handleClose = () => {
    setKeyboardVisible(false);
    Keyboard.dismiss();
  };

  const handleBackspace = () => {
    setInputText((prev) => prev.slice(0, -1));
  };

  const handleEnter = () => {
    setInputText((prev) => prev + '\n');
  };

  const handleKeyPress = (char: string) => {
    setInputText((prev) => prev + char);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Tap to type..."
          value={inputText}
          onFocus={() => setKeyboardVisible(true)}
          showSoftInputOnFocus={false}
        />
        <Text style={styles.inputDisplay}>{inputText}</Text>
        {keyboardVisible && (
          <CustomKeyboard
            onClose={handleClose}
            onBackspace={handleBackspace}
            onEnter={handleEnter}
            onKeyPress={handleKeyPress}
            onEmoji={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Ensure the keyboard appears at the bottom
    backgroundColor: '#FFF',
  },
  input: {
    height: 50,
    marginHorizontal: 20,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  inputDisplay: {
    fontSize: 16,
    margin: 10,
  },
});
