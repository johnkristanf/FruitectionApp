import { View, Image, StyleSheet, Text } from "react-native";
import { ScanAnimation } from "./ScanAnimation";

export function Scanning({ imageForScanning, capturedImagesForHealthy, scanType }: { 
  imageForScanning: string,
  capturedImagesForHealthy: any[],
  scanType: string
}) {

    console.log("capturedImagesForHealthy inside scanning: ", capturedImagesForHealthy);
    
  
    return (
      <View style={[styles.container, { marginTop: 100 }]}>

      {scanType === 'healthy' ? (
        <View style={styles.imagesContainer}>
          {capturedImagesForHealthy.map((img, index) => (
            <Image key={index} source={{ uri: img.uri }} style={styles.capturedImage} />
          ))}
        </View>
      ) : (
        <Image source={{ uri: imageForScanning }} style={styles.image} />
      )}
  
        <View style={styles.overlay}>
          <ScanAnimation  />
        </View>

        {/* <Text style={{
          fontWeight: 'bold', 
          fontSize: 30, 
          marginTop: 30, 
          marginBottom: 40,
          color: '#ffff' 
        }}>
          Scanning Image....
        </Text> */}
  
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

      imagesContainer: {
        flex: 1,
        flexDirection: 'row',  
        justifyContent: 'center',  
        alignItems: 'center',  
        width: '100%', 
        padding: 10, 
        flexWrap: 'wrap', 
        gap: 10, 
    },


    capturedImage: {
      width: 145,  
      height: 250,  
      margin: 10,  
      borderRadius: 10, 
      resizeMode: 'cover', 
  },

  
  });
  