import RNFS from 'react-native-fs';
import { Alert } from 'react-native';
import { Expense } from './ExpenseData';

interface BackupData {
    version: string;
    timestamp: string;
    totalExpenses: number;
    appName: string;
    expenses: {
        id: string;
        name: string;
        amount: number;
        category: string;
        date: string;
    }[];
}

class ExpenseFileManager {
    private fileName = 'expenses_backup.json';
    private filePath = `${RNFS.DocumentDirectoryPath}/${this.fileName}`;

    // Save expenses to file system
    async backupExpensesToFile(expenses: Expense[]): Promise<boolean> {
        try {
            if (expenses.length === 0) {
                Alert.alert('No Data', 'No expenses to backup');
                return false;
            }

            const backupData: BackupData = {
                version: '1.0',
                timestamp: new Date().toISOString(),
                totalExpenses: expenses.length,
                appName: 'Expense Tracker',
                expenses: expenses.map(expense => ({
                    id: expense.id,
                    name: expense.name,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date.toISOString()
                }))
            };

            const jsonString = JSON.stringify(backupData, null, 2);
            await RNFS.writeFile(this.filePath, jsonString, 'utf8');
            
            // Get file info for confirmation
            const fileInfo = await RNFS.stat(this.filePath);
            const fileSizeKB = (fileInfo.size / 1024).toFixed(2);
            
            Alert.alert(
                'Backup Successful ✅',
                `${expenses.length} expenses backed up successfully!\n\n` +
                `📁 File: ${this.fileName}\n` +
                `💾 Size: ${fileSizeKB} KB\n` +
                `📅 Created: ${new Date().toLocaleString()}`,
                [{ text: 'OK' }]
            );
            
            return true;
        } catch (error) {
            console.error('Error backing up expenses:', error);
            Alert.alert(
                'Backup Failed ❌', 
                'Could not save expenses to file.\n\n' +
                'Please check device storage and permissions.',
                [{ text: 'OK' }]
            );
            return false;
        }
    }

    // Restore expenses from file system
    async restoreExpensesFromFile(): Promise<Expense[] | null> {
        try {
            // Check if backup file exists
            const fileExists = await RNFS.exists(this.filePath);
            if (!fileExists) {
                Alert.alert(
                    'No Backup Found 📂', 
                    'No backup file found to restore from.\n\n' +
                    'Please create a backup first using the backup feature.',
                    [{ text: 'OK' }]
                );
                return null;
            }

            // Read file content
            const fileContent = await RNFS.readFile(this.filePath, 'utf8');
            const backupData: BackupData = JSON.parse(fileContent);

            // Validate backup data structure
            if (!backupData.expenses || !Array.isArray(backupData.expenses)) {
                throw new Error('Invalid backup file format');
            }

            // Convert back to Expense objects
            const restoredExpenses: Expense[] = backupData.expenses.map((expense) => ({
                id: expense.id,
                name: expense.name,
                amount: expense.amount,
                category: expense.category,
                date: new Date(expense.date)
            }));

            Alert.alert(
                'Restore Successful ✅',
                `${restoredExpenses.length} expenses restored successfully!\n\n` +
                `📅 Backup Date: ${new Date(backupData.timestamp).toLocaleString()}\n` +
                `📊 Version: ${backupData.version}\n` +
                `💰 Total Expenses: ${restoredExpenses.length}`,
                [{ text: 'OK' }]
            );

            return restoredExpenses;
        } catch (error) {
            console.error('Error restoring expenses:', error);
            Alert.alert(
                'Restore Failed ❌', 
                'Could not restore expenses from backup file.\n\n' +
                'The backup file may be corrupted or in an invalid format.',
                [{ text: 'OK' }]
            );
            return null;
        }
    }

    // Get backup file information
    async getBackupInfo(): Promise<{
        exists: boolean;
        size?: number;
        lastModified?: Date;
        totalExpenses?: number;
        version?: string;
    } | null> {
        try {
            const fileExists = await RNFS.exists(this.filePath);
            if (!fileExists) {
                return { exists: false };
            }

            const stat = await RNFS.stat(this.filePath);
            
            // Try to read backup data for additional info
            try {
                const fileContent = await RNFS.readFile(this.filePath, 'utf8');
                const backupData: BackupData = JSON.parse(fileContent);
                
                return {
                    exists: true,
                    size: stat.size,
                    lastModified: new Date(stat.mtime),
                    totalExpenses: backupData.totalExpenses,
                    version: backupData.version
                };
            } catch {
                // If can't parse backup data, return basic info
                return {
                    exists: true,
                    size: stat.size,
                    lastModified: new Date(stat.mtime)
                };
            }
        } catch (error) {
            console.error('Error getting backup info:', error);
            return null;
        }
    }

    // Delete backup file
    async deleteBackupFile(): Promise<boolean> {
        try {
            const fileExists = await RNFS.exists(this.filePath);
            if (!fileExists) {
                Alert.alert(
                    'No Backup Found 📂',
                    'No backup file exists to delete.',
                    [{ text: 'OK' }]
                );
                return false;
            }

            // Get file info before deletion
            const backupInfo = await this.getBackupInfo();
            
            Alert.alert(
                'Delete Backup ⚠️',
                `Are you sure you want to delete the backup?\n\n` +
                `📁 File: ${this.fileName}\n` +
                `💾 Size: ${backupInfo?.size ? (backupInfo.size / 1024).toFixed(2) + ' KB' : 'Unknown'}\n` +
                `📅 Created: ${backupInfo?.lastModified?.toLocaleString() || 'Unknown'}\n` +
                `📊 Expenses: ${backupInfo?.totalExpenses || 'Unknown'}\n\n` +
                `This action cannot be undone!`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await RNFS.unlink(this.filePath);
                                Alert.alert(
                                    'Backup Deleted ✅',
                                    'Backup file has been successfully deleted.',
                                    [{ text: 'OK' }]
                                );
                            } catch (error) {
                                console.error('Error deleting backup:', error);
                                Alert.alert(
                                    'Delete Failed ❌',
                                    'Could not delete backup file.',
                                    [{ text: 'OK' }]
                                );
                            }
                        }
                    }
                ]
            );

            return true;
        } catch (error) {
            console.error('Error deleting backup:', error);
            Alert.alert(
                'Delete Failed ❌',
                'Could not delete backup file.',
                [{ text: 'OK' }]
            );
            return false;
        }
    }

    // Get backup file path for sharing or external access
    getBackupFilePath(): string {
        return this.filePath;
    }

    // Get backup file name
    getBackupFileName(): string {
        return this.fileName;
    }

    // Check if backup exists
    async hasBackup(): Promise<boolean> {
        try {
            return await RNFS.exists(this.filePath);
        } catch (error) {
            console.error('Error checking backup existence:', error);
            return false;
        }
    }

    // Validate backup file
    async validateBackupFile(): Promise<boolean> {
        try {
            const fileExists = await RNFS.exists(this.filePath);
            if (!fileExists) return false;

            const fileContent = await RNFS.readFile(this.filePath, 'utf8');
            const backupData: BackupData = JSON.parse(fileContent);

            // Check required fields
            return !!(
                backupData.version &&
                backupData.timestamp &&
                backupData.expenses &&
                Array.isArray(backupData.expenses)
            );
        } catch (error) {
            console.error('Error validating backup file:', error);
            return false;
        }
    }
}

// Export singleton instance
export default new ExpenseFileManager();
