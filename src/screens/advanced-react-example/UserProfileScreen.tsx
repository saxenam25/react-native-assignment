import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
    Image,
    TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AuthenticationService from '../../core/services/authentication.service';
import { LoginResponse } from '../../shared/types/login.interface';

type RootStackParamList = {
    Login: undefined;
    Drawer: undefined;
};

type UserProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const UserProfileScreen: React.FC = () => {
    const [userData, setUserData] = useState<LoginResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<UserProfileScreenNavigationProp>();

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const data = await AuthenticationService.getUserData();
            if (data) {
                setUserData(data);
            } else {
                // If no user data found, logout and redirect to login
                await AuthenticationService.logout();
                navigation.replace('Login');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            Alert.alert('Error', 'Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AuthenticationService.logout();
                            // Navigate back to Login screen after logout
                            navigation.replace('Login');
                        } catch (error) {
                            console.error('Logout error:', error);
                            Alert.alert('Error', 'An error occurred during logout.');
                        }
                    },
                },
            ]
        );
    };

    const renderUserInfo = (label: string, value: string | undefined) => (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}:</Text>
            <Text style={styles.infoValue}>{value || 'N/A'}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No user data available</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadUserData}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Image */}
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: userData.image || 'https://via.placeholder.com/150' }}
                        style={styles.profileImage}
                        defaultSource={{ uri: 'https://via.placeholder.com/150' }}
                    />
                </View>

                {/* User Information */}
                <View style={styles.infoContainer}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>

                    {renderUserInfo('First Name', userData.firstName)}
                    {renderUserInfo('Last Name', userData.lastName)}
                    {renderUserInfo('Username', userData.username)}
                    {renderUserInfo('Email', userData.email)}
                    {renderUserInfo('Gender', userData.gender)}
                </View>


            </ScrollView>

            {/* Fixed Bottom Logout Button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutLink}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 16,
        paddingTop: 50, // Account for status bar
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#e0e0e0',
        borderWidth: 3,
        borderColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        flex: 2,
        textAlign: 'right',
    },
    bottomContainer: {
        backgroundColor: '#ffffff',
        paddingVertical: 20,
        paddingHorizontal: 16,
        paddingBottom: 40, // Extra padding for safe area
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
    },
    logoutLink: {
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default UserProfileScreen;