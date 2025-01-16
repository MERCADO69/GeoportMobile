import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Morescreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} onPress={() => navigation.navigate('Home')}>
        More
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});
