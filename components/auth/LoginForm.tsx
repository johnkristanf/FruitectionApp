import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import Colors from "@/constants/Colors";
import { LoginCredentials } from "@/types/auth";
import { Login } from "@/api/post/auth";

export default function LoginForm({setLoginnedUser, setIsLoading}: {
    setLoginnedUser: React.Dispatch<React.SetStateAction<string | undefined>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean | undefined>>,
}) {
    const { control, handleSubmit, reset } = useForm<LoginCredentials>();

    const onSubmit: SubmitHandler<LoginCredentials> = async (data) => {
        try {

            setIsLoading(true)
    
            const logginedUser = await Login(data)
            console.log("logginedUser: ", logginedUser)

            if(logginedUser == "login_failure"){
                setLoginnedUser("login_failure")
                setIsLoading(false)
                reset();  

                return 
            }
    
            if(logginedUser){
                setLoginnedUser(logginedUser)
                setIsLoading(false)
                reset();  
            } 
                      
        } catch (error) {
            console.error(error)
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
                                placeholder="Enter Email"
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
                        rules={{ required: true, minLength: 8 }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Password"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                secureTextEntry={true}
                            />
                        )}
                        name="password"
                    />
                </View>

                <Pressable
                        style={({ pressed }) => [
                            styles.login_btn,
                            { opacity: pressed ? 0.75 : 1 }
                        ]}
                        onPress={handleSubmit(onSubmit)}
                    >
                        <Text style={styles.text}>LOGIN</Text>
                </Pressable>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    auth_container: {
        width: '100%',
        height: '30%', 
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 20,
    },
    inputs: {
        width: '75%',
    },
    inputContainer: {
        width: '100%',
    },
    
    input: {
        borderBottomColor: '#00e2e6',
        borderBottomWidth: 1,
        backgroundColor: 'transparent',
        padding: 6,
        marginBottom: 15
    },

    login_btn: {
        backgroundColor: Colors.theme.backgroundcolor,
        borderRadius: Colors.theme.radius,
        color: Colors.theme.whiteText,
        padding: 9,
        width: '70%',
        alignItems: 'center',
        marginTop: 20
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
