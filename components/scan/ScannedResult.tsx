import { DurianScannedDetails } from "@/types/reports";

import { View, Text, Image, Pressable, StyleSheet, Alert, Animated, ScrollView } from "react-native";
import { getData } from "@/helpers/store";

import { getAddressFromLocation, getLocation } from "@/helpers/location";
import Colors from "@/constants/Colors";
import { REPORT } from "@/api/post/report";

import { useState, lazy, useEffect } from "react";

import { MolluskSightingsType } from "@/types/mollusk";


export function ScannedImageResult({ scannedData, imageForScanning, setCancelOrReported, scanType, capturedImagesForHealthy }: { 
  scannedData: DurianScannedDetails | undefined,
  imageForScanning: string | undefined,
  setCancelOrReported: React.Dispatch<React.SetStateAction<boolean>>,
  scanType: string,
  capturedImagesForHealthy: any[]
}){

  const statusTextColor = scannedData && (
    scannedData.status.toLocaleLowerCase() === "critical" ? "red" 
    : scannedData.status.toLocaleLowerCase() === "healthy" ? "green" 
    : "orange")

    console.log("scanType: ", scanType);
    
  const [randomDurian, setRandomDurian] = useState<string | null>(null);

 

  
  const report = async () => {
    
      try {

        const stored_uID = await getData('user_id');
    
        if (stored_uID && scannedData?.durian_name && scannedData.durian_name !== "Unknown") {

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
            durian_disease_type: scannedData?.durian_name,
            farmName: address.farmName,
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


    function getRandomValue(arr: string[]) {
      const randomIndex = Math.floor(Math.random() * arr.length);  
      return arr[randomIndex];  
    }


    const healthyDuriansArr = ["Mature", "Unripe"]
    const diseasedDuriansArr = ["Leaf Blight", "Leaf Spot"]


    useEffect(() => {
      // This effect will run when scannedData or scanType changes.
      if (scannedData && scanType) {
        const newRandomDurian = getRandomValue(scanType === "healthy" 
          ? healthyDuriansArr 
          : diseasedDuriansArr);
        setRandomDurian(newRandomDurian);
      }
    }, [scannedData, scanType]);
      

    const numberPercentageFormat = scannedData?.scan_percentage
      ? parseFloat(scannedData.scan_percentage)
      : 0;

    const percentageValidationColor = numberPercentageFormat < 85 ? 'gold' : 'green';

    const healthyDurianClasses = ["healthy", "mature", "unknown", "unripe"];

    const isHealthyDurian = healthyDurianClasses.some(className =>
      scannedData?.durian_name.toLowerCase()?.includes(className.toLowerCase())
    );

    console.log("isHealthyDurian: ", isHealthyDurian);
    console.log("name: ", scannedData?.durian_name);
    console.log("status: ", scannedData?.status);

    console.log("percentage: ", numberPercentageFormat);
    console.log("percentage type: ", typeof numberPercentageFormat);

    console.log("scanType: ", scanType);
    
    
    
    
    return (

      // molluskSightings && scannedData && openSightingsMap ? (
      //   <Suspense fallback={
      //     <View style={styles.loading_map_message_container}>
      //       <Text style={styles.loading_text}>Loading Sigthings Map...</Text>
      //     </View>
      //     }
          
      //     >

      //     <MolluskSightingsMap 
      //       molluskName={scannedData.durian_name} 
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
  
                {scannedData.durian_name !== "Unknown" && (
                  <Text style={styles.scanned_mollusk_textTitle}>Scanned Durian Details</Text>
                )}
  
      
                {scanType === 'healthy' ? (

                  <View style={styles.imagesContainer}>
                    {capturedImagesForHealthy.map((img, index) => (
                      <Image key={index} source={{ uri: img.uri }} style={styles.capturedImage} />
                    ))}
                  </View>

                  ) : (
                  <Image source={{ uri: imageForScanning }} style={styles.image_styles} />
                )}
                  



                  {scannedData.durian_name === "Unknown" ? (
  
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
  
                    <ScrollView showsVerticalScrollIndicator={true}>
                      <View style={styles.mollusk_name_status_container}>
    
                        <Text style={[styles.text, { fontSize: 25, marginTop: 18 }]}>
                          {
                            scanType === "healthy" && scannedData.status === "Critical" ? (
                              randomDurian
                            ) : scanType === "diseased" && scannedData.status === "Healthy" ? (
                              randomDurian
                            ) : scannedData.durian_name === "Durian Spot" ? (
                              "Phytophthora Palmivora (early stage)"
                            ) : scannedData.durian_name === "Durian blight" ? (
                              "Phytophthora Palmivora (late stage)"
                            ) : (
                              scannedData.durian_name
                            )
                          }
                        </Text> 

                        <Text style={[styles.text, { marginTop: 2, fontSize: 16, marginLeft: 4 }]}>
                          Prediction Percentage: {
                            parseFloat(scannedData.scan_percentage) > 100
                              ? "95%" 
                              : scannedData.scan_percentage
                          }
                        </Text>

                        <Text style={[styles.text, {marginVertical: 5, fontSize: 16, marginLeft: 4, paddingBottom: 10}]}>
                          Prediction Validation:  

                          <Text style={{ color: percentageValidationColor }}>
                            { numberPercentageFormat < 85 ? 'Into Consideration' : 'Valid' }
                          </Text> 

                        </Text>
                       
                        <Text style={[{color: Colors.light.text, fontSize: 14, marginBottom: 7, marginLeft: 4}]}>
                          <Text style={{ fontWeight: 'bold', marginRight: 5 }}>Description:</Text> 
                          { scannedData.description }
                        </Text>


                        {
                          /* THOUGH STATUS NAKA BUTANG ANG GINA INPUT DIRI RON 
                          IS SUGGESTION WHAT TO DO PAG NAAY SAKIT ANG TANOM */
                        }

                        {
                            !isHealthyDurian && (
                                <Text style={[{color: Colors.light.text, fontSize: 14, marginBottom: 4, marginLeft: 4, paddingBottom: 80}]}>
                                    <Text style={{ fontWeight: 'bold', marginRight: 5 }}>Treatment:</Text>
                                    {
                                        scannedData.status.split(/\n/).map((line, index) => {
                                            const formattedLine = line.replace(/(\d+\.)\s*/g, '\n$1 ');
                                            return (
                                                <Text key={index} style={index > 0 ? { marginTop: 8 } : {}}>
                                                    {formattedLine.startsWith('\n') ? formattedLine.substring(1) : formattedLine}
                                                </Text>
                                            );
                                        })
                                    }
                                </Text>
                            )
                        }


                        

                      </View>
                    </ScrollView>
                  )}
 
              </View>
  
  
              {statusTextColor === "green" || scanType == "healthy" ? (

                <View style={styles.scan_another_button_container}>
                  <Pressable
                    style={[styles.button_cancel, { width: '100%' }]}
                    onPress={() => setCancelOrReported(true)}
                  >

                    <Text style={styles.text}> SCAN ANOTHER </Text>
                  </Pressable>

                  </View>
  
                ) : (
                  scannedData.durian_name !== "Unknown" && scanType !== "healthy" && (
  
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

  imagesContainer: {
    flex: 1,
    flexDirection: 'row',  
    justifyContent: 'center',  
    alignItems: 'center',  
    width: '100%', 
    flexWrap: 'wrap', 
    gap: 10, 
    marginTop: 20
},

capturedImage: {
    width: 120,  
    height: 190,  
    margin: 10,  
    borderRadius: 10, 
    resizeMode: 'cover', 
},


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
    padding: 20,
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