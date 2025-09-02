import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PressableButton from '../../../ui-components/PressableButton';
import AuthenticationService from '../../../core/services/authentication.service';

type RootStackParamList = {
    Login: undefined;
    Drawer: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
    onLoginSuccess?: () => void;
}

//type LoginScreenProp = StackNavigationProp<RootStackParamList, 'LoginScreen'>;
const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('emilys');
    const [password, setPassword] = useState('emilyspass');
    const [loading, setLoading] = useState(false);
    const [isCheckingToken, setIsCheckingToken] = useState(true);
   const navigation = useNavigation<LoginScreenNavigationProp>();

    // Check for existing token on component mount
    useEffect(() => {
        checkExistingToken();
    }, []);

    const checkExistingToken = async () => {
        try {
            const authResult = await AuthenticationService.checkExistingAuthentication();
            console.log("🚀 ~ authResult:", authResult)

            if (authResult.isAuthenticated && authResult.shouldShowAlert) {
                AuthenticationService.showAutoLoginAlert(
                    () => {
                        // Navigate to Drawer on auto-login
                        navigation.replace('Drawer');
                    },
                    authResult.userData
                );
            }
        } catch (error) {
            console.error('Error checking token:', error);
        } finally {
            setIsCheckingToken(false);
        }
    };

    const handleLogin = async () => {
        if (!username || !password) {
            Alert.alert('Error', 'Please enter both username and password');
            return;
        }

        setLoading(true);
        try {
            const loginResult = await AuthenticationService.login({
                username,
                password,
                expiresInMins: 30
            });

            if (loginResult.accessToken) {
                Alert.alert('Success', 'Login successful!');
                // Navigate to Drawer after successful login using replace
                navigation.replace('Drawer');
            } else {
                Alert.alert('Login Failed', loginResult.error || 'Invalid credentials');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Show loading screen while checking for existing token
    if (isCheckingToken) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Checking authentication...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="email-address" // Use email keyboard for username field
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry // Hide password input
            />
            <PressableButton
                onPress={handleLogin}
                style={styles.button}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
            </PressableButton>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 40,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    button: {
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
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
});

export default LoginScreen;
