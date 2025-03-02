import { View, Text, ImageBackground, StyleSheet, ActivityIndicator, Modal, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import LoginForm from '@/components/auth/LoginForm';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

export default function LoginPage() {
  const [loginnedUser, setLoginnedUser] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>();

  useEffect(() => {

    if (loginnedUser) {

      if(loginnedUser === "user"){
        router.replace("/(users)/scan");
        setLoginnedUser(undefined)

      }

      if(loginnedUser === "personnel"){
        router.replace("/(personnel)/reports");
        setLoginnedUser(undefined)

      }

      if (loginnedUser == "login_failure") {
        Alert.alert(
          "Failed",
          "Invalid User Credentials",
        );
      }
      
    } 

  }, [loginnedUser]);

    return (
        <ImageBackground
          source={require('../assets/images/city_bg.jpeg')}
          style={styles.login_form_container}
        >

          <View style={styles.form}>

            <View style={styles.flex_row}>

              <Link href="/" >
                <FontAwesome name='chevron-left' size={20} style={{color: '#ffff', fontWeight: 'bold'}}/>
              </Link>

              <Text style={styles.text}>Sign In your account</Text>
            </View> 

            <LoginForm 
              setLoginnedUser={setLoginnedUser} 
              setIsLoading={setIsLoading} 
            />
          </View>

          {
            isLoading && (
              <Modal visible={isLoading} transparent={true} animationType="fade">
                <TouchableOpacity style={styles.modalBackground} onPress={() => setIsLoading(false)}>
                  <View style={styles.modalContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.modalText}>Logging In...</Text>
                  </View>
                </TouchableOpacity>
              </Modal>
         
            )
          }

         

        </ImageBackground>
    );
}


const styles = StyleSheet.create({
  login_form_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  flex_row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 15,
  },

  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10
  },

  form: {
    width: '100%',
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 10,
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
    textAlign: 'center',
  },
});
