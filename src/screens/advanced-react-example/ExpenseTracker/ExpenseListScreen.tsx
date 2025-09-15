import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Toast from 'react-native-toast-message';
import { Expense, dummyExpenses, getCategoryColor } from './ExpenseData';
import AddExpenseScreen from './AddExpenseScreen';
import ExpenseChartScreen from './ExpenseChartScreen';
import ExpenseFileManager from './ExpenseFileManager';
import ToastComponent from '../../../ui-components/ToastComponent';
import { sqliteDB, DatabaseExpense } from './sqlite-expense-db';
import styles from './Expense.style';

const ExpenseListScreen = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showChart, setShowChart] = useState(false);
    const [showSettingsMenu, setShowSettingsMenu] = useState(false);

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
            Toast.show({
                type: 'error',
                text1: 'Load Failed',
                text2: 'Failed to load expenses'
            });
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
                            Toast.show({
                                type: 'success',
                                text1: 'Expense Removed',
                                text2: 'Expense deleted successfully!'
                            });
                        } catch (error) {
                            console.error('Failed to remove expense:', error);
                            Toast.show({
                                type: 'error',
                                text1: 'Remove Failed',
                                text2: 'Failed to remove expense'
                            });
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
            Toast.show({
                type: 'success',
                text1: 'Expense Added',
                text2: `${expense.name} added successfully!`
            });
        } catch (error) {
            console.error('Failed to add expense:', error);
            Toast.show({
                type: 'error',
                text1: 'Add Failed',
                text2: 'Failed to add expense'
            });
        }
    };

    const handleBackupData = async () => {
        setShowSettingsMenu(false);
        try {
            await ExpenseFileManager.backupExpensesToFile(expenses);
            Toast.show({
                type: 'success',
                text1: 'Backup Successful',
                text2: 'Data backed up successfully!'
            });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Backup Failed',
                text2: error.message
            });
        }
    };

    const handleRestoreData = async () => {
        setShowSettingsMenu(false);
        try {
            const restoredExpenses = await ExpenseFileManager.restoreExpensesFromFile();
            if (restoredExpenses && restoredExpenses.length > 0) {
                // Clear existing data and restore from backup
                await sqliteDB.clearAllExpenses();
                
                // Convert Expense[] to DatabaseExpense[]
                const dbExpenses = restoredExpenses.map(expense => ({
                    id: expense.id,
                    name: expense.name,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date.toISOString()
                }));
                
                await sqliteDB.bulkInsertExpenses(dbExpenses);
                await loadExpensesFromDB(); // Refresh the list
                Toast.show({
                    type: 'success',
                    text1: 'Restore Successful',
                    text2: `Restored ${restoredExpenses.length} expenses from backup!`
                });
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Restore Failed',
                text2: error.message
            });
        }
    };

    const handleDeleteBackup = async () => {
        setShowSettingsMenu(false);
        try {
            await ExpenseFileManager.deleteBackupFile();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Delete Failed',
                text2: error.message
            });
        }
    };

    const handleClearAll = async () => {
        setShowSettingsMenu(false);
        Alert.alert(
            "Clear All Expenses",
            "Are you sure you want to delete all expenses? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear All",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await sqliteDB.clearAllExpenses();
                            await loadExpensesFromDB(); // Refresh the list
                            Toast.show({
                                type: 'success',
                                text1: 'Clear Successful',
                                text2: 'All expenses have been cleared!'
                            });
                        } catch (error: any) {
                            Toast.show({
                                type: 'error',
                                text1: 'Clear Failed',
                                text2: error.message
                            });
                        }
                    }
                }
            ]
        );
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
        </View>
    );

    const renderSettingsMenu = () => {
        if (!showSettingsMenu) return null;

        return (
            <View style={styles.settingsMenuOverlay}>
                <TouchableOpacity 
                    style={styles.settingsMenuBackdrop}
                    onPress={() => setShowSettingsMenu(false)}
                />
                <View style={styles.settingsMenu}>
                    <TouchableOpacity 
                        style={styles.settingsMenuItem}
                        onPress={handleBackupData}
                    >
                        <Text style={styles.settingsMenuText}>💾 Backup Data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.settingsMenuItem}
                        onPress={handleRestoreData}
                    >
                        <Text style={styles.settingsMenuText}>📁 Restore Data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.settingsMenuItem}
                        onPress={handleDeleteBackup}
                    >
                        <Text style={[styles.settingsMenuText, styles.settingsMenuTextDanger]}>🗑️ Delete Backup</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.settingsMenuItem, styles.settingsMenuItemLast]}
                        onPress={handleClearAll}
                    >
                        <Text style={[styles.settingsMenuText, styles.settingsMenuTextDanger]}>🧹 Clear All</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderHiddenItem = ({ item }: { item: Expense }) => (
        <View style={styles.rightActionsContainer}>
            <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => removeExpense(item.id)}
            >
                <Text style={styles.deleteButtonText}>✕</Text>
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
                <TouchableOpacity 
                    style={styles.headerIconButton} 
                    onPress={() => setShowSettingsMenu(!showSettingsMenu)}
                >
                    <Text style={styles.headerIconText}>⚙️</Text>
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
            <SwipeListView
                data={expenses}
                renderItem={renderExpenseItem}
                renderHiddenItem={renderHiddenItem}
                keyExtractor={(item: Expense) => item.id}
                rightOpenValue={-80}
                contentContainerStyle={[
                    styles.listContent,
                    expenses.length === 0 && styles.emptyListContent
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyState}
            />

            {renderSettingsMenu()}

            <AddExpenseScreen 
                isVisible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onAddExpense={handleAddExpense}
                expenseCount={expenses.length}
            />

            <ToastComponent />
        </View>
    );
};

export default ExpenseListScreen;