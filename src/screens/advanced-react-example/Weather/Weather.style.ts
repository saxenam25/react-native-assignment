import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#d32f2f',
        textAlign: 'center',
        lineHeight: 24,
    },
    currentWeather: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    weatherHeader: {
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    currentTemp: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 4,
    },
    currentCondition: {
        fontSize: 20,
        color: '#666',
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 16,
        color: '#888',
        textTransform: 'capitalize',
    },
    mainDataContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    dataGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    dataItem: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        alignItems: 'center',
    },
    dataLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        textAlign: 'center',
    },
    dataValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    additionalInfo: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    // Skeleton styles
    skeleton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    },
    skeletonTemp: {
        width: 120,
        height: 48,
        marginBottom: 4,
    },
    skeletonCondition: {
        width: 100,
        height: 20,
        marginBottom: 4,
    },
    skeletonDescription: {
        width: 150,
        height: 16,
    },
    skeletonSectionTitle: {
        width: 140,
        height: 18,
        marginBottom: 12,
        alignSelf: 'center',
    },
    skeletonDataLabel: {
        width: 60,
        height: 12,
        marginBottom: 4,
    },
    skeletonDataValue: {
        width: 40,
        height: 16,
    },
    skeletonInfoLabel: {
        width: 80,
        height: 14,
    },
    skeletonInfoValue: {
        width: 100,
        height: 14,
    },
});
export default styles;