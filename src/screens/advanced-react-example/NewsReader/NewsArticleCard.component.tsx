
import { NewsArticleProps } from './NewReaders.types';
import styles from './NewsReader.style';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';

const NewsArticle = ({ article }: NewsArticleProps) => {
    const handleCardPress = () => {
        Linking.openURL(article.url).catch(err => console.error('Failed to open URL:', err));
    };

    return (
        <TouchableOpacity style={styles.cardContainer} onPress={handleCardPress}>
            <Image
                source={{ uri: article.urlToImage }}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.contentContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    {article.title}
                </Text>
                <Text style={styles.description} numberOfLines={3}>
                    {article.description}
                </Text>
                <View style={styles.metaContainer}>
                    <Text style={styles.author}>{article.author}</Text>
                    <Text style={styles.publishedDate}>
                        {new Date(article.publishedAt).toLocaleDateString()}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default NewsArticle;