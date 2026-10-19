/** Show transient status feedback and announce it to assistive technology. */
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, View, Text, StyleSheet } from 'react-native';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(true);
  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduceMotion(value);
      })
      .catch(() => {
        if (active) setReduceMotion(true);
      });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    const animation = Animated.timing(opacity, {
      toValue: message ? 1 : 0,
      duration: reduceMotion ? 0 : 160,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [message, opacity, reduceMotion]);
  if (!message) return null;

  return (
    <Animated.View style={[styles.toastContainer, { opacity }]} pointerEvents="none">
      <View style={styles.toastPill} accessibilityLiveRegion="polite" accessibilityRole="alert">
        <View style={styles.dot} />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 999,
  },
  toastPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#181822',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#E5A93C',
  },
  toastText: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
