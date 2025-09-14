
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import LoginScreen from '../../screens/advanced-react-example/Login/LoginScreen';
import { advancedRoutes, basicRoutes, RouteConfig } from './route.config';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



// Custom Drawer Content Component with Nested Sections
const CustomDrawerContent = (props: any) => {
    const [expandedBasic, setExpandedBasic] = React.useState(false);
    const [expandedAdvanced, setExpandedAdvanced] = React.useState(true);

    const renderSection = (title: string, routes: RouteConfig[], expanded: boolean, toggleExpanded: () => void) => (
        <View style={styles.sectionContainer}>
            <TouchableOpacity style={styles.sectionHeader} onPress={toggleExpanded}>
                <View style={styles.sectionHeaderContent}>
                    {/* <HomeIcon size={15} color="#333" /> */}
                    <Text style={styles.sectionTitle}>{title}</Text>
                    <Text style={styles.expandIcon}>{expanded ? '−' : '+'}</Text>
                </View>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.sectionItems}>
                    {routes.map((route) => (
                        <TouchableOpacity
                            key={route.name}
                            style={styles.drawerItem}
                            onPress={() => props.navigation.navigate(route.name)}
                        >
                            <Text style={styles.itemLabel}>{route.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <DrawerContentScrollView {...props} style={styles.drawerContainer}>

            {renderSection(
                'Basic React Examples',
                basicRoutes,
                expandedBasic,
                () => setExpandedBasic(!expandedBasic)
            )}

            {renderSection(
                'Advanced React Examples',
                advancedRoutes,
                expandedAdvanced,
                () => setExpandedAdvanced(!expandedAdvanced)
            )}
        </DrawerContentScrollView>
    );
};

// Drawer for Profile & Settings
function DrawerNavigator() {
    // Combine all routes
    const allRoutes = [...basicRoutes, ...advancedRoutes];
    console.log("🚀 ~ allRoutes:", allRoutes)

    return (
        <Drawer.Navigator
            initialRouteName="Profile"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={drawerScreenOptions}
        >
            {/* Dynamically render all screens from route config */}
            {allRoutes.map((route) => (
                <Drawer.Screen
                    key={route.name}
                    name={route.name}
                    component={route.component}
                    options={{ title: route.label }}
                />
            ))}
        </Drawer.Navigator>
    );
}

// Root Stack Navigator
export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
        </Stack.Navigator>
    );
}

// Drawer Screen Options Configuration
const drawerScreenOptions = {
    drawerStyle: {
        backgroundColor: '#f8f9fa',
        width: 280,
    },
    headerShown: true,
    headerStyle: {
        backgroundColor: '#ffffff',
        elevation: 2,
        shadowOpacity: 0.1,
    },
    headerTitleStyle: {
        fontWeight: 'bold' as const,
        color: '#333',
    },
};

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    drawerHeader: {
        backgroundColor: '#007AFF',
        padding: 20,
        paddingTop: 50,
        marginBottom: 10,
    },
    drawerHeaderText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sectionContainer: {
        marginBottom: 10,
    },
    sectionHeader: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 1,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginHorizontal: 8,
        borderRadius: 8,
        marginBottom: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginLeft: 12,
    },
    expandIcon: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        width: 20,
        textAlign: 'center',
    },
    sectionItems: {
        backgroundColor: '#ffffff',
        marginHorizontal: 8,
        borderRadius: 8,
        paddingVertical: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
    },
    drawerItem: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemLabel: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
});