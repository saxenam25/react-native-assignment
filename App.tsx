
import { Platform, StatusBar, StyleSheet, useColorScheme, SafeAreaView } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/core/navigation/DynamicNavigation';


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
       <SafeAreaView style={styles.AndroidSafeArea}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
