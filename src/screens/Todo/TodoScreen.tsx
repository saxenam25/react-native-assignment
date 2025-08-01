// create a todo screen that allows users to add, remove, and display todo items. to add todo item, take a text input box and a button to add that task in below list item. every list item must contain delete icon as well and when delete , remove that item from itemsarray state. when no item in list, show gray color text like no itemsm added.
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import PressableButton from '../../ui-components/PressableButton';

const TodoScreen = () => {
    const [task, setTask] = useState('');
    const [items, setItems] = useState<string[]>([]);

    const addTask = () => {
        if (task) {
            setItems([...items, task]);
            setTask('');
        }
    };

    const removeTask = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const renderItem = ({ item, index }: { item: string; index: number }) => (
        <View style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
            <PressableButton onPress={() => removeTask(index)} style={styles.deleteButton}>
                <Text>✗</Text>
            </PressableButton>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Todo List</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="Add a new task"
                    value={task}
                    onChangeText={setTask}
                    autoFocus={true}
                    onSubmitEditing={addTask}
                    returnKeyType="done"
                />
                <PressableButton onPress={addTask} style={styles.addButton}>
                    <Text style={styles.addButtonText}>+</Text>
                </PressableButton>
            </View>
            {items.length === 0 ? (
                <Text style={styles.emptyText}>No items added.</Text>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
        marginBottom: 12,
    },
    addButton: {
        backgroundColor: '#007bff',
        borderRadius: 4,
        padding: 12,
        alignItems: 'center',
        marginLeft: 8,
        paddingHorizontal: 16,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        fontSize: 18,
    },
    deleteIcon: {
        fontSize: 18,
        color: 'red',
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    emptyText: {
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default TodoScreen;