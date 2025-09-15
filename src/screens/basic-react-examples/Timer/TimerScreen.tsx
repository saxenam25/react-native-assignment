import React, {useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const TimerScreen: React.FC = () => {
    const [seconds, setSeconds] = useState(0);

    useFocusEffect(
        React.useCallback(() => {
            setSeconds(0); // Reset timer when screen is focused
            const interval = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Timer: {seconds} seconds</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default TimerScreen;