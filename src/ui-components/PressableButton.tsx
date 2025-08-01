import React from 'react';
import { Pressable, StyleSheet, ViewStyle, Text, TextStyle } from 'react-native';

type ButtonProps = React.PropsWithChildren<{
    onPress?: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}>;

const PressableButton: React.FC<ButtonProps> = ({ onPress, style, textStyle, disabled, children, ...rest }) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            styles.button,
            style,
            pressed && styles.pressed,
            disabled && styles.disabled,
        ]}
        disabled={disabled}
        {...rest}
    >
        <Text style={[styles.text, textStyle]}>{children}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 6,
        alignItems: 'center',
    },
    pressed: {
        opacity: 0.7,
    },
    disabled: {
        backgroundColor: '#cccccc',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default PressableButton;