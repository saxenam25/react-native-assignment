import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Expense, getCategoryColor } from './ExpenseData';
import { sqliteDB } from './sqlite-expense-db';
import styles from './Expense.style';

const screenWidth = Dimensions.get('window').width;

interface ExpenseChartScreenProps {
    expenses: Expense[];
    onClose: () => void;
}

interface ChartData {
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
}

const ExpenseChartScreen: React.FC<ExpenseChartScreenProps> = ({ expenses, onClose }) => {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);

    useEffect(() => {
        generateChartData();
    }, [expenses]);

    const generateChartData = () => {
        if (expenses.length === 0) {
            setChartData([]);
            setTotalAmount(0);
            return;
        }

        // Group expenses by category
        const categoryTotals = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {} as Record<string, number>);

        // Calculate total
        const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
        setTotalAmount(total);

        // Convert to chart data format
        const data: ChartData[] = Object.entries(categoryTotals).map(([category, amount]) => ({
            name: category,
            population: amount,
            color: getCategoryColor(category),
            legendFontColor: '#333333',
            legendFontSize: 12,
        }));

        // Sort by amount (largest first)
        data.sort((a, b) => b.population - a.population);
        setChartData(data);
    };

    const getCategoryPercentage = (amount: number) => {
        if (totalAmount === 0) return '0%';
        return ((amount / totalAmount) * 100).toFixed(1) + '%';
    };

    const renderCategoryStats = () => {
        return (
            <View style={styles.categoryStatsContainer}>
                <Text style={styles.categoryStatsTitle}>Category Breakdown</Text>
                {chartData.map((item, index) => (
                    <View key={index} style={styles.categoryStatItem}>
                        <View style={styles.categoryStatLeft}>
                            <View style={[styles.categoryColorBox, { backgroundColor: item.color }]} />
                            <Text style={styles.categoryStatName}>{item.name}</Text>
                        </View>
                        <View style={styles.categoryStatRight}>
                            <Text style={styles.categoryStatAmount}>Rs. {item.population.toFixed(2)}</Text>
                            <Text style={styles.categoryStatPercentage}>
                                {getCategoryPercentage(item.population)}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    if (expenses.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Expense Chart</Text>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Text style={styles.backButtonText}>← Back to List</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.emptyChartState}>
                    <Text style={styles.emptyText}>No expenses to display</Text>
                    <Text style={styles.emptySubText}>Add some expenses to see the chart</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.chartHeader}>
                    <Text style={styles.chartTitle}>Expense Chart</Text>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Text style={styles.backButtonText}>← Back to List</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.totalAmountCard}>
                    <Text style={styles.totalAmountLabel}>Total Expenses</Text>
                    <Text style={styles.totalAmountValue}>Rs. {totalAmount.toFixed(2)}</Text>
                </View>

                <View style={styles.chartContainer}>
                    <PieChart
                        data={chartData}
                        width={screenWidth - 32}
                        height={240}
                        chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="30"
                        absolute
                        hasLegend={true}
                    />
                </View>

                {renderCategoryStats()}
            </ScrollView>
        </View>
    );
};

export default ExpenseChartScreen;
