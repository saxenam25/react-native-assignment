import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PressableButton from '../../../ui-components/PressableButton';
const InputHandlingScreen: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSubmit = () => {
        setFullName(`${firstName} ${lastName}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Input Handling Form</Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                keyboardType="default"
                autoFocus={true}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                keyboardType="default"
            />
            <PressableButton onPress={handleSubmit} style={styles.button}>
                Submit
            </PressableButton>
            {fullName ? <Text style={styles.result}>Full Name: {fullName}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 4,
        padding: 12,
        alignItems: 'center',
    },
    result: {
        marginTop: 20,
        fontSize: 20,
    },
});

export default InputHandlingScreen;
