import React, { useEffect, useRef, useState } from 'react';
import { CameraView, CameraType } from 'expo-camera';
import { getInfoAsync } from 'expo-file-system';
import { View, Pressable, StyleSheet, Text, Alert, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { DurianScannedDetails } from '@/types/reports';
import { resizeImage } from '@/helpers/resize';
import { FetchDurianDetails, Scan } from '@/api/post/scan';
import Colors from '@/constants/Colors';

export function OpenCamera({
    setImageForScanning,
    setIsOpenCamera,
    setScannedData,
    setCancelOrReported,
    scanType
}: {
    setImageForScanning: React.Dispatch<React.SetStateAction<string | undefined>>,
    setIsOpenCamera: React.Dispatch<React.SetStateAction<boolean>>,
    setScannedData: React.Dispatch<React.SetStateAction<DurianScannedDetails | undefined>>,
    setCancelOrReported: React.Dispatch<React.SetStateAction<boolean>>,
    scanType: string
}) {
    const cameraRef = useRef<CameraView>(null);
    const [camFacing, setCamFacing] = useState<string>('back');
    const [capturedImages, setCapturedImages] = useState<any[]>([]);

    const startScanningHealthy = async () => {
        if (capturedImages.length < 3) {
            Alert.alert(
                'Capture Images',
                'Please capture 3 images before starting the scan.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }

        const formData = new FormData();
            const { uri, name } = capturedImages[0];
            const resizedImageUri = await resizeImage(uri, 512, 512, 0.8);

            setImageForScanning(uri);
            setIsOpenCamera(false);

            if (resizedImageUri) {
                const fileInfo = await getInfoAsync(resizedImageUri);
                if (!fileInfo.exists) throw new Error('File does not exist');
                formData.append(`captured_image_file`, {
                    uri: resizedImageUri,
                    name: name,
                    type: 'image/jpeg',
                } as any);
            }

        // Proceed with scanning using the formData
        try {
            const scanRespData = await Scan(formData, setCancelOrReported);

            console.log("scanRespData: ", scanRespData);
            

            if (scanRespData) {
                FetchDurianDetails(scanRespData.durian_disease_result)
                    .then(durianDetails => {
                        if (durianDetails) {
                            durianDetails.scan_percentage = scanRespData.predicted_disease_percentage;
                            setScannedData(durianDetails);
                        }
                    })
                    .catch(err => console.error(err));
            } else {
                const errorMsg = "Request timeout due to slow internet connection, you will be redirected back and try to scan again.";
                Alert.alert("Error in Scanning", errorMsg, [{ text: "Return", onPress: () => setCancelOrReported(true) }], { cancelable: false });
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Network error occurred while scanning.');
        }
    };

    console.log("cap len:", capturedImages.length);
    

    const startScanningDiseased = async () => {
        const captured = await cameraRef.current?.takePictureAsync({
            base64: false
        });

        if (captured?.uri) {
            setImageForScanning(captured.uri);
            setIsOpenCamera(false);

            try {
                const resizedImageUri = await resizeImage(captured.uri, 512, 512, 0.8);

                if (resizedImageUri) {
                    try {
                        const fileInfo = await getInfoAsync(resizedImageUri);
                        if (!fileInfo.exists) throw new Error('File does not exist');

                        const formData = new FormData();
                        formData.append('captured_image_file', {
                            uri: resizedImageUri,
                            name: fileInfo.uri.split('/').pop(),
                            type: 'image/jpeg',
                        } as any);

                        const scanRespData = await Scan(formData, setCancelOrReported);

                        if (scanRespData) {
                            FetchDurianDetails(scanRespData.durian_disease_result)
                                .then(durianDetails => {
                                    if(durianDetails){
                                        durianDetails.scan_percentage = scanRespData.predicted_disease_percentage
                                        setScannedData(durianDetails)
                                    }
                                })
                                .catch(err => console.error(err));

                        } else {
                            const errorMsg = "Request timeout due to slow internet connection, you will be redirected back and try to scan again.";
                            Alert.alert(
                                "Error in Scanning", 
                                errorMsg,

                                [
                                    {
                                    text: "Return",
                                    onPress: () => setCancelOrReported(true),
                                    },
                                ],

                                { cancelable: false }
                            );
                        }

                    } catch (error) {
                        console.error(error);
                        console.log("ERROR NEWTOWK DOLL");
                        throw new Error('Diri ang network error dol');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const captureImage = async () => {
        const captured = await cameraRef.current?.takePictureAsync({ base64: false });

        if (captured?.uri) {
            const newCapturedImages = [...capturedImages, { uri: captured.uri, name: captured.uri.split('/').pop() }];
            setCapturedImages(newCapturedImages);

            if (newCapturedImages.length === 3) {
                Alert.alert('Ready to Scan', 'You have captured all 3 images. You can now start scanning.');
            }
        }
    };

    function toggleCameraFacing() {
        setCamFacing(current => (current === 'back' ? 'front' : 'back'));
    }


    useEffect(() => {
        if (capturedImages.length < 3 && scanType == "healthy") {
            Alert.alert(
                'Capture Images',
                'Please capture 3 images before starting the scan.',
                [{ text: 'OK' }],
                { cancelable: false }
            );
            return;
        }
    }, [scanType])

    return (
        <View style={styles.cameraContainer}>
            {capturedImages.length < 3 ? (
                <>
                    <CameraView
                        style={styles.camera}
                        ref={cameraRef}
                        facing={camFacing as CameraType}
                    />
                    {/* Overlay corners */}
                    <View style={styles.overlay}>
                        <View style={styles.topLeftFirstCorner} />
                        <View style={styles.topLeftSecondCorner} />
                        <View style={styles.topRightFirstCorner} />
                        <View style={styles.topRightSecondCorner} />
                        <View style={styles.bottomLeftFirstCorner} />
                        <View style={styles.bottomLeftSecondCorner} />
                        <View style={styles.bottomRightFirstCorner} />
                        <View style={styles.bottomRightSecondCorner} />
                    </View>
                    <View style={styles.header}>
                        <FontAwesome
                            name="arrow-left"
                            size={35}
                            color="white"
                            style={styles.icon}
                            onPress={() => setIsOpenCamera(false)}
                        />
                        <FontAwesome
                            name="rotate-right"
                            size={35}
                            color="white"
                            style={styles.icon}
                            onPress={toggleCameraFacing}
                        />
                    </View>
                </>
            ) : (
                <View style={styles.imagesContainer}>
                    {capturedImages.map((img, index) => (
                        <Image key={index} source={{ uri: img.uri }} style={styles.capturedImage} />
                    ))}
                </View>
            )}

            <View style={styles.header}>
                <FontAwesome
                    name="arrow-left"
                    size={35}
                    color="white"
                    style={styles.icon}
                    onPress={() => setIsOpenCamera(false)}
                />
                <FontAwesome
                    name="rotate-right"
                    size={35}
                    color="white"
                    style={styles.icon}
                    onPress={toggleCameraFacing}
                />
            </View>


            {scanType === "healthy" && capturedImages.length === 3  && (
                    <View style={styles.buttonContainer}>

                        <Pressable
                            style={({ pressed }) => [
                                styles.button_scan,
                                { backgroundColor: pressed ? 'gray' : '#16A34A' },
                            ]}
                            onPress={startScanningHealthy}
                            disabled={capturedImages.length < 3} // Disable button if not all 3 images are captured
                        >
                            <Text style={styles.text}>
                                Start Scanning
                            </Text>
                        </Pressable>
                    </View>

            )}

            {scanType === "healthy" && capturedImages.length < 3 && (

                <>
                    <View style={styles.captureButtonContainer}>
                        <Text style={[styles.text, {fontSize: 15}]}>Captured Image {capturedImages.length} / 3</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button_scan,
                                { backgroundColor: pressed ? 'gray' : '#16A34A' },
                            ]}
                            onPress={captureImage}
                        >
                            <Text style={styles.text}>Capture</Text>
                        </Pressable>
                    </View>
                
                </>

                
                
            )}


            {scanType === "diseased" && (
                    <View style={styles.buttonContainer}>

                        <Pressable
                            style={({ pressed }) => [
                                styles.button_scan,
                                { backgroundColor: pressed ? 'gray' : '#16A34A' },
                            ]}
                            onPress={startScanningDiseased}
                        >
                            <Text style={styles.text}>
                                Start Scanning
                            </Text>
                        </Pressable>
                    </View>

            )}

        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        position: 'relative',
    },
    camera: {
        width: '100%',
        height: '100%',
        aspectRatio: 3 / 4,
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
        marginTop: 80 
    },

    capturedImage: {
        width: 145,  
        height: 250,  
        margin: 10,  
        borderRadius: 10, 
        resizeMode: 'cover', 
    },

    overlay: {
        position: 'absolute',
        top: -30,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: 'white',
    },
    topLeftFirstCorner: {
        position: 'absolute',
        top: '20%',
        left: '7%',
        borderTopWidth: 100,
        borderLeftWidth: 5,
        borderColor: 'white',
    },
    topLeftSecondCorner: {
        position: 'absolute',
        top: '20%',
        left: '7%',
        borderTopWidth: 5,
        borderLeftWidth: 90,
        borderColor: 'white',
    },
    topRightFirstCorner: {
        position: 'absolute',
        top: '20%',
        right: '7%',
        borderTopWidth: 100,
        borderRightWidth: 5,
        borderColor: 'white',
    },
    topRightSecondCorner: {
        position: 'absolute',
        top: '20%',
        right: '7%',
        borderTopWidth: 5,
        borderRightWidth: 90,
        borderColor: 'white',
    },
    bottomLeftFirstCorner: {
        position: 'absolute',
        bottom: '20%',
        left: '7%',
        borderBottomWidth: 100,
        borderLeftWidth: 5,
        borderColor: 'white',
    },
    bottomLeftSecondCorner: {
        position: 'absolute',
        bottom: '20%',
        left: '7%',
        borderBottomWidth: 5,
        borderLeftWidth: 90,
        borderColor: 'white',
    },
    bottomRightFirstCorner: {
        position: 'absolute',
        bottom: '20%',
        right: '7%',
        borderBottomWidth: 100,
        borderRightWidth: 5,
        borderColor: 'white',
    },
    bottomRightSecondCorner: {
        position: 'absolute',
        bottom: '20%',
        right: '7%',
        borderBottomWidth: 5,
        borderRightWidth: 90,
        borderColor: 'white',
    },
    button_scan: {
        backgroundColor: Colors.theme.backgroundcolor,
        color: '#16A34A',
        width: '100%',
        height: '100%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: Colors.theme.whiteText,
        fontWeight: "bold",
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        color: '#16A34A',
    },
    captureButtonContainer: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 20,
        position: 'absolute',
        top: 15,
        zIndex: 1,
    },
    icon: {
        paddingHorizontal: 10,
    },
});
