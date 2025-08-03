import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ViewStyle, TextStyle } from 'react-native';

// Define local colors for light and dark mode
const lightBackground: string = '#FFFFFF';
const lightText: string = '#000000';
const darkBackground: string = '#000000';
const darkText: string = '#FFFFFF';

const DarkModeScreen: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const toggleDarkMode = (): void => {
        setIsDarkMode((prevMode: boolean) => !prevMode);
    };

    const backgroundColor: string = isDarkMode ? darkBackground : lightBackground;
    const textColor: string = isDarkMode ? darkText : lightText;
    const buttonTitle: string = isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={[styles.text, { color: textColor }]}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                Laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit.
            </Text>
            <Button title={buttonTitle} onPress={toggleDarkMode} />
        </View>
    );
};

type Styles = {
    container: ViewStyle;
    text: TextStyle;
};

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        margin: 10,
        textAlign: 'center',
    },
});

export default DarkModeScreen;
