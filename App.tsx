import {StyleSheet, View} from 'react-native';

export default function App() {
  // eslint-disable-next-line react/react-in-jsx-scope
  return <View style={styles.container} />;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
