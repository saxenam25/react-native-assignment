
import { Platform, StatusBar, StyleSheet, useColorScheme, SafeAreaView } from 'react-native';
import NavigationWithNestedItem from './src/core/navigation/NavigationWithNestedItems';
import LoginScreen from './src/screens/advanced-react-example/Login/LoginScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      {/* <Text style={styles.text}>Welcome to react native!</Text> */}
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* <Navigation /> */}
      {/* <NavigationWithNestedItem /> */}
      <LoginScreen></LoginScreen>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 40,
  },
  text: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
  },
  statusBar: {
    backgroundColor: '#fff',
    height: StatusBar.currentHeight
  },
});

export default App;
