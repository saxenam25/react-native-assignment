// Create a product list screen, fetching products from a dummy json mock api, with loading and error handling, using the useFetch hook. Each product should have a name, description, price, and image. Display the products in a scrollable list with proper styling, use FlatList for better performance. Also implement infinite scrolling to load more products as the user scrolls down. load 20 products at a time. ON bottom create a tabbar with two button, one for filter and one for sort. The filter button should open a modal allowing users to filter products by price range and category. The sort button should open a modal allowing users to sort products by price (low to high, high to low) and by name (A-Z, Z-A). Ensure the modals are user-friendly and easy to navigate. Use TypeScript for type safety and ensure the code is clean and well-organized.
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Modal, ActivityIndicator, SafeAreaView, TextInput, ScrollView } from 'react-native';
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
    const [appliedProductName, setAppliedProductName] = useState(''); // Applied product name filter
    const [appliedRating, setAppliedRating] = useState<number | null>(null); // Applied rating filter
    
    // Filter states
    const [filterProductName, setFilterProductName] = useState('');
    const [filterPriceMin, setFilterPriceMin] = useState('0');
    const [filterPriceMax, setFilterPriceMax] = useState('1000');
    const [filterCategory, setFilterCategory] = useState<string | null>(null);
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    
    const { data, loading, error } = useFetch<Product[]>(`${PRODUCTS_API_URL}?limit=${PRODUCTS_PER_PAGE}&page=${page}`, '', { delayApiInterval: 1000 });

    // Add new products to allProducts when data is fetched
    useEffect(() => {
        if (data) {
            setAllProducts(prevProducts => [...prevProducts, ...data]);
            setIsLoadingMore(false); // Reset loading state after data is loaded
        }
    }, [data]);

    // Extract available categories from all products
    useEffect(() => {
        const categories = [...new Set(allProducts.map(product => product.category))];
        setAvailableCategories(categories);
    }, [allProducts]);

    // Apply filters and sorting whenever allProducts or filters change
    useEffect(() => {
        let filtered = [...allProducts];
        
        // Apply product name filter
        if (appliedProductName.trim()) {
            filtered = filtered.filter(product => 
                product.title.toLowerCase().includes(appliedProductName.toLowerCase())
            );
        }
        
        // Apply category filter
        if (selectedCategory) {
            filtered = filtered.filter(product => product.category === selectedCategory);
        }
        
        // Apply price range filter
        const minPrice = priceRange[0];
        const maxPrice = priceRange[1];
        filtered = filtered.filter(product => 
            product.price >= minPrice && product.price <= maxPrice
        );
        
        // Apply rating filter
        if (appliedRating !== null) {
            filtered = filtered.filter(product => product.rating.rate >= appliedRating);
        }
        
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
    }, [allProducts, selectedCategory, priceRange, sortOption, appliedProductName, appliedRating]);

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
        setFilterProductName('');
        setFilterPriceMin('0');
        setFilterPriceMax('1000');
        setFilterCategory(null);
        setFilterRating(null);
        setAppliedProductName('');
        setAppliedRating(null);
    };

    const applyFilters = () => {
        // Apply the filter values to the actual filter states
        setSelectedCategory(filterCategory);
        setPriceRange([parseFloat(filterPriceMin) || 0, parseFloat(filterPriceMax) || 1000]);
        setAppliedProductName(filterProductName);
        setAppliedRating(filterRating);
        setFilterModalVisible(false);
    };

    const clearSearch = () => {
        resetFilters();
    };

    const renderNoProductsFound = () => (
        <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No product found</Text>
            <Text style={styles.noProductsSubText}>Search again.</Text>
            <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
                <Text style={styles.clearSearchButtonText}>Clear Search</Text>
            </TouchableOpacity>
        </View>
    );

    const renderFilterModal = () => (
        <Modal
            visible={isFilterModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setFilterModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Modal Header with Close Button */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filter Options</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setFilterModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Product Name Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Product Name</Text>
                            <TextInput
                                style={styles.filterInput}
                                placeholder="Search by product name..."
                                placeholderTextColor="#999"
                                value={filterProductName}
                                onChangeText={setFilterProductName}
                            />
                        </View>

                        {/* Price Range Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Price Range</Text>
                            <View style={styles.priceRangeContainer}>
                                <View style={styles.priceInputContainer}>
                                    <Text style={styles.priceInputLabel}>Min Price</Text>
                                    <TextInput
                                        style={styles.priceInput}
                                        placeholder="0"
                                        placeholderTextColor="#999"
                                        value={filterPriceMin}
                                        onChangeText={setFilterPriceMin}
                                        keyboardType="numeric"
                                        returnKeyType="done"
                                    />
                                </View>
                                <Text style={styles.priceRangeSeparator}>to</Text>
                                <View style={styles.priceInputContainer}>
                                    <Text style={styles.priceInputLabel}>Max Price</Text>
                                    <TextInput
                                        style={styles.priceInput}
                                        placeholder="1000"
                                        placeholderTextColor="#999"
                                        value={filterPriceMax}
                                        onChangeText={setFilterPriceMax}
                                        keyboardType="numeric"
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Category Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Category</Text>
                            <View style={styles.categoryContainer}>
                                <TouchableOpacity
                                    style={[styles.categoryChip, !filterCategory && styles.categoryChipSelected]}
                                    onPress={() => setFilterCategory(null)}
                                >
                                    <Text style={[styles.categoryChipText, !filterCategory && styles.categoryChipTextSelected]}>
                                        All Categories
                                    </Text>
                                </TouchableOpacity>
                                {availableCategories.map((category) => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[styles.categoryChip, filterCategory === category && styles.categoryChipSelected]}
                                        onPress={() => setFilterCategory(category)}
                                    >
                                        <Text style={[styles.categoryChipText, filterCategory === category && styles.categoryChipTextSelected]}>
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Rating Filter */}
                        <View style={styles.filterSection}>
                            <Text style={styles.filterLabel}>Minimum Rating</Text>
                            <View style={styles.ratingContainer}>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                    <TouchableOpacity
                                        key={rating}
                                        style={[styles.ratingChip, filterRating === rating && styles.ratingChipSelected]}
                                        onPress={() => setFilterRating(filterRating === rating ? null : rating)}
                                    >
                                        <Text style={[styles.ratingChipText, filterRating === rating && styles.ratingChipTextSelected]}>
                                            {rating}★+
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Action Buttons */}
                    <View style={styles.modalActions}>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={resetFilters}
                        >
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.confirmButton}
                            onPress={applyFilters}
                        >
                            <Text style={styles.confirmButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );    if (loading && page === 1) {
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
        <SafeAreaView style={styles.container}>
            {filteredProducts.length === 0 && !loading && allProducts.length > 0 ? (
                renderNoProductsFound()
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProductItem}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    onEndReached={loadMoreProducts}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={(loading || isLoadingMore) && page > 1 ? <ActivityIndicator style={{ paddingVertical: 20 }} /> : null}
                    style={styles.flatList}
                />
            )}
            
            {/* Bottom Tab Bar */}
            <View style={styles.bottomTabBar}>
                <TouchableOpacity 
                    style={styles.tabButton} 
                    onPress={() => setFilterModalVisible(true)}
                >
                    <Text style={styles.tabButtonText}>Filter</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.tabButton} 
                    onPress={() => setSortModalVisible(true)}
                >
                    <Text style={styles.tabButtonText}>Sort</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Modal */}
            {renderFilterModal()}
        </SafeAreaView>
    );
};

export default ProductListScreen;
