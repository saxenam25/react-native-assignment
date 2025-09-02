
import { NavigationContainer } from '@react-navigation/native';
import CounterScreen from '../../screens/Counter/CounterScreen';
import GreetingCardScreen from '../../screens/GreetingCard/GreetingCardScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeIcon } from 'react-native-heroicons/outline';
import ToggleScreen from '../../screens/Toggle/ToggleScreen';
import TimerScreen from '../../screens/Timer/TimerScreen';
import InputHandlingScreen from '../../screens/Forms/InputHandlingScreen';
import TodoScreen from '../../screens/Todo/TodoScreen';
import ResponsiveGridScreen from '../../screens/ResponsiveGrid/ResponsiveGridScreen';
import UseMemoScreen from '../../screens/Memo/UseMemoScreen';
import UserScreen from '../../screens/Users/UserScreen';
import DarkModeScreen from '../../screens/DarkMode/DarkModeScreen';
import NewsReaderScreen from '../../screens/advanced-react-example/NewsReader/NewsReaderScreen';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import LoginScreen from '../../screens/advanced-react-example/Login/LoginScreen';
import UserProfileScreen from '../../screens/advanced-react-example/UserProfileScreen';
import { advancedRoutes, basicRoutes } from './route.config';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content Component with Nested Sections
const CustomDrawerContent = (props: any) => {
    const [expandedBasic, setExpandedBasic] = React.useState(true);
    const [expandedAdvanced, setExpandedAdvanced] = React.useState(true);

    const renderSection = (title: string, routes: any[], expanded: boolean, toggleExpanded: () => void) => (
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
    return (
        <Drawer.Navigator 
            initialRouteName="Profile"
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
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
                    fontWeight: 'bold',
                    color: '#333',
                },
            }}
        >
            {/* Basic React Examples */}
            <Drawer.Screen 
                name="Counter" 
                component={CounterScreen}
                options={{ title: 'Counter' }}
            />
            <Drawer.Screen 
                name="Toggle" 
                component={ToggleScreen}
                options={{ title: 'Toggle' }}
            />
            <Drawer.Screen 
                name="Timer" 
                component={TimerScreen}
                options={{ title: 'Timer' }}
            />
            <Drawer.Screen 
                name="Input Handling" 
                component={InputHandlingScreen}
                options={{ title: 'Input Handling' }}
            />
            <Drawer.Screen 
                name="Todo" 
                component={TodoScreen}
                options={{ title: 'Todo List' }}
            />
            <Drawer.Screen 
                name="Responsive Grid" 
                component={ResponsiveGridScreen}
                options={{ title: 'Responsive Grid' }}
            />
            <Drawer.Screen 
                name="Use Memo" 
                component={UseMemoScreen}
                options={{ title: 'Use Memo' }}
            />
            <Drawer.Screen 
                name="User List" 
                component={UserScreen}
                options={{ title: 'User List' }}
            />
            <Drawer.Screen 
                name="Dark Mode" 
                component={DarkModeScreen}
                options={{ title: 'Dark Mode' }}
            />
            {/* Advanced React Examples */}
            <Drawer.Screen 
                name="Profile" 
                component={UserProfileScreen}
                options={{ title: 'User Profile' }}
            />
            <Drawer.Screen 
                name="News Reader" 
                component={NewsReaderScreen}
                options={{ title: 'News Reader' }}
            />
        </Drawer.Navigator>
    );
}

// Root Stack Navigator
export default function RootNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login" >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Drawer" component={DrawerNavigator} />
        </Stack.Navigator>
    );
}


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