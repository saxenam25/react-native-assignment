import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ActivityIndicator, Alert, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import useFetch from '../../../shared/hooks/useFetch';
import { WeatherResponse } from './Weather.interface';
import asyncStorage from '../../../core/asyncStorage';
import styles from './Weather.style'
import WeatherSkelton from './WeatherSkelton.component';

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
            getCurrentLocation();
        }
    }, [permissionGranted]); // Only depends on permissionGranted

    // Auto-refresh every 10 minutes - ONLY WHEN LOCATION IS AVAILABLE
    useEffect(() => {
        if (location && permissionGranted) {
            const refreshInterval = setInterval(async () => {
                // Clear cache before refreshing
                await asyncStorage.deleteDataByKey(ASYNC_STORAGE_KEY_CURRENT);
                // Trigger refresh by updating the refresh key
                setRefreshKey(prev => prev + 1);
                setLastRefresh(new Date());
            }, 600000); // 10 minutes

            return () => {
                clearInterval(refreshInterval);
            };
        }
    }, [location]); // Only depends on location, not permissionGranted

    // Request location permission
    const requestLocationPermission = async (): Promise<void> => {
        setIsRequestingPermission(true);
        setLocationError(null);

        try {
            if (Platform.OS === 'android') {
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
                
                const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
                setPermissionGranted(isGranted);
                
                if (!isGranted) {
                    const errorMsg = 'Location permission is required to access weather data.';
                    setLocationError(errorMsg);
                    Alert.alert('Permission Required', errorMsg);
                }
            } else {
                // For iOS, we'll check permission when getting location
                // Since react-native-geolocation-service handles iOS permissions automatically
                setPermissionGranted(true);
            }
        } catch (error) {
            const errorMsg = 'Failed to request location permission';
            setLocationError(errorMsg);
            Alert.alert('Error', errorMsg);
        } finally {
            setIsRequestingPermission(false);
        }
    };

    const refreshWeatherData = async () => {
        // Manual refresh function
        await asyncStorage.deleteDataByKey(ASYNC_STORAGE_KEY_CURRENT);
        setRefreshKey(prev => prev + 1);
        setLastRefresh(new Date());
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
            <WeatherSkelton />
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
            
            {/* Fixed Bottom Refresh Section */}
            <View style={styles.bottomRefreshSection}>
                <Text style={styles.autoRefreshNote}>Data will auto refresh in 10 minutes.</Text>
                <TouchableOpacity 
                    style={styles.refreshButton} 
                    onPress={refreshWeatherData}
                    disabled={loadingCurrent}
                >
                    <Text style={styles.refreshButtonText}>
                        {loadingCurrent ? 'Refreshing...' : 'Refresh Now'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default WeatherDashboardScreen;