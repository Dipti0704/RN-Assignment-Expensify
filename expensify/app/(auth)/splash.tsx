import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { Colors, FontSizes } from '../../constants/theme';

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expensify+</Text>
      <Text style={styles.subtitle}>Smart expense insights</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.white
  },
  subtitle: {
    marginTop: 8,
    fontSize: FontSizes.md,
    color: Colors.primaryLight
  }
});
