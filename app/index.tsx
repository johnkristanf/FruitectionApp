import { View, Text, StyleSheet, ImageBackground, Image } from "react-native";
import { Link } from 'expo-router';

export default function LandingPage() {
    return (
        <ImageBackground
            source={require('../assets/images/clamApp_bg.png')}
            style={styles.index_container}
        >
            <View style={styles.flex_col_center}>
                <Image
                    source={require('../assets/images/clam_logo.png')}
                    style={styles.image_size}
                    resizeMode="contain" 
                />
                <Text style={styles.text}>ClamScanner</Text>
            </View>

            <View style={[styles.flex_col_center, { width: '100%', gap: 8 }]}> 

                <View style={styles.get_started_container}>
                    <Link href="/signup" style={styles.get_started}>Get Started</Link>
                </View>

                <Text style={styles.already_signup}>
                    Already Have an Account?
                    <Link href="/login" style={{fontWeight: 'bold', textDecorationLine: 'underline'}}>Login</Link>
                </Text>
                
            </View>

            




        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    index_container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    flex_col_center: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

    image_size: {
        width: 190, 
        height: 130, 
    },

    text: {
        color: '#fff',
        marginTop: 15,
        fontSize: 30,
        fontWeight: 'bold',
    },

    get_started_container: {
        backgroundColor: '#00e2e6',
        borderRadius: 8,
        padding: 8,
        width: '70%',

    },

    get_started: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    already_signup: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    }
});
