import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsPage: React.FC = () => {
  const [keyboardColor, setKeyboardColor] = useState('#ddd');
  const [keyColor, setKeyColor] = useState('#888');
  const [swipeTrailColor, setSwipeTrailColor] = useState('rgba(0,0,255,0.5)');
  const [godMode, setGodMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('keyboardSettings').then((stored) => {
      if (stored) {
        const s = JSON.parse(stored);
        setKeyboardColor(s.keyboardColor || '#ddd');
        setKeyColor(s.keyColor || '#888');
        setSwipeTrailColor(s.swipeTrailColor || 'rgba(0,0,255,0.5)');
        setGodMode(s.godMode || false);
      }
    });
  }, []);

  const saveSettings = () => {
    const settings = { keyboardColor, keyColor, swipeTrailColor, godMode };
    AsyncStorage.setItem('keyboardSettings', JSON.stringify(settings));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Keyboard Settings</Text>
      <View style={styles.settingItem}>
        <Text>Keyboard Color:</Text>
        <TextInput
          style={styles.input}
          value={keyboardColor}
          onChangeText={setKeyboardColor}
        />
      </View>
      <View style={styles.settingItem}>
        <Text>Key Border Color:</Text>
        <TextInput
          style={styles.input}
          value={keyColor}
          onChangeText={setKeyColor}
        />
      </View>
      <View style={styles.settingItem}>
        <Text>Swipe Trail Color:</Text>
        <TextInput
          style={styles.input}
          value={swipeTrailColor}
          onChangeText={setSwipeTrailColor}
        />
      </View>
      <View style={styles.settingItem}>
        <Text>God Mode:</Text>
        <Switch value={godMode} onValueChange={setGodMode} />
      </View>
      <Button title="Save Settings" onPress={saveSettings} />
    </ScrollView>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'stretch', backgroundColor: '#fff' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: 100,
    padding: 5,
    textAlign: 'center',
  },
});
