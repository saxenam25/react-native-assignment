
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import useFetch from '../../core/hooks/useFetch';
import { NewsApiResponse } from './NewReaders.types';
import styles from './NewsReader.style';
import NewsArticle from './NewsArticleCard.component';
import asyncStorage from '../../core/asyncStorage';


const date = new Date();
date.setDate(date.getDate() - 20);
const formattedDate = date.toISOString().split('T')[0];
console.log("🚀 ~ formattedDate:", formattedDate)

const NewsReaderScreen = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [allArticles, setAllArticles] = useState<any[]>([]);

    // Build URL with current page
    const params = new URLSearchParams({
        q: 'tesla',
        pageSize: '10',
        page: currentPage.toString(),
        from: formattedDate,
        sortBy: 'publishedAt',
        apiKey: '18a22c86e92147cb908aab0873474127'
    });

    const getNewsURL = `https://newsapi.org/v2/everything?${params.toString()}`;

    const { data, loading, error } = useFetch<NewsApiResponse>(getNewsURL, `newsArticles_page_${currentPage}`);

    // Update articles when new data is fetched
    React.useEffect(() => {
        if (data?.articles) {
            if (currentPage === 1) {
                // First page or refresh - replace all articles
                setAllArticles(data.articles);
            } else {
                // Subsequent pages - append to existing articles
                setAllArticles(prevArticles => [...prevArticles, ...data.articles]);
            }
        }
        // Stop refreshing indicator when data is loaded
        if (refreshing) {
            setRefreshing(false);
        }
    }, [data, currentPage]);

    // Pull to refresh handler - resets to page 1
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setCurrentPage(1);
        setAllArticles([]); // Clear existing articles
    }, []);

    // Load more data when reaching bottom - loads next page
    const loadMoreData = useCallback(() => {
        if (!loading && !refreshing) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    }, [loading, refreshing]);

    // Clear all cache data
    const clearCacheData = useCallback(async () => {
        try {
            await asyncStorage.clearAllData(); // Clear all async storage data
            // Reset state
            setAllArticles([]);
            setCurrentPage(1);
            // Force refresh
            setRefreshing(true);
            console.log('Cache cleared successfully');
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }, [currentPage]);

    // Header component
    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Top Headlines</Text>
            {/* <TouchableOpacity style={styles.clearCacheButton} onPress={clearCacheData}>
                <Text style={styles.clearCacheText}>Clear Cache</Text>
            </TouchableOpacity> */}
        </View>
    );

    if (loading && currentPage === 1 && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading news...</Text>
            </View>
        );
    }

    if (error && currentPage === 1) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error loading news: {error.message}</Text>
            </View>
        );
    }

    const renderFooter = () => {
        if (loading && currentPage > 1 && !refreshing) {
            return (
                <View style={styles.footerLoader}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.footerText}>Loading more articles...</Text>
                </View>
            );
        }
        // Always render some bottom space for better UX
        return <View style={{ height: 50 }} />;
    };

    return (
        <View style={{ flex: 1 }}>
            {renderHeader()}
            <FlatList
                data={allArticles}
                renderItem={({ item }) => <NewsArticle article={item} />}
                keyExtractor={(item, index) => `${item.url}-${index}`}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={true}
                onEndReached={loadMoreData}
                onEndReachedThreshold={0.3}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#007AFF']} // Android
                        tintColor="#007AFF" // iOS
                        title="Refreshing news..."
                        titleColor="#007AFF"
                    />
                }
            />
        </View>
    );
};

export default NewsReaderScreen;