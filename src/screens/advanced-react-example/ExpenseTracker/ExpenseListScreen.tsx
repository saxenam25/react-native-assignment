import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Expense, dummyExpenses, getCategoryColor } from './ExpenseData';
import AddExpenseScreen from './AddExpenseScreen';
import styles from './Expense.style';

const ExpenseListScreen = () => {
    const [expenses, setExpenses] = useState<Expense[]>(dummyExpenses);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const removeExpense = (id: string) => {
        Alert.alert(
            "Remove Expense",
            "Are you sure you want to remove this expense?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                        setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
                    }
                }
            ]
        );
    };

    const getTotalAmount = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
    };

    const handleAddExpense = (expense: Expense) => {
        setExpenses(prev => [expense, ...prev]);
    };

    const renderExpenseItem = ({ item }: { item: Expense }) => (
        <View style={styles.expenseItem}>
            <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(item.category) }]} />
            <View style={styles.expenseContent}>
                <View style={styles.expenseHeader}>
                    <Text style={styles.expenseName}>{item.name}</Text>
                    <Text style={styles.expenseAmount}>Rs. {item.amount.toFixed(2)}</Text>
                </View>
                <View style={styles.expenseDetails}>
                    <Text style={styles.expenseCategory}>{item.category}</Text>
                    <Text style={styles.expenseDate}>{item.date.toLocaleDateString()}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => removeExpense(item.id)}>
                <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>My Expenses</Text>
            <Text style={styles.totalAmount}>Total: Rs. {getTotalAmount()}</Text>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No expenses found</Text>
            <Text style={styles.emptySubText}>Start adding your expenses!</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {renderHeader()}
            <FlatList
                data={expenses}
                renderItem={renderExpenseItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[
                    styles.listContent,
                    expenses.length === 0 && styles.emptyListContent
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
            />
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => setIsModalVisible(true)}
            >
                <Text style={styles.addButtonText}>+ Add Expense</Text>
            </TouchableOpacity>

            <AddExpenseScreen 
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onAddExpense={handleAddExpense}
                expenseCount={expenses.length}
            />
        </View>
    );
};

export default ExpenseListScreen;