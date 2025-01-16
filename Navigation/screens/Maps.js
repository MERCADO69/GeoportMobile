import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import SearchIcon from '../../Images/search.svg';

export default function MapsScreen() {
  const [isSmartTraveling, setIsSmartTraveling] = useState(false);
  const [searchText, setSearchText] = useState('');

  const toggleSmartRerouting = () => {
    setIsSmartTraveling(!isSmartTraveling);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <SafeAreaView style={styles.searchContainer}>
        <View style={styles.iconContainer}>
          <SearchIcon width={25} height={35} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search a place around Malaybalay"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          textAlign="left" 
        />
      </SafeAreaView>

      {/* Status Message */}
      {isSmartTraveling && (
        <Text style={styles.statusMessage}>You are now smart traveling</Text>
      )}

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={toggleSmartRerouting}>
        <Text style={styles.buttonText}>
          {isSmartTraveling ? 'Disable Smart Rerouting' : 'Enable Smart Rerouting'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  searchContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10, // Space for padding inside the container
    marginTop: 20,
    backgroundColor: '#f9f9f9',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10, // Space between icon and input text
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins_400Regular',
    paddingLeft: 5, 
    textAlign: 'left', 
    
  },
  statusMessage: {
    color: 'green',
    fontSize: 14,
    marginBottom: 545,
    fontFamily: 'Poppins_500Medium',
  },
  button: {
    backgroundColor: '#FA812F',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '90%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
  },
});
