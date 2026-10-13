import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Text, StatusBar } from 'react-native';
import SplashScreen from './components/SplashScreen'; // Adjust path as needed

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    // Hide splash screen after 3 seconds
    const timer = setTimeout(() => {
      // Fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }, 3000); // 3000ms = 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <Animated.View style={[styles.splashWrapper, { opacity: fadeAnim }]}>
        <SplashScreen />
      </Animated.View>
    );
  }

  // Replace this View with your actual Main App / Navigation container
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar barStyle="light-content" backgroundColor="#132B5E" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashWrapper: {
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#666',
  }
});
