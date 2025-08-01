import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import PressableButton from '../../ui-components/PressableButton';

function CounterScreen() {
    const [count, setCount] = React.useState(0);
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count > 0 ? count - 1 : 0);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Enter a number"
                keyboardType="numeric"
                value={String(count)}
                style={styles.input}
                readOnly
            />
            <View style={styles.buttonRow}>
                <PressableButton
                    onPress={increment}
                    style={styles.button}
                >+</PressableButton>
                <PressableButton
                    onPress={decrement}
                    style={styles.button}
                >-</PressableButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        fontSize: 50,
        borderRadius: 5,
        fontWeight: 'bold',
        borderColor: '#ff8040',
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '40%',
    },
    button: {
        marginTop: 20,
        fontSize: 30,
    },
});

export default CounterScreen;