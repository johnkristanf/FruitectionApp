import { View, Image, StyleSheet, Text } from "react-native";
import { ScanAnimation } from "./ScanAnimation";

export function Scanning({ imageForScanning }: { imageForScanning: string }) {
  
    return (
      <View style={[styles.container, { marginTop: 100 }]}>
        
        <Image source={{ uri: imageForScanning }} style={styles.image} />
  
        <View style={styles.overlay}>
          <ScanAnimation  />
        </View>

        <Text style={{
          fontWeight: 'bold', 
          fontSize: 30, 
          marginTop: 30, 
          marginBottom: 40,
          color: '#ffff' 
        }}>
          Scanning Image....
        </Text>
  
      </View>
    );
  }
  

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '100%',
      gap: 7
    },
 

    image: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '95%',
        height: '90%',
        position: 'relative',
        borderRadius: 10
      },
    
      overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
      },
  
  });
  