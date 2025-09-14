import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { Expense, dummyExpenses, categories, getCategoryColor } from './ExpenseData';

const ExpenseListScreen = () => {
    const [expenses, setExpenses] = useState<Expense[]>(dummyExpenses);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newExpense, setNewExpense] = useState({
        name: '',
        amount: '',
        category: 'Food'
    });
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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

    const addExpense = () => {
        const amount = parseFloat(newExpense.amount);
        
        const expense: Expense = {
            id: (expenses.length + 1).toString(),
            name: newExpense.name.trim(),
            amount: amount,
            category: newExpense.category,
            date: new Date()
        };

        setExpenses(prev => [expense, ...prev]);
        setNewExpense({ name: '', amount: '', category: 'Food' });
        setIsModalVisible(false);
        setShowCategoryDropdown(false);
    };

    const isFormValid = () => {
        const amount = parseFloat(newExpense.amount);
        return newExpense.name.trim() !== '' && 
               newExpense.amount.trim() !== '' && 
               !isNaN(amount) && 
               amount > 0;
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setShowCategoryDropdown(false);
        setNewExpense({ name: '', amount: '', category: 'Food' });
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <ScrollView contentContainerStyle={styles.modalContent}>
                            {/* Modal Header */}
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Add New Expense</Text>
                                <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Category Dropdown */}
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>Category</Text>
                                <TouchableOpacity 
                                    style={styles.dropdown}
                                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                >
                                    <Text style={styles.dropdownText}>{newExpense.category}</Text>
                                    <Text style={styles.dropdownArrow}>▼</Text>
                                </TouchableOpacity>
                                
                                {showCategoryDropdown && (
                                    <ScrollView style={styles.dropdownList} nestedScrollEnabled={true}>
                                        {categories.map((category, index) => (
                                            <TouchableOpacity
                                                key={category}
                                                style={[
                                                    styles.dropdownItem,
                                                    index === categories.length - 1 && styles.dropdownItemLast
                                                ]}
                                                onPress={() => {
                                                    setNewExpense(prev => ({ ...prev, category }));
                                                    setShowCategoryDropdown(false);
                                                }}
                                            >
                                                <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(category) }]} />
                                                <Text style={styles.dropdownItemText}>{category}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>

                            {/* Name Input */}
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>
                                    Name
                                    {newExpense.name.trim() === '' && <Text style={styles.requiredAsterisk}> *</Text>}
                                </Text>
                                <TextInput
                                    style={styles.formInput}
                                    placeholder="Enter expense name"
                                    placeholderTextColor="#999"
                                    value={newExpense.name}
                                    onChangeText={(text) => setNewExpense(prev => ({ ...prev, name: text }))}
                                />
                            </View>

                            {/* Amount Input */}
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>
                                    Amount
                                    {(newExpense.amount.trim() === '' || isNaN(parseFloat(newExpense.amount)) || parseFloat(newExpense.amount) <= 0) && 
                                     <Text style={styles.requiredAsterisk}> *</Text>}
                                </Text>
                                <TextInput
                                    style={styles.formInput}
                                    placeholder="Enter amount"
                                    placeholderTextColor="#999"
                                    value={newExpense.amount}
                                    onChangeText={(text) => setNewExpense(prev => ({ ...prev, amount: text }))}
                                    keyboardType="numeric"
                                />
                            </View>

                            {/* Add Button */}
                            <TouchableOpacity 
                                style={[
                                    styles.modalAddButton, 
                                    !isFormValid() && styles.modalAddButtonDisabled
                                ]} 
                                onPress={addExpense}
                                disabled={!isFormValid()}
                            >
                                <Text style={[
                                    styles.modalAddButtonText,
                                    !isFormValid() && styles.modalAddButtonTextDisabled
                                ]}>Add</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '600',
        color: '#27AE60',
    },
    listContent: {
        padding: 16,
    },
    emptyListContent: {
        flex: 1,
        justifyContent: 'center',
    },
    expenseItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryIndicator: {
        width: 4,
        height: 40,
        borderRadius: 2,
        marginRight: 12,
    },
    expenseContent: {
        flex: 1,
    },
    expenseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    expenseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        flex: 1,
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E74C3C',
    },
    expenseDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    expenseCategory: {
        fontSize: 14,
        color: '#7F8C8D',
        fontWeight: '500',
    },
    expenseDate: {
        fontSize: 12,
        color: '#95A5A6',
    },
    removeButton: {
        backgroundColor: '#E74C3C',
        borderRadius: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    removeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#3498DB',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        margin: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#7F8C8D',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: '#95A5A6',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        width: '100%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    modalContent: {
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    closeButton: {
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: '#6C757D',
        fontWeight: 'bold',
    },
    formGroup: {
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#DEE2E6',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
        color: '#2C3E50',
        height: 48,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#DEE2E6',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 48,
    },
    dropdownText: {
        fontSize: 16,
        color: '#2C3E50',
    },
    dropdownArrow: {
        fontSize: 12,
        color: '#6C757D',
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: '#DEE2E6',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        marginTop: 4,
        maxHeight: 160,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F9FA',
    },
    dropdownItemLast: {
        borderBottomWidth: 0,
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#2C3E50',
        marginLeft: 12,
    },
    categoryDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    modalAddButton: {
        backgroundColor: '#28A745',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    modalAddButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalAddButtonDisabled: {
        backgroundColor: '#BDC3C7',
        opacity: 0.6,
    },
    modalAddButtonTextDisabled: {
        color: '#7F8C8D',
    },
    requiredAsterisk: {
        color: '#E74C3C',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ExpenseListScreen;