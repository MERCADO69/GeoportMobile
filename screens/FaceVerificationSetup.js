import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, SafeAreaView } from 'react-native';
import SendCode from "../Functions/SendCodeFunction"
import ValidateCode from "../Functions/validateImage"
import Timer from "../utils/Functions/timer"




export default function FinishSetup (){
    const [phoneNumber,setPhoneNumber] = useState('')
    const [loading,setLoading] = useState(true)
    const [valid,setValid] = useState(true)
    const [time,setTime] = useState('')

    function HandleFinishSetup(){


    }

    async function HandleSendCode(){
        setLoading(true)
        SendCode()
       
    }

    function HandleValidateCode(){
        ValidateCode()
    }



    function PhonenumberValidator(phoneNumber){
        if(phoneNumber.length === 11){
            setLoading(false)
        }
        return
    }

    
    
    return(
         <SafeAreaView style={styles.safeContainer}>
             <View style={styles.container}>
                        <View>
                                <Text style={styles.label}>Mobile Number</Text>
                                <TextInput
                                    style={styles.input}
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                    maxLength={11}
                                    placeholder="Enter Mobile Number"
                                />
                                <TouchableOpacity style={styles.button} disabled={loading} onPress={() => HandleSendCode}>
                                    <Text style={styles.buttonText}>Send Code</Text>
                                </TouchableOpacity>
                    </View>

                    
                    <TouchableOpacity style={styles.button} disabled={valid} onPress={() => Alert.alert("Setup Complete")}>
                        <Text style={styles.buttonText}>Finish Setup</Text>
                    </TouchableOpacity>
             </View>
           </SafeAreaView>
    )
}