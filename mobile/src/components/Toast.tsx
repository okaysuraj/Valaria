import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <View style={styles.toastContainer} pointerEvents="none">
      <View style={styles.toastPill}>
        <View style={styles.dot} />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </View>
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
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
