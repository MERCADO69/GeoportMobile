import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import GetUserData from '../../Functions/getUserData';
import changeNumber from "../../Functions/changePhoneNumber" 

const UpdatePhoneScreen = ({ navigation }) => {
  const { control, handleSubmit, watch } = useForm();
  const [userData, setUserData] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [codeValidated, setCodeValidated] = useState(false);
  const changePhoneClass = new changeNumber();
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });

  const verificationCode = watch('verificationCode');
  const currentPhone = watch('currentPhone');
  const isSendCodeDisabled = !currentPhone?.includes('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await GetUserData();
        if (data) setUserData(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data.');
      }
    };
    fetchUserData();
  }, []);

  const handleSendCode = async () => {
    if (!watch('currentPhone')) {
      Alert.alert('Error', 'Please enter your current phone number.');
      return;
    }
    let inputtedOldPhone = watch('currentPhone');
    
    if (inputtedOldPhone != userData.data?.contactNumber) {
      Alert.alert('Error', 'Current phone number does not match.');
      return;
    }
    setCodeValidated(false)
    setIsSending(true); 
    setIsVerified(false)
    try{
      const sendPin = await changePhoneClass.handleSendpin();
      if(!sendPin){
        Alert.alert('Error', 'Failed to send verification code.');
        return;
      }
      setIsVerified(true);
    }catch(error){
      console.error('Error in sending pin ',error);
      Alert.alert('Error', 'Failed to send verification code.');
    } finally {
      setIsSending(false); 
    }
  };

  async function HandleVerifyPin(val) {
    try{
      setIsVerifying(true);
      const verifyPin = await changePhoneClass.handleVerifyPin(val);
      if(!verifyPin){
        setVerificationError('Incorrect verification code');
        setIsSuccess(false);
        setIsVerified(true);
        return;
      }
      setVerificationError("You're all set! Verification complete.");
      setIsVerified(false);
      setIsSuccess(true);
      setCodeValidated(true)
    } catch(error) {
      setVerificationError('Incorrect verification code');
    } finally {
      setIsVerifying(false);
    }
  }

  const onSubmit = async (data) => {
    if (data.newPhone !== data.confirmPhone) {
      Alert.alert('Error', 'New phone and confirmation phone do not match.');
      return;
    }
    setIsVerified(false)
    const isChangePhone = await changePhoneClass.changePhoneNumber(data.newPhone);
    if (!isChangePhone) {
      Alert.alert('Error', 'Failed to update phone.');
      return;
    }
    Alert.alert('Success', 'Phone updated successfully.');
    navigation.goBack();
  };

  if (!fontsLoaded) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Update Phone Number</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Current Phone Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Phone</Text>
          <View style={styles.row}>
            <Controller
              control={control}
              name="currentPhone"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, { height: 55, flex: 1, marginRight: 10, fontSize: 15 }]}
                  placeholder="Current phone"
                  onChangeText={onChange}
                  maxLength={40}
                  value={value}
                />
              )}
            />
            <TouchableOpacity 
              style={[styles.confirmButton, isSendCodeDisabled && { backgroundColor: '#ccc' }]} 
              disabled={isSendCodeDisabled} 
              onPress={handleSendCode}
            >
              <View style={{ width: 80, alignItems: 'center' }}>
                {isSending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.sendCodeText}>Send Code</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Verification Code */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Verification Code</Text>
          <Controller
            control={control}
            name="verificationCode"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Enter the code"
                maxLength={6}
                keyboardType="numeric"
                editable={isVerified}
                onChangeText={(val) => {
                  onChange(val);
                  if (val.length === 6) {
                    HandleVerifyPin(val);
                  }
                }}
                value={value}
              />
            )}
          />
          {isVerifying && (
            <ActivityIndicator style={{ marginTop: 10 }} size="small" color="#FF7F00" />
          )}
          {verificationError !== '' && (
            <Text style={{ color: isSuccess ? 'green' : 'red', marginTop: 8 }}>
              {verificationError}
            </Text>
          )}
        </View>

        {/* New Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Phone</Text>
          <Controller
            control={control}
            name="newPhone"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="New phone"
                onChangeText={onChange}
                value={value}
                editable={codeValidated}
              />
            )}
          />
        </View>

        {/* Confirm New Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Phone</Text>
          <Controller
            control={control}
            name="confirmPhone"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Confirm new phone"
                onChangeText={onChange}
                value={value}
                editable={codeValidated}
              />
            )}
          />
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.confirmButton, (!codeValidated || watch('confirmPhone') !== watch('newPhone')) && { backgroundColor: '#ccc' }]} 
          disabled={!codeValidated || watch('confirmPhone') !== watch('newPhone')} 
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.confirmButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { padding: 4 },
  headerText: {
    fontSize: 20,
    marginLeft: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  formContainer: { paddingHorizontal: 20, marginTop: 20 },
  inputGroup: { marginBottom: 20 },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Poppins_500Medium',
    fontSize: 15,
  },
  buttonContainer: { marginTop: 'auto', padding: 20 },
  confirmButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#FF7F00',
  },
  confirmButtonText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  sendCodeText: {
    color: '#fff',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
});

export default UpdatePhoneScreen;
