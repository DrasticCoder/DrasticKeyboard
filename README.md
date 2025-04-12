

# 🧠 DrasticKeyboard

**DrasticKeyboard** is a custom, gesture-based virtual keyboard built for mobile devices, heavily inspired by the [ANIHORTES keyboard](https://www.exideas.com/ME/). It is designed from the ground up to maximize typing speed and accuracy using just one or two fingers — perfectly suited for touch screens.

---

## 📖 Research-Backed Design

This project is based on insights from the paper:

> **"ICMI: An Efficient, Non-QWERTY, Stylus-Based Text Input Method"**  
> *International Conference on Multimodal Interfaces (ICMI), 2003*  
> [Read the full paper](https://www.exideas.com/ME/ICMI2003Paper.pdf)

I followed the same design principles used in MessagEase:

- **Fitts’ Law**: To minimize finger travel and improve speed.
- **Letter frequency tables**: High-frequency letters are placed in central, easy-to-reach positions.
- **Digraph frequency**: Common two-letter combinations are optimized for fluid, fast input.

---

## 🎯 Key Features

- 🧭 **9-Key Layout** based on high-frequency letters: `ANIHORTES`
- 🎯 **Gesture-Based Input**: Swipe in different directions to enter alternate letters
- 📐 **Larger, Fewer Keys**: 3.5x bigger than standard QWERTY keys for better accuracy
- 🧠 **Minimal Learning Curve**: Small investment of time leads to a massive boost in typing comfort
- 🎮 **Gamified Learning** (planned): Just like MessagEase Game, a fun way to train your muscle memory
- ⚙️ **Custom Settings Page**: Theme, swipe trail, god mode, key colors, etc.
- 🔥 **God Mode**: Transparent keyboard for muscle-memory users
- 📏 **Resizable Keyboard**: Swipe to increase/decrease keyboard height
- 🗣️ **Speech-to-Text** & 😎 **Emojis** support (in progress)
- 🧠 **Smart Backspace**: Swipe to delete words, not just letters

---

## 📲 Built With

- **React Native + Expo** (for cross-platform UI development)
- **Custom Gesture Engine** (for accurate and forgiving swipe detection)
- **Context + Hooks** for clean state management

---

## 🛠️ Roadmap

- [x] Core swipe keyboard layout
- [x] NumLock + multi-state keys
- [x] Word-wise backspace with drag
- [x] Transparent mode (God Mode)
- [ ] System keyboard integration (React Native ejection required)
- [ ] Game to train users
- [ ] Emoji panel & clipboard manager
- [ ] Multi-language support

---

## 💬 Want to Contribute?

If you’re into keyboards, gesture input, UI/UX for accessibility, or are a fan of HCI research—jump in! Let’s make text input better, faster, and more fun.



## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

