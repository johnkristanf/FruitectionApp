import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import Colors from "@/constants/Colors";
import { SignupCredentials } from "@/types/auth";
import { Signup } from "@/api/post/auth";

export default function SignupForm({setIsSignup, setIsLoading}: {
    setIsSignup: React.Dispatch<React.SetStateAction<string>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
}) {

    const { control, handleSubmit, reset, trigger } = useForm<SignupCredentials>();

    const onSubmit: SubmitHandler<SignupCredentials> = async (data) => {
        
        setIsLoading(true)

        try {

            const signupFormData = new FormData();
            data.role = "user";
            console.log("data", data);

            signupFormData.append('fullname', data.fullname);
            signupFormData.append('address', data.address);
            signupFormData.append('email', data.email);
            signupFormData.append('password', data.password);
            signupFormData.append('role', data.role);

            const isSignup = await Signup(signupFormData)
            console.log("isSignup sa form: ", isSignup);
            
            if(isSignup == "success"){
                setIsSignup("success")
                setIsLoading(false)

            } else if(isSignup == "email_taken"){
                setIsSignup("email_taken")
                setIsLoading(false)

            } else if(isSignup == "server_error") {
                setIsSignup("server_error")
                setIsLoading(false)
            } 

            reset();
            
        } catch (error) {
            console.error(error);
            setIsLoading(false)
        }
    };

    return (
        <View style={styles.auth_container}>
            <View style={styles.inputs}>
                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Full Name"
                                placeholderTextColor="#fff" 
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="none"
                            />
                        )}
                        name="fullname"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Address"
                                placeholderTextColor="#fff" 
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="none"
                            />
                        )}
                        name="address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Email"
                                placeholderTextColor="#fff" 
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        )}
                        name="email"
                    />
                </View>
                    
                <View style={styles.inputContainer}>
                    <Controller
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Password"
                                placeholderTextColor="#fff" 
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry={true}
                            />
                        )}
                        name="password"
                    />
                </View>

                <View style={styles.signup_btn_container}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.signup_btn,
                            { opacity: pressed ? 0.75 : 1 }
                        ]}
                        onPress={handleSubmit(onSubmit)}
                    >
                        <Text style={styles.text}>SIGNUP</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    auth_container: {
        width: '100%',
        height: '20%', 
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 30,

    },
    inputs: {
        width: '100%',
    },

    inputContainer: {
        width: '100%',
    },
    
    input: {
        borderBottomColor: '#16A34A',
        borderBottomWidth: 1,
        backgroundColor: 'transparent',
        padding: 6,
        marginBottom: 10,
        color: '#ffff'

    },

    signup_btn_container: {
        width: '100%',
        height: '5%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    signup_btn: {
        backgroundColor: '#16A34A',
        borderRadius: Colors.theme.radius,
        color: Colors.theme.whiteText,
        padding: 9,
        width: '100%',
        height: 40,
        alignItems: 'center',
        marginTop: 50
    },
    text: {
        color: Colors.theme.whiteText,
        fontWeight: "bold",
        textAlign: 'center'
    },
    title: {
        color: Colors.theme.whiteText,
        fontSize: Colors.theme.titleTextSize,
        fontWeight: "bold",
        marginBottom: 20
    },
    error: {
        color: 'red',
    },
});
