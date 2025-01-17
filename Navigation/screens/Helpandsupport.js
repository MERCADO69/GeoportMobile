import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';

const HelpSupportScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const [expandedQuestion, setExpandedQuestion] = useState(null);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const toggleQuestion = (questionIndex) => {
    setExpandedQuestion(expandedQuestion === questionIndex ? null : questionIndex);
  };

  const questions = [
    {
      question: 'How to report a car collision?',
      answer: 'You can report a car collision by selecting the "Report Incident" option on the app and providing the necessary details such as location, description, and photos of the collision.',
    },
    {
      question: 'How to check ongoing road repairs in my area?',
      answer: 'Go to the "Road Issues" section in the app to view a map of ongoing repairs and updates in your area.',
    },
    {
      question: 'Emergency Contact Numbers',
      answer: 'In case of emergencies, call the provided hotline numbers listed in the app for immediate assistance.',
    },
    {
      question: 'How to attach photos to reports?',
      answer: 'While submitting a report, tap the "Attach Photo" button to upload images from your device or take a new photo.',
    },
    {
      question: 'How to track my reported incident?',
      answer: 'Go to the "My Reports" section to view the status of your submitted reports and any updates from authorities.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Help and Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.emergencyContainer}>
          <Text style={styles.emergencyText}>
            In case of Emergency{''} {'\n'}Call (088) 813 3611 immediately
            
          </Text>
        </View>

        {questions.map((item, index) => (
          <View key={index} style={styles.questionContainer}>
            <TouchableOpacity onPress={() => toggleQuestion(index)}>
              <Text style={styles.questionText}>{item.question}</Text>
            </TouchableOpacity>
            {expandedQuestion === index && (
              <Text style={styles.answerText}>{item.answer}</Text>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.viewReportsButton}>
          <Text style={styles.viewReportsText}>View my reports</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 16,
    marginLeft: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  scrollView: {
    padding: 16,
  },
  emergencyContainer: {
    backgroundColor: '#FFECEC',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  emergencyText: {
    color: '#FF4D4D',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  questionContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  questionText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#333',
  },
  answerText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },
  viewReportsButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FF7143',
    borderRadius: 8,
    alignItems: 'center',
  },
  viewReportsText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#fff',
  },
});

export default HelpSupportScreen;
