# 🌳 Eternal tree - Fractal Tree Mobile App

Interactive fractal tree visualization with real-time debug controls.

## Features

- **Recursive Fractal Tree Generation** - Beautiful organic tree rendering using SVG
- **Interactive Debug Sliders** - Adjust tree parameters in real-time:
  - 🎯 **Branch Angle** (10-45°) - Control how wide the tree spreads
  - 🔍 **Recursion Depth** (1-10) - Adjust tree detail and complexity
  - 📏 **Base Length** (40-150px) - Change the trunk size
- **Dynamic Coloring** - Gradient from green (leaves) to brown (trunk)
- **Dark Premium UI** - Modern, elegant interface

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Run on your device:**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator
   - Or press `w` for web

## Project Structure

```
MobileChill/
├── App.tsx              # Main application with FractalTree component
├── package.json         # Dependencies and scripts
├── app.json            # Expo configuration
├── tsconfig.json       # TypeScript configuration
├── babel.config.js     # Babel configuration
└── assets/             # App icons and splash screen
```

## Technologies

- **React Native** - Cross-platform mobile framework
- **Expo** - Development and build toolchain
- **TypeScript** - Type-safe JavaScript
- **react-native-svg** - SVG rendering for fractal tree
- **@react-native-community/slider** - Interactive sliders

## How It Works

The app uses a recursive algorithm to generate the fractal tree:

1. Each branch spawns two child branches at the specified angle
2. Child branches are 67% the length of their parent
3. Recursion continues until max depth is reached
4. Color and thickness change based on branch depth

Adjust the sliders to see instant visual changes!

## Development

Built with ❤️ using React Native and Expo.
