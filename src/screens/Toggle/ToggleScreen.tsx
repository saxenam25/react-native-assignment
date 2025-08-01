//create function component for ToggleScreen
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PressableButton from '../../ui-components/PressableButton';
const ToggleScreen: React.FC = () => {
    const [isToggled, setIsToggled] = React.useState(false);
    return (
        <View style={styles.container}>
            {isToggled ? (
                <View>
                    <Text style={styles.titleHeading}>Details are shown</Text>
                    <Text style={styles.title}>Name: Mohit</Text>
                    <Text style={styles.title}>Training: React native</Text>
                    <Text style={styles.title}>Location: India</Text>
                    <Text style={styles.title}>Occupation: Software Engineer</Text>
                </View>
            ) : (
                <Text style={styles.title}>Oops! no details.</Text>
            )}

            <PressableButton
                onPress={() => setIsToggled(!isToggled)}
                style={styles.button}
            >
                {isToggled ? 'Hide Details' : 'Show Details'}
            </PressableButton>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 20,
        marginBottom: 16,
    },
    titleHeading: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
    },
    button: {
        marginTop: 16,
    },
});

export default ToggleScreen;