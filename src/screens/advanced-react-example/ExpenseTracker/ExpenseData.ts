export type Expense = {
    id: string;
    category: string;
    name: string;
    amount: number;
    date: Date;
};

export const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Education', 'Travel'];

export const categoryColors: { [key: string]: string } = {
    'Food': '#FF6B6B',
    'Transport': '#4ECDC4',
    'Utilities': '#45B7D1',
    'Entertainment': '#96CEB4',
    'Shopping': '#FFEAA7',
    'Health': '#DDA0DD',
    'Education': '#74B9FF',
    'Travel': '#FD79A8',
};

export const getCategoryColor = (category: string) => {
    return categoryColors[category] || '#95A5A6';
};

export const dummyExpenses: Expense[] = [
    {
        id: '1',
        category: 'Food',
        name: 'Pizza Dinner',
        amount: 25.99,
        date: new Date('2024-09-10'),
    },
    {
        id: '2',
        category: 'Transport',
        name: 'Bus Ticket',
        amount: 3.50,
        date: new Date('2024-09-11'),
    },
    {
        id: '3',
        category: 'Utilities',
        name: 'Electricity Bill',
        amount: 125.75,
        date: new Date('2024-09-12'),
    },
    {
        id: '4',
        category: 'Entertainment',
        name: 'Movie Tickets',
        amount: 18.00,
        date: new Date('2024-09-13'),
    },
    {
        id: '5',
        category: 'Shopping',
        name: 'Groceries',
        amount: 67.40,
        date: new Date('2024-09-14'),
    },
    {
        id: '6',
        category: 'Health',
        name: 'Doctor Visit',
        amount: 85.00,
        date: new Date('2024-09-15'),
    },
    {
        id: '7',
        category: 'Education',
        name: 'Online Course',
        amount: 49.99,
        date: new Date('2024-09-16'),
    },
    {
        id: '8',
        category: 'Travel',
        name: 'Gas Station',
        amount: 45.20,
        date: new Date('2024-09-17'),
    },
];
