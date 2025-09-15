import React from 'react';
import { View, Text, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import useFetch from '../../../shared/hooks/useFetch';

const USERS_API_URL = 'https://jsonplaceholder.typicode.com/users';

type Address = {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
};

type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: Address;
};

const UserScreen: React.FC = () => {
    const { data, loading, error } = useFetch<User[]>(USERS_API_URL);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    const renderItem: ListRenderItem<User> = ({ item }) => {
        const address = `${item.address.suite}, ${item.address.street}, ${item.address.city}, ${item.address.zipcode}`;
        return (
            <View style={styles.userContainer}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userPhone}>Phone: {item.phone}</Text>
                <Text style={styles.userAddress}>Address: {address}</Text>
            </View>
        );
    };

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
            style={{ flex: 1 }}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    userContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    userPhone: {
        fontSize: 14,
        color: '#5dade2', // light blue
    },
    userAddress: {
        fontSize: 14,
        color: '#444',
    },
});

export default UserScreen;