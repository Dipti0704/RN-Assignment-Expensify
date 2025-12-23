import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSizes } from '../../constants/theme';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: FontSizes.lg,
    color: Colors.black,
  },
});