import SQLite from 'react-native-sqlite-storage';

// Enable debugging and promises
SQLite.DEBUG(true);
SQLite.enablePromise(true);

// Database configuration
const DATABASE_NAME = 'ExpenseTracker.db';

export interface DatabaseExpense {
    id: string;
    name: string;
    amount: number;
    category: string;
    date: string;
    created_at?: string;
}

class SQLiteDatabase {
    private db: SQLite.SQLiteDatabase | null = null;

    // Initialize database connection
    async init(): Promise<void> {
        try {
            this.db = await SQLite.openDatabase({
                name: DATABASE_NAME,
                location: 'default',
            });

            await this.createTables();
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    // Create expenses table
    private async createTables(): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS expenses (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                amount REAL NOT NULL,
                category TEXT NOT NULL,
                date TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        try {
            await this.db.executeSql(createTableQuery);
        } catch (error) {
            console.error('Error creating expenses table:', error);
            throw error;
        }
    }

    // Insert a new expense
    async insertExpense(expense: DatabaseExpense): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const insertQuery = `
            INSERT INTO expenses (id, name, amount, category, date)
            VALUES (?, ?, ?, ?, ?)
        `;

        try {
            await this.db.executeSql(insertQuery, [
                expense.id,
                expense.name,
                expense.amount,
                expense.category,
                expense.date
            ]);
        } catch (error) {
            console.error('Error inserting expense:', error);
            throw error;
        }
    }

    // Get all expenses
    async getAllExpenses(): Promise<DatabaseExpense[]> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const selectQuery = `
            SELECT * FROM expenses 
            ORDER BY created_at DESC
        `;

        try {
            const [result] = await this.db.executeSql(selectQuery);
            const expenses: DatabaseExpense[] = [];

            for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                expenses.push({
                    id: row.id,
                    name: row.name,
                    amount: row.amount,
                    category: row.category,
                    date: row.date,
                    created_at: row.created_at
                });
            }

            return expenses;
        } catch (error) {
            console.error('Error retrieving expenses:', error);
            throw error;
        }
    }

    // Delete an expense
    async deleteExpense(id: string): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const deleteQuery = 'DELETE FROM expenses WHERE id = ?';

        try {
            await this.db.executeSql(deleteQuery, [id]);
        } catch (error) {
            console.error('Error deleting expense:', error);
            throw error;
        }
    }

    // Get expenses by category
    async getExpensesByCategory(category: string): Promise<DatabaseExpense[]> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const selectQuery = `
            SELECT * FROM expenses 
            WHERE category = ? 
            ORDER BY created_at DESC
        `;

        try {
            const [result] = await this.db.executeSql(selectQuery, [category]);
            const expenses: DatabaseExpense[] = [];

            for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                expenses.push({
                    id: row.id,
                    name: row.name,
                    amount: row.amount,
                    category: row.category,
                    date: row.date,
                    created_at: row.created_at
                });
            }

            return expenses;
        } catch (error) {
            console.error('Error retrieving expenses by category:', error);
            throw error;
        }
    }

    // Get total amount of all expenses
    async getTotalAmount(): Promise<number> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const sumQuery = 'SELECT SUM(amount) as total FROM expenses';

        try {
            const [result] = await this.db.executeSql(sumQuery);
            const total = result.rows.item(0).total || 0;
            return parseFloat(total.toFixed(2));
        } catch (error) {
            console.error('Error calculating total amount:', error);
            throw error;
        }
    }

    // Get expenses count
    async getExpensesCount(): Promise<number> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const countQuery = 'SELECT COUNT(*) as count FROM expenses';

        try {
            const [result] = await this.db.executeSql(countQuery);
            return result.rows.item(0).count || 0;
        } catch (error) {
            console.error('Error getting expenses count:', error);
            throw error;
        }
    }

    // Bulk insert expenses (for initial dummy data)
    async bulkInsertExpenses(expenses: DatabaseExpense[]): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        try {
            for (const expense of expenses) {
                await this.db.executeSql(
                    'INSERT INTO expenses (id, name, amount, category, date) VALUES (?, ?, ?, ?, ?)',
                    [expense.id, expense.name, expense.amount, expense.category, expense.date]
                );
            }
        } catch (error) {
            console.error('Error bulk inserting expenses:', error);
            throw error;
        }
    }

    // Clear all expenses (for testing)
    async clearAllExpenses(): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        try {
            await this.db.executeSql('DELETE FROM expenses');
        } catch (error) {
            console.error('Error clearing expenses:', error);
            throw error;
        }
    }

    // Close database connection
    async close(): Promise<void> {
        if (this.db) {
            try {
                await this.db.close();
                this.db = null;
            } catch (error) {
                console.error('Error closing database:', error);
            }
        }
    }

    // Check if database is initialized
    isInitialized(): boolean {
        return this.db !== null;
    }
}

// Export singleton instance
export const sqliteDB = new SQLiteDatabase();

// Export helper functions
export const initializeDatabase = async (): Promise<void> => {
    await sqliteDB.init();
};

export const closeDatabase = async (): Promise<void> => {
    await sqliteDB.close();
};

export default sqliteDB;
