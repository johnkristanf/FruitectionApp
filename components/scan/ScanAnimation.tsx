import { Animated, Easing } from "react-native";
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

export function ScanAnimation() {
    const animatedValue = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      const animation = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      animation.start();
  
      return () => animation.stop();
    }, []);
  
    const translateYInterpolate = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-290, 180], 
    });
  
    return (
      <View style={styles.container}>


        <View style={styles.scanLine} />

        <Animated.View
          style={[
            styles.scanner,
            { transform: [{ translateY: translateYInterpolate }] },
          ]}
        />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  scanLine: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    height: 2,
  },

  scanner: {
    width: '100%',
    height: 8,
    backgroundColor: 'gray',
  
  },

  
});
