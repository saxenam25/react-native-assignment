import React from 'react';
import { View, StyleSheet, Text, ScrollView, useWindowDimensions } from 'react-native';

type GridItem = {
    id: number;
    name: string;
    description: string;
    color: string;
};

const gridItems: GridItem[] = [
    { id: 1, name: 'Item One', description: 'Description for item one', color: '#FF5733' },
    { id: 2, name: 'Item Two', description: 'Description for item two', color: '#33FF57' },
    { id: 3, name: 'Item Three', description: 'Description for item three', color: '#3357FF' },
    { id: 4, name: 'Item Four', description: 'Description for item four', color: '#F3FF33' },
    { id: 5, name: 'Item Five', description: 'Description for item five', color: '#FF33F6' },
    { id: 6, name: 'Item Six', description: 'Description for item six', color: '#33FFF6' },
];

const ResponsiveGridScreen: React.FC = () => {
    const { width, height } = useWindowDimensions();
    const isPortrait = height >= width;
    const columnCount = isPortrait ? 2 : 3;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {gridItems.map((item: GridItem) => (
                <View
                    key={item.id}
                    style={[
                        styles.gridItem,
                        { width: `${95 / columnCount}%`, backgroundColor: item.color },
                    ]}
                >
                    <Text style={styles.itemTitle}>{item.name}</Text>
                    <Text style={styles.itemDesc}>{item.description}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 8,
    },
    header: {
        width: '100%',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 12,
        textAlign: 'center',
    },
    gridItem: {
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 4,
        borderRadius: 8,
        padding: 4,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#222',
        marginBottom: 4,
        textAlign: 'center',
    },
    itemDesc: {
        fontSize: 12,
        color: '#444',
        textAlign: 'center',
    },
});

export default ResponsiveGridScreen;
