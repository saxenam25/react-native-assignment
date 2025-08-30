
import { createStaticNavigation } from '@react-navigation/native';
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

// Custom Drawer Content Component
const CustomDrawerContent = (props: any) => {
    const [expandedBasic, setExpandedBasic] = React.useState(false);
    const [expandedAdvanced, setExpandedAdvanced] = React.useState(true);

    const renderSection = (title: string, routes: any[], expanded: boolean, toggleExpanded: () => void) => (
        <View style={styles.sectionContainer}>
            <TouchableOpacity style={styles.sectionHeader} onPress={toggleExpanded}>
                <View style={styles.sectionHeaderContent}>
                    <HomeIcon
                        size={20}
                        color="#333"
                    />
                    <Text style={styles.sectionTitle}>{title}</Text>
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
                            {/* <Icon name={route.icon} size={20} color="#666" style={styles.itemIcon} /> */}
                            <Text style={styles.itemLabel}>{route.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <DrawerContentScrollView {...props} style={styles.drawerContainer}>
            {/* <View style={styles.drawerHeader}>
                <Text style={styles.appTitle}>React Native App</Text>
            </View> */}

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

const LeftDrawerScreen = createDrawerNavigator({
    initialRouteName: 'NewsReaderScreen',
    screenOptions: {
        drawerPosition: 'left',
        headerShown: true,
    },
    screens: {
        CounterScreen: {
            screen: CounterScreen,
            options: {
                title: 'Counter',
                drawerItemStyle: { display: 'none' }, // Hide from default drawer
            },
        },
        GreetingCardScreen: {
            screen: GreetingCardScreen,
            options: {
                title: 'Greeting Card',
                drawerItemStyle: { display: 'none' },
            },
        },
        ToggleScreen: {
            screen: ToggleScreen,
            options: {
                title: 'Toggle',
                drawerItemStyle: { display: 'none' },
            },
        },
        TimerScreen: {
            screen: TimerScreen,
            options: {
                title: 'Timer',
                drawerItemStyle: { display: 'none' },
            },
        },
        InputHandlingScreen: {
            screen: InputHandlingScreen,
            options: ({ route }: any) => ({
                title: route?.params?.dynamicTitle || 'Input Form',
                drawerItemStyle: { display: 'none' },
            }),
        },
        TodoScreen: {
            screen: TodoScreen,
            options: {
                title: 'Todo List',
                drawerItemStyle: { display: 'none' },
            },
        },
        ResponsiveGridScreen: {
            screen: ResponsiveGridScreen,
            options: {
                title: 'Responsive Grid',
                drawerItemStyle: { display: 'none' },
            },
        },
        UseMemoScreen: {
            screen: UseMemoScreen,
            options: {
                title: 'UseMemo Example',
                drawerItemStyle: { display: 'none' },
            },
        },
        UserScreen: {
            screen: UserScreen,
            options: {
                title: 'User List',
                drawerItemStyle: { display: 'none' },
            },
        },
        DarkModeScreen: {
            screen: DarkModeScreen,
            options: {
                title: 'Dark Mode',
                drawerItemStyle: { display: 'none' },
            },
        },
        NewsReaderScreen: {
            screen: NewsReaderScreen,
            options: {
                title: 'News Reader',
                drawerItemStyle: { display: 'none' },
            },
        },
        LoginScreen: {
            screen: LoginScreen,
            options: {
                title: 'Login',
                drawerLabel: 'Login',
                drawerItemStyle: { display: 'none' }, // Hide from default drawer
            },
        },
        UserProfileScreen: {
            screen: UserProfileScreen,
            options: {
                title: 'User Profile',
                drawerLabel: 'User Profile',
                drawerItemStyle: { display: 'none' }, // Hide from default drawer
            },
        },
    },
    drawerContent: (props) => <CustomDrawerContent {...props} />,
});

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    drawerHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        backgroundColor: '#ffffff',
    },
    appTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionContainer: {
        marginVertical: 8,
    },
    sectionHeader: {
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    sectionHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    sectionItems: {
        backgroundColor: '#ffffff',
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderBottomWidth: 0.5,
        borderBottomColor: '#f1f3f4',
    },
    itemIcon: {
        marginRight: 12,
    },
    itemLabel: {
        fontSize: 14,
        color: '#666',
    },
});
const NavigationWithNestedItem = createStaticNavigation(LeftDrawerScreen);

export default NavigationWithNestedItem;
