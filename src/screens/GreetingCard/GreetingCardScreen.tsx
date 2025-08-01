import React from 'react';
import { View, StyleSheet } from 'react-native';
import CardComponent from './CardComponent';

const GreetingCardScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <CardComponent name="Alice" message="Happy Birthday, Alice!" />
            <CardComponent name="Bob" message="Congratulations, Bob!" />
            <CardComponent name="Charlie" message="Best wishes, Charlie!" />
        </View>
    );
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    
});

export default GreetingCardScreen;