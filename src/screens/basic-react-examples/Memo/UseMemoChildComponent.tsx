import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UseMemoChildComponent = ({ text }) => {
    console.log('UseMemoChildComponent rendered');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default React.memo(UseMemoChildComponent);
