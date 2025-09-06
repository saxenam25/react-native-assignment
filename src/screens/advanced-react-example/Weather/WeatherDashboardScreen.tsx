import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import useFetch from '../../../shared/hooks/useFetch';
import { WeatherResponse } from './Weather.interface';
import asyncStorage from '../../../core/asyncStorage';

const WEATHER_API_KEY = 'a4ba3587b76cb3aebe8b21ee47d29874';
const CURRENT_WEATHER_URL = (lat: number, lon: number) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
const ASYNC_STORAGE_KEY_CURRENT = 'current_weather';

interface LocationCoords {
    lat: number;
    lon: number;
}

const WeatherDashboardScreen: React.FC = () => {
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isRequestingPermission, setIsRequestingPermission] = useState(true);
    const [locationError, setLocationError] = useState<string | null>(null);

    // Memoize the fetch options to prevent infinite re-renders
    const fetchOptions = useMemo(() => ({
        delayApiInterval: 2000 // 2 seconds delay for skeleton UI testing
    }), []);

    // Memoize the URL to prevent unnecessary re-renders
    const weatherUrl = useMemo(() => {
        return location ? `${CURRENT_WEATHER_URL(location.lat, location.lon)}&_refresh=${refreshKey}` : '';
    }, [location, refreshKey]);

    const { data: currentWeather, loading: loadingCurrent, error: errorCurrent } = useFetch<WeatherResponse>(
        weatherUrl,
        ASYNC_STORAGE_KEY_CURRENT,
        fetchOptions
    );

    // Request permission on component mount - ONLY ONCE
    useEffect(() => {
        requestLocationPermission();
    }, []); // Empty dependency array - runs only once on mount

    // Get location when permission is granted - ONLY WHEN PERMISSION CHANGES
    useEffect(() => {
        if (permissionGranted && !location) { // Added !location check to prevent multiple calls
            console.log("🚀 ~ Getting location after permission granted");
            getCurrentLocation();
        }
    }, [permissionGranted]); // Only depends on permissionGranted

    // Auto-refresh every 10 minutes - ONLY WHEN LOCATION IS AVAILABLE
    useEffect(() => {
        if (location && permissionGranted) {
            console.log("🚀 ~ Setting up auto-refresh interval");
            const refreshInterval = setInterval(async () => {
                console.log("🚀 ~ Auto-refresh triggered");
                // Clear cache before refreshing
                await asyncStorage.deleteDataByKey(ASYNC_STORAGE_KEY_CURRENT);
                // Trigger refresh by updating the refresh key
                setRefreshKey(prev => prev + 1);
                setLastRefresh(new Date());
            }, 600000); // 10 minutes

            return () => {
                console.log("🚀 ~ Clearing auto-refresh interval");
                clearInterval(refreshInterval);
            };
        }
    }, [location]); // Only depends on location, not permissionGranted

    // Request location permission
    const requestLocationPermission = async (): Promise<void> => {
        console.log("🚀 ~ requestLocationPermission called");
        setIsRequestingPermission(true);
        setLocationError(null);

        try {
            if (Platform.OS === 'android') {
                console.log("🚀 ~ Requesting Android location permission");
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'This app needs access to your location to show weather information.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                
                console.log("🚀 ~ Android permission result:", granted);
                const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
                console.log("🚀 ~ Permission granted:", isGranted);
                setPermissionGranted(isGranted);
                
                if (!isGranted) {
                    const errorMsg = 'Location permission is required to access weather data.';
                    setLocationError(errorMsg);
                    console.log("🚀 ~ Permission denied:", errorMsg);
                    Alert.alert('Permission Required', errorMsg);
                }
            } else {
                // For iOS, we'll check permission when getting location
                // Since react-native-geolocation-service handles iOS permissions automatically
                console.log("🚀 ~ iOS - setting permission to true");
                setPermissionGranted(true);
            }
        } catch (error) {
            const errorMsg = 'Failed to request location permission';
            setLocationError(errorMsg);
            console.error('🚀 ~ Location permission error:', error);
            Alert.alert('Error', errorMsg);
        } finally {
            setIsRequestingPermission(false);
        }
    };

    // Get current location
    const getCurrentLocation = async (): Promise<void> => {
        setLocationError(null);

        if (!permissionGranted) {
            const errorMsg = 'Location permission not granted';
            setLocationError(errorMsg);
            return;
        }

        try {
            await new Promise<void>((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ lat: latitude, lon: longitude });
                        resolve();
                    },
                    (error) => {
                        const errorMsg = `Unable to retrieve location: ${error.message}`;
                        setLocationError(errorMsg);
                        console.error('🚀 ~ Geolocation error:', error);
                        console.error('🚀 ~ Error code:', error.code);
                        console.error('🚀 ~ Error message:', error.message);
                        
                        Alert.alert('Location Error', errorMsg);
                        reject(error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000,
                    }
                );
            });
        } catch (error) {
            console.error('🚀 ~ Get location catch error:', error);
        }
    };

    // Show loading screen while requesting permission
    if (isRequestingPermission) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Requesting location permission...</Text>
                </View>
            </View>
        );
    }

    // Show permission required message
    if (!permissionGranted) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {locationError || 'Location permission is required to access weather data.'}
                    </Text>
                </View>
            </View>
        );
    }

    // Show loading skeleton while fetching weather data
    if (loadingCurrent) {
        return (
            <View style={styles.container}>
                <View style={styles.currentWeather}>
                    {/* Skeleton Weather Header */}
                    <View style={styles.weatherHeader}>
                        <View style={[styles.skeleton, styles.skeletonTemp]} />
                        <View style={[styles.skeleton, styles.skeletonCondition]} />
                        <View style={[styles.skeleton, styles.skeletonDescription]} />
                    </View>

                    {/* Skeleton Temperature Details */}
                    <View style={styles.mainDataContainer}>
                        <View style={[styles.skeleton, styles.skeletonSectionTitle]} />
                        <View style={styles.dataGrid}>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <View key={item} style={styles.dataItem}>
                                    <View style={[styles.skeleton, styles.skeletonDataLabel]} />
                                    <View style={[styles.skeleton, styles.skeletonDataValue]} />
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Skeleton Additional Information */}
                    <View style={styles.additionalInfo}>
                        <View style={[styles.skeleton, styles.skeletonSectionTitle]} />
                        {[1, 2, 3, 4].map((item) => (
                            <View key={item} style={styles.infoRow}>
                                <View style={[styles.skeleton, styles.skeletonInfoLabel]} />
                                <View style={[styles.skeleton, styles.skeletonInfoValue]} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        );
    }

    // Show error message if weather fetch failed
    if (errorCurrent) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        Error fetching weather data. Please try again later.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {currentWeather?.main && (
                <View style={styles.currentWeather}>
                    {/* Weather Condition Info */}
                    <View style={styles.weatherHeader}>
                        <Text style={styles.currentTemp}>{Math.round(currentWeather.main.temp)}°C</Text>
                        <Text style={styles.currentCondition}>{currentWeather.weather[0].main}</Text>
                        <Text style={styles.description}>{currentWeather.weather[0].description}</Text>
                    </View>

                    {/* Main Weather Data */}
                    <View style={styles.mainDataContainer}>
                        <Text style={styles.sectionTitle}>Temperature Details</Text>
                        <View style={styles.dataGrid}>
                            <View style={styles.dataItem}>
                                <Text style={styles.dataLabel}>Feels Like</Text>
                                <Text style={styles.dataValue}>{Math.round(currentWeather.main.feels_like)}°C</Text>
                            </View>
                            <View style={styles.dataItem}>
                                <Text style={styles.dataLabel}>Min Temp</Text>
                                <Text style={styles.dataValue}>{Math.round(currentWeather.main.temp_min)}°C</Text>
                            </View>
                            <View style={styles.dataItem}>
                                <Text style={styles.dataLabel}>Max Temp</Text>
                                <Text style={styles.dataValue}>{Math.round(currentWeather.main.temp_max)}°C</Text>
                            </View>
                            <View style={styles.dataItem}>
                                <Text style={styles.dataLabel}>Humidity</Text>
                                <Text style={styles.dataValue}>{currentWeather.main.humidity}%</Text>
                            </View>
                            <View style={styles.dataItem}>
                                <Text style={styles.dataLabel}>Visibility</Text>
                                <Text style={styles.dataValue}>{(currentWeather.visibility / 1000).toFixed(1)} km</Text>
                            </View>
                        </View>
                    </View>

                    {/* Additional Weather Info */}
                    <View style={styles.additionalInfo}>
                        <Text style={styles.sectionTitle}>Additional Information</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Location:</Text>
                            <Text style={styles.infoValue}>{currentWeather.name}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Country:</Text>
                            <Text style={styles.infoValue}>{currentWeather.sys.country}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Coordinates:</Text>
                            <Text style={styles.infoValue}>{currentWeather.coord.lat.toFixed(4)}, {currentWeather.coord.lon.toFixed(4)}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Last Refresh:</Text>
                            <Text style={styles.infoValue}>{lastRefresh.toLocaleTimeString()}</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#d32f2f',
        textAlign: 'center',
        lineHeight: 24,
    },
    currentWeather: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    weatherHeader: {
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    currentTemp: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    currentCondition: {
        fontSize: 20,
        color: '#666',
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 16,
        color: '#888',
        textTransform: 'capitalize',
    },
    mainDataContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    dataGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    dataItem: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        alignItems: 'center',
    },
    dataLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        textAlign: 'center',
    },
    dataValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    additionalInfo: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    // Skeleton styles
    skeleton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    },
    skeletonTemp: {
        width: 120,
        height: 48,
        marginBottom: 4,
    },
    skeletonCondition: {
        width: 100,
        height: 20,
        marginBottom: 4,
    },
    skeletonDescription: {
        width: 150,
        height: 16,
    },
    skeletonSectionTitle: {
        width: 140,
        height: 18,
        marginBottom: 12,
        alignSelf: 'center',
    },
    skeletonDataLabel: {
        width: 60,
        height: 12,
        marginBottom: 4,
    },
    skeletonDataValue: {
        width: 40,
        height: 16,
    },
    skeletonInfoLabel: {
        width: 80,
        height: 14,
    },
    skeletonInfoValue: {
        width: 100,
        height: 14,
    },
});

export default WeatherDashboardScreen;