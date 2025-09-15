import React, { useState, useCallback, FC } from 'react';
import { View, Button, StyleSheet, Text, ViewStyle } from 'react-native';
import UseMemoChildComponent from './UseMemoChildComponent';

const UseMemoScreen: FC = () => {
    const [count, setCount] = useState<number>(0);
    const [text, setText] = useState<string>('Hello, World!');

    const incrementCount = useCallback((): void => {
        setCount((prevCount) => prevCount + 1);
    }, []);

    return (
        <View style={styles.container}>
            <Text>Count: {count}</Text>
            <UseMemoChildComponent text={text} />
            <Button title="Increment Count" onPress={incrementCount} />
        </View>
    );
};

const styles = StyleSheet.create<{ container: ViewStyle }>({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default UseMemoScreen;