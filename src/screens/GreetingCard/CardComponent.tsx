import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


type CardComponentProps = {
    name: string;
    message: string;
};

const { width } = Dimensions.get('window');

const CardComponent: React.FC<CardComponentProps> = ({ name, message }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FFDEE9', '#B5FFFC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
            >
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.message}>{message}</Text>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: width * 0.85,
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
        alignItems: 'center',
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    message: {
        fontSize: 18,
        color: '#555',
        textAlign: 'center',
    },
});

export default CardComponent;