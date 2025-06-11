// src/components/common/Loader.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Image } from 'react-native';

/**
 * Full-screen loader that shows the Cognitive-Crown emblem
 * gently pulsing in size + opacity (≈2 s per loop) on a
 * solid black background.
 *
 *  •  Logo:  ./assets/crown_puzzle.png  (≈ 500 × 500 px, transparent PNG,
 *    coloured #D9C28A to match the mock-ups)
 *
 * If you prefer an SVG, swap the <Animated.Image> for your
 * vector component and pass “style={animatedStyle}”.
 */
export default function Loader() {
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  /* infinite, gentle “breathing” animation */
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.1,
            duration: 1000,
            easing:   Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            easing:   Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, [scale, opacity]);

  const animatedStyle = {
    transform: [{ scale }],
    opacity,
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/crown_puzzle.png')}
        style={[styles.logo, animatedStyle]}
        resizeMode="contain"
      />
    </View>
  );
}

/* ——————————————————————————— styles —————————————————————————— */
const styles = StyleSheet.create({
  container: {
    flex:           1,
    backgroundColor: '#000',         // pure black, same as app bg
    justifyContent: 'center',
    alignItems:     'center',
  },
  logo: {
    width:  200,                     // tweak if necessary
    height: 200,
  },
});
