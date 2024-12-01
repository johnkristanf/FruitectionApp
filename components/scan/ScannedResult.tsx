import { MolluskScannedDetails } from "@/types/reports";

import { View, Text, Image, Pressable, StyleSheet, Alert, PanResponder, PanResponderInstance, Animated } from "react-native";
import { getData } from "@/helpers/store";

import { getAddressFromLocation, getLocation } from "@/helpers/location";
import Colors from "@/constants/Colors";
import { REPORT } from "@/api/post/report";

import { FetchMolluskCommonSightings } from "@/api/get/mollusk";
import { useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";

import { MolluskSightingsType } from "@/types/mollusk";

const MolluskSightingsMap = lazy(() => import('../SightingsMap'));


export function ScannedImageResult({ scannedData, imageForScanning, setCancelOrReported }: { 
  scannedData: MolluskScannedDetails | undefined,
  imageForScanning: string | undefined,
  setCancelOrReported: React.Dispatch<React.SetStateAction<boolean>>
}){

  const statusTextColor = scannedData && (
    scannedData.status.toLocaleLowerCase() === "endangered" ? "red" 
    : scannedData.status.toLocaleLowerCase() != "least concern" ? "orange" 
    : "green")
    
  const [molluskSightings, setMolluskSightings] = useState<MolluskSightingsType[]>();
  const [openSightingsMap, setOpenSightingsMap] = useState<boolean>(false);


  const commonSightingsMemo = useMemo(() => {
    if(scannedData) {
      return FetchMolluskCommonSightings(scannedData.scientific_name);
    }
    return Promise.resolve([]);
  }, [scannedData]);

  useEffect(() => {
    commonSightingsMemo.then(result => setMolluskSightings(result)).catch(err => console.error(err));
  }, [commonSightingsMemo]);

 

  
  const report = async () => {
    
      try {

        const stored_uID = await getData('user_id');
    
        if (stored_uID && scannedData?.mollusk_name && scannedData.mollusk_name !== "Invalid Image") {

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
            district: address.district,
            mollusk_type: scannedData?.mollusk_name,
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
    
    const translateX = useRef(new Animated.Value(0)).current;

    const panResponder: PanResponderInstance = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
          return Math.abs(gestureState.dx) > 20;
        },
        onPanResponderMove: (evt, gestureState) => {
          translateX.setValue(gestureState.dx);
        },
        onPanResponderRelease: (evt, gestureState) => {
          if (gestureState.dx < -150) {
            Animated.timing(translateX, {
              toValue: -50,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setOpenSightingsMap(true);
            });
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },
      })
    ).current;

    const resetPosition = () => {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    };


    return (

      molluskSightings && scannedData && openSightingsMap ? (
        <Suspense fallback={
          <View style={styles.loading_map_message_container}>
            <Text style={styles.loading_text}>Loading Sigthings Map...</Text>
          </View>
          }
          
          >

          <MolluskSightingsMap 
            molluskName={scannedData.mollusk_name} 
            molluskSightings={molluskSightings} 
            setOpenSightingsMap={(open) => {
              setOpenSightingsMap(open);
              if (!open) resetPosition();
            }} 
          />

        </Suspense> ) 
        
        : (

        scannedData ? (

          <Animated.View style={[styles.scan_container, { transform: [{ translateX }] }]} >
  
              <View style={styles.mollusk_details_container}>
  
                {scannedData.mollusk_name !== "Invalid Image" && (
                  <Text style={styles.scanned_mollusk_textTitle}>Scanned Mollusk Details</Text>
                )}
  
      
                <Image source={{ uri: imageForScanning }} style={styles.image_styles} />
  
                
                  {scannedData.mollusk_name === "Invalid Image" ? (
  
                    <View style={[styles.mollusk_name_status_container, {height: '20%'}]}>
                      <View style={styles.invalid_container}>
  
                        <Text style={[styles.text, {fontSize: 40, color: 'red', marginBottom: 10}]}>Invalid Image</Text>
  
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
  
                    </View>
                  )}
        
                {scannedData.mollusk_name !== "Invalid Image" && (
  
                  <View style={{paddingHorizontal: 10, gap: 10, width: '95%'}} {...panResponder.panHandlers}>

                    <Text style={styles.description_text}>Description: </Text>
                    <Text style={[styles.text, {textAlign: 'justify', fontSize: 14}]}>{scannedData.description} </Text>

                    <View style={styles.swipeMessageContainer} >
                      <Text style={styles.swipeMessageText}>Swipe left to view common sightings map</Text>
                      <Image source={require('../../assets/images/swipe_left.png')} style={styles.swipe_left_icon} />
                    </View>

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
                  scannedData.mollusk_name !== "Invalid Image" && (
  
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
      ) 
      
    );
}

const styles = StyleSheet.create({
  scan_container: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.theme.backgroundcolor,
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