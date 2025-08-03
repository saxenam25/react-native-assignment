import React, { useState, useCallback } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import UseMemoChildComponent from './UseMemoChildComponent';

const UseMemoScreen = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('Hello, World!');

  const incrementCount = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, [])

  return (
    <View style={styles.container}>
      <Text>Count: {count}</Text>
      <UseMemoChildComponent text={text} />
      <Button title="Increment Count" onPress={incrementCount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default UseMemoScreen;