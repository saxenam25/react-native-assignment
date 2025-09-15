
import { createStaticNavigation } from '@react-navigation/native';
import CounterScreen from '../../screens/basic-react-examples/Counter/CounterScreen';
import GreetingCardScreen from '../../screens/basic-react-examples/GreetingCard/GreetingCardScreen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ToggleScreen from '../../screens/basic-react-examples/Toggle/ToggleScreen';
import TimerScreen from '../../screens/basic-react-examples/Timer/TimerScreen';
import InputHandlingScreen from '../../screens/basic-react-examples/Forms/InputHandlingScreen';
import TodoScreen from '../../screens/basic-react-examples/Todo/TodoScreen';
import ResponsiveGridScreen from '../../screens/basic-react-examples/ResponsiveGrid/ResponsiveGridScreen';
import UseMemoScreen from '../../screens/basic-react-examples/Memo/UseMemoScreen';
import UserScreen from '../../screens/basic-react-examples/Users/UserScreen';
import DarkModeScreen from '../../screens/basic-react-examples/DarkMode/DarkModeScreen';

const LeftDrawerScreen = createDrawerNavigator({
    initialRouteName: 'CounterScreen',
    screenOptions: {
        drawerPosition: 'left',
    },
    screens: {
        CounterScreen: {
            screen: CounterScreen,
            options: {
                title: 'Counter',
                drawerLabel: 'Counter',
                drawerIcon: () => <Icon name="access-point-check" size={24} color="#000" />, // Use MaterialCommunityIcons counter icon
            },
        },
        GreetingCardScreen: {
            screen: GreetingCardScreen,
            options: {
                title: 'Greeting Card',
                drawerLabel: 'Greeting Card',
                drawerIcon: () => <Icon name="card" size={24} color="#000" />, // Card icon from vector-icons
            },
        },
        ToggleScreen: {
            screen: ToggleScreen,
            options: {
                title: 'Toggle',
                drawerLabel: 'Toggle',
                drawerIcon: () => <Icon name="toggle-switch" size={24} color="#000" />, // Toggle icon from vector-icons
            },
        },
        TimerScreen: {
            screen: TimerScreen,
            options: {
                title: 'Timer',
                drawerLabel: 'Timer',
                drawerIcon: () => <Icon name="toggle-switch" size={24} color="#000" />,
            },
        },
        InputHandlingScreen: {
            screen: InputHandlingScreen,
            options: ({ route }: any) => ({
                title: route?.params?.dynamicTitle || 'Input Form',
                drawerLabel: 'Input Form',
                drawerIcon: () => <Icon name="form-textbox" size={24} color="#000" />, // Icon for input handling
            }),
        },
        TodoScreen: {
            screen: TodoScreen,
            options: {
                title: 'Todo List',
                drawerLabel: 'Todo List',
                drawerIcon: () => <Icon name="format-list-bulleted" size={24} color="#000" />, // Icon for todo list
            },
        },
        ResponsiveGridScreen: {
            screen: ResponsiveGridScreen,
            options: {
                title: 'Responsive Grid',
                drawerLabel: 'Responsive Grid',
                drawerIcon: () => <Icon name="grid" size={24} color="#000" />, // Icon for responsive grid
            },
        },
        UseMemoScreen: {
            screen: UseMemoScreen,
            options: {
                title: 'UseMemo Example',
                drawerLabel: 'UseMemo Example',
                drawerIcon: () => <Icon name="memory" size={24} color="#000" />, // Icon for useMemo example
            },
        },
        UserScreen: {
            screen: UserScreen,
            options: {
                title: 'User List',
                drawerLabel: 'User List',
                drawerIcon: () => <Icon name="account-multiple" size={24} color="#000" />, // Icon for user list
            },
        },
        DarkModeScreen: {
            screen: DarkModeScreen,
            options: {
                title: 'Dark Mode',
                drawerLabel: 'Dark Mode',
                drawerIcon: () => <Icon name="moon-waning-crescent" size={24} color="#000" />, // Icon for dark mode
            },
        },
    },
});
const Navigation = createStaticNavigation(LeftDrawerScreen);

export default Navigation;
