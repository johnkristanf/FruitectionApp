import { MolluskScannedDetails } from "@/types/reports";

import { View, Text, Image, Pressable, StyleSheet, Alert, Animated } from "react-native";
import { getData } from "@/helpers/store";

import { getAddressFromLocation, getLocation } from "@/helpers/location";
import Colors from "@/constants/Colors";
import { REPORT } from "@/api/post/report";

import { useState, lazy } from "react";

import { MolluskSightingsType } from "@/types/mollusk";


export function ScannedImageResult({ scannedData, imageForScanning, setCancelOrReported }: { 
  scannedData: MolluskScannedDetails | undefined,
  imageForScanning: string | undefined,
  setCancelOrReported: React.Dispatch<React.SetStateAction<boolean>>
}){

  const statusTextColor = scannedData && (
    scannedData.status.toLocaleLowerCase() === "critical" ? "red" 
    : scannedData.status.toLocaleLowerCase() === "healthy" ? "green" 
    : "orange")
    

  
  const report = async () => {
    
      try {

        const stored_uID = await getData('user_id');
    
        if (stored_uID && scannedData?.mollusk_name && scannedData.mollusk_name !== "Unknown") {

          const user_id = parseInt(stored_uID, 10);
    
          const location = await getLocation();

          if (!location) {
            console.log('Failed to get location');
            return;
          }
    
          const { latitude, longitude } = location;
          const address = await getAddressFromLocation(latitude, longitude);
    
          const reportDetails = {
            longitude,
            latitude,
            city: address.city,
            province: address.province,
            street: address.street,
            durian_disease_type: scannedData?.mollusk_name,
            user_id,
          };
    
          REPORT(reportDetails).catch((err) => console.log(err));
    
          const successReportMsg = "Thank You! your report has been received and will be investigated promptly. Together, we can protect endangered mollusks.";
          Alert.alert(
            "Reported Successfully",
            successReportMsg,
            [
                {
                  text: "Return to Home",
                  onPress: () => setCancelOrReported(true),
                },
            ],
            { cancelable: false }
          );
    
          
      }

      } catch (error) {
        console.error(error);
      }

    }
    
    
    return (

      // molluskSightings && scannedData && openSightingsMap ? (
      //   <Suspense fallback={
      //     <View style={styles.loading_map_message_container}>
      //       <Text style={styles.loading_text}>Loading Sigthings Map...</Text>
      //     </View>
      //     }
          
      //     >

      //     <MolluskSightingsMap 
      //       molluskName={scannedData.mollusk_name} 
      //       molluskSightings={molluskSightings} 
      //       setOpenSightingsMap={(open) => {
      //         setOpenSightingsMap(open);
      //         if (!open) resetPosition();
      //       }} 
      //     />

      //   </Suspense> ) 
        
        // : (

        scannedData ? (

          <Animated.View style={styles.scan_container} >
  
              <View style={styles.mollusk_details_container}>
  
                {scannedData.mollusk_name !== "Unknown" && (
                  <Text style={styles.scanned_mollusk_textTitle}>Scanned Mollusk Details</Text>
                )}
  
      
                <Image source={{ uri: imageForScanning }} style={styles.image_styles} />
  
                
                  {scannedData.mollusk_name === "Unknown" ? (
  
                    <View style={[styles.mollusk_name_status_container, {height: '20%'}]}>
                      <View style={styles.invalid_container}>
  
                        <Text style={[styles.text, {fontSize: 40, color: 'red', marginBottom: 10}]}>Unknown Image</Text>
  
                        <Pressable
                          onPress={() => setCancelOrReported(true)}
                        >
                          <Text style={[styles.text, {fontSize: 16}]}> Click Here to try another image </Text>
                        </Pressable>
  
                      </View>
                    </View>
  
                  ) : (
  
                    <View style={styles.mollusk_name_status_container}>
  
                      <Text style={[styles.text, {fontSize: 25}]}> {scannedData.mollusk_name} </Text>
  
                      <Text style={[styles.text, {fontSize: 18, color: statusTextColor, marginBottom: 8, marginLeft: 4}]}>
                        {scannedData.status === "N/A" ? "" : scannedData.status}
                      </Text>

                      <Text style={[styles.description_text]}>
                        {scannedData.description}
                      </Text>
  
                    </View>
                  )}
 
              </View>
  
  
              {(statusTextColor === "green") ? (

                <View style={styles.scan_another_button_container}>
                  <Pressable
                    style={[styles.button_cancel, { width: '100%' }]}
                    onPress={() => setCancelOrReported(true)}
                  >

                    <Text style={styles.text}> SCAN ANOTHER </Text>
                  </Pressable>

                  </View>
  
                ) : (
                  scannedData.mollusk_name !== "Unknown" && (
  
                    <View style={styles.scanned_buttons_container}>
                      <Pressable
                        style={styles.button_cancel}
                        onPress={() => setCancelOrReported(true)}
                      >
                        <Text style={styles.text}> CANCEL </Text>
                      </Pressable>

                      <Pressable
                        style={styles.button_report}
                        onPress={() => report()}
                      >
                        <Text style={[styles.text, { color: Colors.dark.text }]}> REPORT </Text>

                      </Pressable>
                    </View>
                  )
                )}
  
      
      
  
          </Animated.View>
          
        ) : null
      // ) 
      
    );
}

const styles = StyleSheet.create({
  scan_container: {
    width: "100%",
    height: "100%",
    backgroundColor: '#16A34A',
    flexDirection: "column",
    position: "relative",
  },

  mollusk_details_container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "88%",
    gap: 7,
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  scanned_buttons_container: {
    flexDirection: "row",
    width: "50%",
    justifyContent: "flex-start",
    height: "40%",
    gap: 30,
    padding: 20,
  },

  scan_another_button_container: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start",
    height: "40%",
    gap: 30,
    padding: 20,
  },

  button_cancel: {
    backgroundColor: Colors.light.background,
    width: "100%",
    height: "20%",
    borderRadius: 10,
    justifyContent: "center",
  },

  button_report: {
    backgroundColor: Colors.dark.background,
    width: "100%",
    height: "20%",
    borderRadius: 10,
    justifyContent: "center",
  },

  description_text: {
    fontWeight: "bold",
    fontSize: 18,
    color: "gray",
    paddingHorizontal: 6,
    textAlign: 'justify'
  },

  text: {
    color: Colors.light.text,
    fontWeight: "bold",
    textAlign: "center",
  },

  swipeMessageContainer: {
    padding: 10,
    backgroundColor: "black",
    borderRadius: 5,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  swipeMessageText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  swipe_left_icon: {
    width: 35,
    height: 35,
    backgroundColor: 'white',
    borderRadius: 10
  },

  topLabel: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: Colors.theme.whiteText,
  },

  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 3,
    color: Colors.theme.whiteText,
  },

  message: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },

  scanned_mollusk_textTitle: {
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    marginVertical: 10,
  },

  image_styles: {
    width: "90%",
    height: "35%",
    borderRadius: 20,
  },

  mollusk_name_status_container: {
    width: "95%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  invalid_container: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  loading_map_message_container: {
    width: '100%', 
    height: '100%', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center'
  },

  loading_text:{
    fontWeight: 'bold',
    fontSize: 30
  }

 
});