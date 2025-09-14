import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Expense, categories, getCategoryColor } from './ExpenseData';
import styles from './Expense.style';

interface AddExpenseScreenProps {
    isVisible: boolean;
    onClose: () => void;
    onAddExpense: (expense: Expense) => void;
    expenseCount: number;
}

const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({
    isVisible,
    onClose,
    onAddExpense,
    expenseCount
}) => {
    const [newExpense, setNewExpense] = useState({
        name: '',
        amount: '',
        category: 'Food'
    });
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const addExpense = () => {
        const amount = parseFloat(newExpense.amount);
        
        const expense: Expense = {
            id: (expenseCount + 1).toString(),
            name: newExpense.name.trim(),
            amount: amount,
            category: newExpense.category,
            date: new Date()
        };

        onAddExpense(expense);
        resetForm();
        onClose();
    };

    const isFormValid = () => {
        const amount = parseFloat(newExpense.amount);
        return newExpense.name.trim() !== '' && 
               newExpense.amount.trim() !== '' && 
               !isNaN(amount) && 
               amount > 0;
    };

    const resetForm = () => {
        setNewExpense({ name: '', amount: '', category: 'Food' });
        setShowCategoryDropdown(false);
    };

    const closeModal = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
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
    );
};

export default AddExpenseScreen;
