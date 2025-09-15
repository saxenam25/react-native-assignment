import React from 'react';
import { View, Text } from 'react-native';
import Toast from 'react-native-toast-message';

const ToastComponent = () => {
    return (
        <Toast 
            position='bottom'
            bottomOffset={60}
            config={{
                success: (props) => (
                    <View style={{
                        height: 60,
                        width: '90%',
                        backgroundColor: '#4CAF50',
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}>
                        <Text style={{ fontSize: 18, marginRight: 8 }}>✅</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={{ 
                                color: 'white', 
                                fontSize: 16, 
                                fontWeight: 'bold',
                                marginBottom: 2 
                            }}>
                                {props.text1}
                            </Text>
                            <Text style={{ 
                                color: 'white', 
                                fontSize: 14,
                                opacity: 0.9 
                            }}>
                                {props.text2}
                            </Text>
                        </View>
                    </View>
                ),
                error: (props) => (
                    <View style={{
                        height: 60,
                        width: '90%',
                        backgroundColor: '#F44336',
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}>
                        <Text style={{ fontSize: 18, marginRight: 8 }}>❌</Text>
                        <View style={{ flex: 1 }}>
                            <Text style={{ 
                                color: 'white', 
                                fontSize: 16, 
                                fontWeight: 'bold',
                                marginBottom: 2 
                            }}>
                                {props.text1}
                            </Text>
                            <Text style={{ 
                                color: 'white', 
                                fontSize: 14,
                                opacity: 0.9 
                            }}>
                                {props.text2}
                            </Text>
                        </View>
                    </View>
                ),
            }}
        />
    );
};

export default ToastComponent;
