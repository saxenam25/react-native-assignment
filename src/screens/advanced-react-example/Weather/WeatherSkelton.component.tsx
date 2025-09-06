import { View } from "react-native";
import styles from './Weather.style';

const WeatherSkelton = () => {
    console.log("🚀 ~ Rendering WeatherSkelton");
    return (
        <View style={styles.container}>
            <View style={styles.currentWeather}>
                {/* Skeleton Weather Header */}
                <View style={styles.weatherHeader}>
                    <View style={[styles.skeleton, styles.skeletonTemp]} />
                    <View style={[styles.skeleton, styles.skeletonCondition]} />
                    <View style={[styles.skeleton, styles.skeletonDescription]} />
                </View>

                {/* Skeleton Temperature Details */}
                <View style={styles.mainDataContainer}>
                    <View style={[styles.skeleton, styles.skeletonSectionTitle]} />
                    <View style={styles.dataGrid}>
                        {[1, 2, 3, 4, 5].map((item) => (
                            <View key={item} style={styles.dataItem}>
                                <View style={[styles.skeleton, styles.skeletonDataLabel]} />
                                <View style={[styles.skeleton, styles.skeletonDataValue]} />
                            </View>
                        ))}
                    </View>
                </View>

                {/* Skeleton Additional Information */}
                <View style={styles.additionalInfo}>
                    <View style={[styles.skeleton, styles.skeletonSectionTitle]} />
                    {[1, 2, 3, 4].map((item) => (
                        <View key={item} style={styles.infoRow}>
                            <View style={[styles.skeleton, styles.skeletonInfoLabel]} />
                            <View style={[styles.skeleton, styles.skeletonInfoValue]} />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default WeatherSkelton;