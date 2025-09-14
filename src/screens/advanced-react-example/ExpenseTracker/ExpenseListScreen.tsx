import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Expense, dummyExpenses, getCategoryColor } from './ExpenseData';
import AddExpenseScreen from './AddExpenseScreen';
import ExpenseChartScreen from './ExpenseChartScreen';
import { sqliteDB, DatabaseExpense } from './sqlite-expense-db';
import styles from './Expense.style';

const ExpenseListScreen = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        initializeDatabase();
        
        // Cleanup on unmount
        return () => {
            sqliteDB.close();
        };
    }, []);

    const initializeDatabase = async () => {
        try {
            await sqliteDB.init();
            
            // For testing: Clear database first (remove this in production)
          //  await sqliteDB.clearAllExpenses();
            
            // Check if we need to populate with dummy data
            const count = await sqliteDB.getExpensesCount();
            
            if (count === 0) {
                const dummyDatabaseExpenses: DatabaseExpense[] = dummyExpenses.map(expense => ({
                    id: expense.id,
                    name: expense.name,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date.toISOString()
                }));
                
                await sqliteDB.bulkInsertExpenses(dummyDatabaseExpenses);
            }
            
            await loadExpensesFromDB();
        } catch (error) {
            console.error('Database initialization failed:', error);
            Alert.alert('Database Error', 'Failed to initialize database. Using dummy data.');
            setExpenses(dummyExpenses);
        } finally {
            setLoading(false);
        }
    };

    const loadExpensesFromDB = async () => {
        try {
            const dbExpenses = await sqliteDB.getAllExpenses();
            const expenses: Expense[] = dbExpenses.map(dbExpense => ({
                id: dbExpense.id,
                name: dbExpense.name,
                amount: dbExpense.amount,
                category: dbExpense.category,
                date: new Date(dbExpense.date)
            }));
            setExpenses(expenses);
        } catch (error) {
            console.error('Failed to load expenses from database:', error);
            Alert.alert('Error', 'Failed to load expenses');
        }
    };

    const removeExpense = (id: string) => {
        Alert.alert(
            "Remove Expense",
            "Are you sure you want to remove this expense?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await sqliteDB.deleteExpense(id);
                            await loadExpensesFromDB(); // Refresh the list
                        } catch (error) {
                            console.error('Failed to remove expense:', error);
                            Alert.alert('Error', 'Failed to remove expense');
                        }
                    }
                }
            ]
        );
    };

    const getTotalAmount = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0).toFixed(2);
    };

    const handleAddExpense = async (expense: Expense) => {
        try {
            const databaseExpense: DatabaseExpense = {
                id: expense.id,
                name: expense.name,
                amount: expense.amount,
                category: expense.category,
                date: expense.date.toISOString()
            };
            
            await sqliteDB.insertExpense(databaseExpense);
            await loadExpensesFromDB(); // Refresh the list
        } catch (error) {
            console.error('Failed to add expense:', error);
            Alert.alert('Error', 'Failed to add expense');
        }
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
            <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>My Expenses</Text>
                <Text style={styles.totalAmount}>Total: Rs. {getTotalAmount()}</Text>
            </View>
            <View style={styles.headerButtons}>
                <TouchableOpacity 
                    style={styles.headerIconButton} 
                    onPress={() => setShowChart(true)}
                >
                    <Text style={styles.headerIconText}>📊</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.headerIconButton} 
                    onPress={() => setIsModalVisible(true)}
                >
                    <Text style={styles.headerIconText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No expenses found</Text>
            <Text style={styles.emptySubText}>Start adding your expenses!</Text>
        </View>
    );

    const renderLoading = () => (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Expenses</Text>
                <Text style={styles.totalAmount}>Loading...</Text>
            </View>
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Loading expenses...</Text>
                <Text style={styles.emptySubText}>Please wait</Text>
            </View>
        </View>
    );

    if (loading) {
        return renderLoading();
    }

    if (showChart) {
        return (
            <ExpenseChartScreen 
                expenses={expenses}
                onClose={() => setShowChart(false)}
            />
        );
    }

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