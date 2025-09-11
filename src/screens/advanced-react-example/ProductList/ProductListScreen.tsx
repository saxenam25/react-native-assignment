// Create a product list screen, fetching products from a dummy json mock api, with loading and error handling, using the useFetch hook. Each product should have a name, description, price, and image. Display the products in a scrollable list with proper styling, use FlatList for better performance. Also implement infinite scrolling to load more products as the user scrolls down. load 20 products at a time. ON bottom create a tabbar with two button, one for filter and one for sort. The filter button should open a modal allowing users to filter products by price range and category. The sort button should open a modal allowing users to sort products by price (low to high, high to low) and by name (A-Z, Z-A). Ensure the modals are user-friendly and easy to navigate. Use TypeScript for type safety and ensure the code is clean and well-organized.
import React, { useState, useEffect, useCallback } from 'react';
import { 
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    Alert,
    SafeAreaView
} from 'react-native';
import useFetch from '../../../shared/hooks/useFetch';
import styles from './Product.style';
import { Product } from './Product.interface';

const PRODUCTS_API_URL = 'https://fakestoreapi.com/products';
const PRODUCTS_PER_PAGE = 20;

const ProductListScreen: React.FC = () => {
    const [page, setPage] = useState(1);
    const [allProducts, setAllProducts] = useState<Product[]>([]); // Store all fetched products
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Store filtered/sorted products
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [isSortModalVisible, setSortModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [sortOption, setSortOption] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Prevent multiple requests
    const { data, loading, error } = useFetch<Product[]>(`${PRODUCTS_API_URL}?limit=${PRODUCTS_PER_PAGE}&page=${page}`, '', { delayApiInterval: 1000 });

    // Add new products to allProducts when data is fetched
    useEffect(() => {
        if (data) {
            setAllProducts(prevProducts => [...prevProducts, ...data]);
            setIsLoadingMore(false); // Reset loading state after data is loaded
        }
    }, [data]);

    // Apply filters and sorting whenever allProducts or filters change
    useEffect(() => {
        let filtered = [...allProducts];
        
        // Apply category filter
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }
        
        // Apply price range filter
        filtered = filtered.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);
        
        // Apply sorting
        if (sortOption) {
            filtered.sort((a, b) => {
                switch (sortOption) {
                    case 'priceLowToHigh':
                        return a.price - b.price;
                    case 'priceHighToLow':
                        return b.price - a.price;
                    case 'nameAtoZ':
                        return a.title.localeCompare(b.title);
                    case 'nameZtoA':
                        return b.title.localeCompare(a.title);
                    default:
                        return 0;
                }
            });
        }
        
        setFilteredProducts(filtered);
        console.log("🚀 ~ filtered:", filtered)
    }, [allProducts, selectedCategory, priceRange, sortOption]);

    const loadMoreProducts = () => {
        if (!isLoadingMore && !loading) { // Prevent multiple requests
            setIsLoadingMore(true);
            setPage(prevPage => prevPage + 1);
        }
    };

    const renderProductItem = ({ item }: { item: Product }) => (
        <View style={styles.productItem}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productCategory}>{item.category}</Text>
                <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
                <View style={styles.productRating}>
                    <Text style={styles.ratingText}>★ {item.rating.rate.toFixed(1)}</Text>
                    <Text style={styles.ratingCount}>({item.rating.count} reviews)</Text>
                </View>
                <Text style={styles.productPrice}>${item.price}</Text>
            </View>
        </View>
    );

    const resetFilters = () => {
        setSelectedCategory(null);
        setPriceRange([0, 1000]);
        setSortOption(null);
    };    if (loading && page === 1) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>Error fetching products</Text>
            </View>
        );
    }
    return (
        <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.5}
            ListFooterComponent={(loading || isLoadingMore) && page > 1 ? <ActivityIndicator style={{ paddingVertical: 20 }} /> : null}
        />
    );
};

export default ProductListScreen;
