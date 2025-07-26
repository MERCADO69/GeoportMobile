import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import GetUserData from '../../Functions/getUserData';
import ChangeEmail from "../../Functions/changeEmail"
import { ActivityIndicator } from 'react-native';


const UpdateEmail = ({ navigation }) => {
  const { control, handleSubmit, watch } = useForm();
  const [userData, setUserData] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [codeValidated,setCodeValidated] = useState(false);
  const changeEmailClass = new ChangeEmail();
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
  const currentEmail = watch('currentEmail');
  const isSendCodeDisabled = !currentEmail?.includes('@')


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

  const getFontSize = (text) => {
    const length = text?.length || 0;
    if (length < 17) return 15;
    if (length < 22) return 14;
    if (length < 40) return 10;
    return 12;
  };
  

  const handleSendCode = async () => {
    if (!watch('currentEmail')) {
      Alert.alert('Error', 'Please enter your current email.');
      return;
    }
    let inputtedOldEmail = watch('currentEmail');
    
    if (inputtedOldEmail != userData.data?.email) {
      Alert.alert('Error', 'Current email does not match.');
      return;
    }
    setCodeValidated(false)
    setIsSending(true); 
    setIsVerified(false)
    try{
    const sendPin = await changeEmailClass.handleSendpin();
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



   async function HandleVerifyPin(val){
    try{
      setIsVerifying(true);
      const verifyPin = await changeEmailClass.handleVerifyPin(val);
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
    }catch(error){
      setVerificationError('Incorrect verification code');
    }finally {
      setIsVerifying(false);
    }
   }



  const onSubmit = async (data) => {
    if (data.newEmail !== data.confirmEmail) {
      Alert.alert('Error', 'New email and confirmation email do not match.');
      return;
    }
    setIsVerified(false)
    const isChangeEmail =  await changeEmailClass.handleChangeEmail(data.newEmail);
    if(!isChangeEmail){
      Alert.alert('Error', 'Failed to update email.');
      return;
    }
    Alert.alert('Success', 'Email updated successfully.');
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
        <Text style={styles.headerText}>Update Email</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Current Email Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Email</Text>
          <View style={styles.row}>
            <Controller
              control={control}
              name="currentEmail"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, {height:55, flex: 1, marginRight: 10,fontSize: getFontSize(value)}]}
                  placeholder="Current email"
                  onChangeText={onChange}
                  maxLength={40}
                  value={value}
                />
              )}
            />
            <TouchableOpacity style={[styles.confirmButton, isSendCodeDisabled && { backgroundColor: '#ccc' } ]} disabled={isSendCodeDisabled} onPress={handleSendCode}>
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
            name= "verificationCode"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder= {isSendCodeDisabled ? "Send code to activate " :"Enter the code"}
                maxLength={6}
                keyboardType="numeric"
                editable={isVerified}
                onChangeText={(val) => {
                  onChange(val);
                  if (val.length === 6){
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

        {/* New Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Email</Text>
          <Controller
            control={control}
            name="newEmail"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="New email"
                onChangeText={onChange}
                value={value}
                editable={codeValidated}
              />
            )}
          />
        </View>

        {/* Confirm Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Email</Text>
          <Controller
            control={control}
            name="confirmEmail"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Confirm new email"
                onChangeText={onChange}
                value={value}
                editable={codeValidated}
              />
            )}
          />
        </View>
      </View>

      {/* Submit */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity style={[
          styles.confirmButton,
          (!codeValidated || watch('confirmEmail') !== watch('newEmail')) && {
            backgroundColor: '#ccc',
          },
        ]}
        disabled={!codeValidated || watch('confirmEmail') !== watch('newEmail')}
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

export default UpdateEmail;
