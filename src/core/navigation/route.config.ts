import React from 'react';
import CounterScreen from '../../screens/basic-react-examples/Counter/CounterScreen';
import GreetingCardScreen from '../../screens/basic-react-examples/GreetingCard/GreetingCardScreen';
import ToggleScreen from '../../screens/basic-react-examples/Toggle/ToggleScreen';
import TimerScreen from '../../screens/basic-react-examples/Timer/TimerScreen';
import InputHandlingScreen from '../../screens/basic-react-examples/Forms/InputHandlingScreen';
import TodoScreen from '../../screens/basic-react-examples/Todo/TodoScreen';
import ResponsiveGridScreen from '../../screens/basic-react-examples/ResponsiveGrid/ResponsiveGridScreen';
import UseMemoScreen from '../../screens/basic-react-examples/Memo/UseMemoScreen';
import UserScreen from '../../screens/basic-react-examples/Users/UserScreen';
import DarkModeScreen from '../../screens/basic-react-examples/DarkMode/DarkModeScreen';
import NewsReaderScreen from '../../screens/advanced-react-example/NewsReader/NewsReaderScreen';
import UserProfileScreen from '../../screens/advanced-react-example/UserProfileScreen';
import WeatherDashboardScreen from '../../screens/advanced-react-example/Weather/WeatherDashboardScreen';
import ProductListScreen from '../../screens/advanced-react-example/ProductList/ProductListScreen';
import ExpenseListScreen from '../../screens/advanced-react-example/ExpenseTracker/ExpenseListScreen';

export interface RouteConfig {
    name: string;
    label: string;
    component: React.ComponentType<any>;
}

const basicRoutes: RouteConfig[] = [
    { name: 'Counter', label: 'Counter', component: CounterScreen },
    { name: 'Toggle', label: 'Toggle', component: ToggleScreen },
    { name: 'Timer', label: 'Timer', component: TimerScreen },
    { name: 'Input Handling', label: 'Input Handling', component: InputHandlingScreen },
    { name: 'Todo', label: 'Todo List', component: TodoScreen },
    { name: 'Responsive Grid', label: 'Responsive Grid', component: ResponsiveGridScreen },
    { name: 'Use Memo', label: 'Use Memo', component: UseMemoScreen },
    { name: 'User List', label: 'User List', component: UserScreen },
    { name: 'Greeting Card', label: 'Greeting Card', component: GreetingCardScreen },
    { name: 'Dark Mode', label: 'Dark Mode', component: DarkModeScreen }
];

const advancedRoutes: RouteConfig[] = [
    { name: 'Profile', label: 'User Profile', component: UserProfileScreen },
    { name: 'News Reader', label: 'News Reader', component: NewsReaderScreen },
    { name: 'Weather', label: 'Weather App', component: WeatherDashboardScreen },
    { name: 'Product Search', label: 'Product Search', component: ProductListScreen },
    { name: 'Expense Tracker', label: 'Expense Tracker', component: ExpenseListScreen },
];

export { basicRoutes, advancedRoutes };