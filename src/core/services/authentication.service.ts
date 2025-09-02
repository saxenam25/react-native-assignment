import EncryptedStorage from 'react-native-encrypted-storage';
import { Alert } from 'react-native';
import { LoginCredentials, LoginResponse } from '../../shared/types/login.interface';

export class AuthenticationService {
    private static readonly TOKEN_KEY = 'user_token';
    private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private static readonly USER_DATA_KEY = 'user_data';

    /**
     * Check if user has a valid authentication token
     * @returns Promise<boolean> - true if token exists, false otherwise
     */
    static async hasValidToken(): Promise<boolean> {
        try {
            const token = await EncryptedStorage.getItem(this.TOKEN_KEY);
            return !!token;
        } catch (error) {
            console.error('Error checking token:', error);
            return false;
        }
    }

    /**
     * Get stored authentication token
     * @returns Promise<string | null> - the stored token or null if not found
     */
    static async getToken(): Promise<string | null> {
        try {
            return await EncryptedStorage.getItem(this.TOKEN_KEY);
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    }

    /**
     * Store authentication token securely
     * @param token - the authentication token to store
     * @returns Promise<boolean> - true if successful, false otherwise
     */
    static async storeToken(token: string): Promise<boolean> {
        try {
            await EncryptedStorage.setItem(this.TOKEN_KEY, token);
            return true;
        } catch (error) {
            console.error('Error storing token:', error);
            return false;
        }
    }

    /**
     * Store refresh token securely
     * @param refreshToken - the refresh token to store
     * @returns Promise<boolean> - true if successful, false otherwise
     */
    static async storeRefreshToken(refreshToken: string): Promise<boolean> {
        try {
            await EncryptedStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
            return true;
        } catch (error) {
            console.error('Error storing refresh token:', error);
            return false;
        }
    }

    /**
     * Store user data securely
     * @param userData - the user data to store
     * @returns Promise<boolean> - true if successful, false otherwise
     */
    static async storeUserData(userData: any): Promise<boolean> {
        try {
            await EncryptedStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Error storing user data:', error);
            return false;
        }
    }

    /**
     * Get stored user data
     * @returns Promise<any | null> - the stored user data or null if not found
     */
    static async getUserData(): Promise<any | null> {
        try {
            const userData = await EncryptedStorage.getItem(this.USER_DATA_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error retrieving user data:', error);
            return null;
        }
    }

    /**
     * Perform login with provided credentials
     * @param credentials - login credentials (username, password, expiresInMins)
     * @returns Promise<LoginResponse> - login response with token and user data
     */
    static async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password,
                    expiresInMins: credentials.expiresInMins || 30
                }),
                credentials: 'include',
            });

            const data: LoginResponse = await response.json();
            console.log("🚀 ~ Authentication response:", data);

            if (response.ok && data.accessToken) {
                // Store authentication data
                await this.storeToken(data.accessToken);

                if (data.refreshToken) {
                    await this.storeRefreshToken(data.refreshToken);
                }

                if (data) {
                    await this.storeUserData(data);
                }

                return data;
            } else {
                return {
                    accessToken: '',
                    error: data.error || 'Invalid credentials'
                } as LoginResponse;
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                accessToken: '',
                error: 'Something went wrong. Please try again later.'
            } as LoginResponse;
        }
    }

    /**
     * Check for existing authentication and perform auto-login if valid
     * @returns Promise<{ isAuthenticated: boolean, shouldShowAlert: boolean, userData?: any }>
     */
    static async checkExistingAuthentication(): Promise<{
        isAuthenticated: boolean;
        shouldShowAlert: boolean;
        userData?: any;
    }> {
        try {
            const token = await this.getToken();

            if (token) {
                const userData = await this.getUserData();
                console.log('Token found, user is authenticated');

                return {
                    isAuthenticated: true,
                    shouldShowAlert: true,
                    userData
                };
            } else {
                console.log('No token found, user needs to login');
                return {
                    isAuthenticated: false,
                    shouldShowAlert: false
                };
            }
        } catch (error) {
            console.error('Error checking existing authentication:', error);
            return {
                isAuthenticated: false,
                shouldShowAlert: false
            };
        }
    }

    /**
     * Show auto-login alert to user
     * @param onContinue - callback function to execute when user continues
     * @param userData - optional user data to display
     */
    static showAutoLoginAlert(onContinue: () => void, userData?: any): void {
        const welcomeMessage = userData?.firstName
            ? `Welcome back, ${userData.firstName}! You are already logged in.`
            : 'Welcome back! You are already logged in.';

        Alert.alert('Auto Login', welcomeMessage, [
            {
                text: 'Continue',
                onPress: onContinue
            }
        ]);
    }

    /**
     * Logout user by clearing all stored authentication data
     * @returns Promise<boolean> - true if successful, false otherwise
     */
    static async logout(): Promise<boolean> {
        try {
            await EncryptedStorage.removeItem(this.TOKEN_KEY);
            await EncryptedStorage.removeItem(this.REFRESH_TOKEN_KEY);
            await EncryptedStorage.removeItem(this.USER_DATA_KEY);
            console.log('User logged out successfully');
            return true;
        } catch (error) {
            console.error('Error during logout:', error);
            return false;
        }
    }

    /**
     * Clear all stored data (useful for debugging or data corruption)
     * @returns Promise<boolean> - true if successful, false otherwise
     */
    static async clearAllData(): Promise<boolean> {
        try {
            await EncryptedStorage.clear();
            console.log('All authentication data cleared');
            return true;
        } catch (error) {
            console.error('Error clearing all data:', error);
            return false;
        }
    }
}

export default AuthenticationService;



/**
 * Benefits of using a service layer for authentication
 * 
 * 1. Separation of Concerns: Keeps authentication logic separate from UI components.
 * 2. Reusability: Can be reused across different parts of the app.
 * 3. Maintainability: Easier to maintain and update authentication logic in one place.
 * 4. Testability: Simplifies unit testing of authentication functions.
 * 5. Consistency: Ensures consistent handling of authentication across the app.
 * 6. Security: Centralizes secure storage and retrieval of sensitive data like tokens.
 * 7. Scalability: Easier to extend with additional features like multi-factor authentication or OAuth.
 * 8. Abstraction: Hides implementation details from the rest of the app, providing a clean API.
 * 9. Error Handling: Centralized error handling for authentication-related issues.
 * 10. Async Operations: Manages asynchronous operations related to authentication effectively.
 *
 * Why custom hook is not good choice?
 * 
 * 1. Complexity: Authentication often involves multiple steps (login, logout, token refresh) that can make a custom hook complex and harder to manage.
 * 2. State Management: A service layer can better handle global state management (e.g., using Context API or Redux) compared to a custom hook which is typically local to a component.
 * 3. Reusability: A service layer can be easily reused across different components and screens, while a custom hook may lead to code duplication if not managed properly.
 * 4. Testing: Service layers can be more straightforward to unit test compared to custom hooks, which may require rendering components to test.
 * 5. Separation of Concerns: A service layer provides a clear separation between business logic and UI logic, which is beneficial for maintainability and scalability.
 */