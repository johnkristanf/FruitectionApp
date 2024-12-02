import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, Alert, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import SignupForm from '@/components/auth/SignupForm';
import { Link, router } from 'expo-router';

export default function SignupPage() {
    const [isSignup, setIsSignup] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isSignup == "success") {
            Alert.alert(
                "Success",
                "Sign up Successfully",
                [
                    {
                        text: "Procced now to Login",
                        onPress: () => router.replace("/login"),
                    },
                ],
                { cancelable: false }
            );

        } else if (isSignup == "email_taken") {
            Alert.alert(
                "Failed",
                "Email Already Taken Please choose another",
            );
        } else if(isSignup == "server_error"){
            Alert.alert(
                "Failed",
                "Internal Server Error Occured",
            );
        }

        console.log("isSignup: ", isSignup);
        
    }, [isSignup]);

    return (
        <ImageBackground
            source={require('../assets/images/city_bg.jpeg')}
            style={styles.signup_form_container}
        >
            <View style={styles.form}>

                <View style={styles.flex_row}>
                    <Link href="/">
                        <FontAwesome name='chevron-left' size={20} style={{color: '#fff', fontWeight: 'bold'}}/>
                    </Link>

                    <Text style={styles.text}>Sign Up to get started</Text>

                </View>

                <SignupForm setIsSignup={setIsSignup} setIsLoading={setIsLoading} />

                
            </View>

            {
                isLoading && (
                <Modal visible={isLoading} transparent={true} animationType="fade">
                    <TouchableOpacity style={styles.modalBackground} onPress={() => setIsLoading(false)}>
                    <View style={styles.modalContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={styles.modalText}>Registering...</Text>
                    </View>
                    </TouchableOpacity>
                </Modal>
             
            )
          }

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    signup_form_container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flex_row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15,
        marginRight: 20,
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff'

    },
    form: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: 50,
        marginTop: 120,
    },
    login_link: {
        marginTop: 20,
        fontSize: 18,
        color: 'blue',
        textDecorationLine: 'underline',
    },

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContainer: {
        width: 200,
        height: 150,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      modalText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '500',
      },
    
});
