import { View, Text, StyleSheet } from 'react-native';

export default function Records() {
  return (
    <View style={styles.container}>
      <Text>Records</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
