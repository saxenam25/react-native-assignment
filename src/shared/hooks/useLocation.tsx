import { useState, useEffect, useCallback } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

interface LocationCoords {
    lat: number;
    lon: number;
}

interface UseLocationResult {
    location: LocationCoords | null;
    permissionGranted: boolean;
    isRequestingPermission: boolean;
    locationError: string | null;
    requestLocationPermission: () => Promise<void>;
    getCurrentLocation: () => Promise<void>;
}

interface UseLocationOptions {
    autoRequestPermission?: boolean;
    autoGetLocation?: boolean;
    showErrorAlerts?: boolean;
}

const useLocation = (options: UseLocationOptions = {}): UseLocationResult => {
    const {
        autoRequestPermission = true,
        autoGetLocation = true,
        showErrorAlerts = true
    } = options;

    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [isRequestingPermission, setIsRequestingPermission] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);

    const getCurrentLocation = useCallback(async (): Promise<void> => {
        console.log("🚀 ~ getCurrentLocation called");
        setLocationError(null);

        if (!permissionGranted) {
            const errorMsg = 'Location permission not granted';
            setLocationError(errorMsg);
            console.log("🚀 ~ Error:", errorMsg);
            return;
        }

        try {
            console.log("🚀 ~ Starting Geolocation.getCurrentPosition");
            await new Promise<void>((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log("🚀 ~ SUCCESS - Location retrieved:", { latitude, longitude });
                        setLocation({ lat: latitude, lon: longitude });
                        resolve();
                    },
                    (error) => {
                        const errorMsg = `Unable to retrieve location: ${error.message}`;
                        setLocationError(errorMsg);
                        console.error('🚀 ~ Geolocation error:', error);
                        
                        if (showErrorAlerts) {
                            Alert.alert('Location Error', errorMsg);
                        }
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
    }, [permissionGranted, showErrorAlerts]);

    const requestLocationPermission = useCallback(async (): Promise<void> => {
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
                console.log("🚀 ~ isGranted:", isGranted);
                setPermissionGranted(isGranted);
                
                if (!isGranted) {
                    const errorMsg = 'Location permission is required to access weather data.';
                    setLocationError(errorMsg);
                    console.log("🚀 ~ Permission denied:", errorMsg);
                    if (showErrorAlerts) {
                        Alert.alert('Permission Required', errorMsg);
                    }
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
            if (showErrorAlerts) {
                Alert.alert('Error', errorMsg);
            }
        } finally {
            setIsRequestingPermission(false);
        }
    }, [showErrorAlerts]);

    // Auto-request permission on mount if enabled
    useEffect(() => {
        console.log("🚀 ~ useLocation mount, autoRequestPermission:", autoRequestPermission);
        if (autoRequestPermission) {
            requestLocationPermission();
        }
    }, [autoRequestPermission, requestLocationPermission]);

    // Auto-get location when permission is granted if enabled
    useEffect(() => {
        console.log("🚀 ~ permissionGranted changed:", permissionGranted, "autoGetLocation:", autoGetLocation);
        if (permissionGranted && autoGetLocation) {
            console.log("🚀 ~ About to call getCurrentLocation");
            getCurrentLocation();
        }
    }, [permissionGranted, autoGetLocation, getCurrentLocation]);

    // Debug log current state
    useEffect(() => {
        console.log("🚀 ~ useLocation state:", {
            location,
            permissionGranted,
            isRequestingPermission,
            locationError
        });
    }, [location, permissionGranted, isRequestingPermission, locationError]);

    return {
        location,
        permissionGranted,
        isRequestingPermission,
        locationError,
        requestLocationPermission,
        getCurrentLocation,
    };
};

export default useLocation;