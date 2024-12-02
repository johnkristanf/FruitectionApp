import React, { useRef, useState, useEffect } from 'react';
import { CameraView, CameraType } from 'expo-camera';
import { getInfoAsync } from 'expo-file-system';
import { View, Pressable, StyleSheet, Text, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { MolluskScannedDetails } from '@/types/reports';
import { resizeImage } from '@/helpers/resize';
import { FetchDurianDetails, Scan } from '@/api/post/scan';
import Colors from '@/constants/Colors';

export function OpenCamera({ setImageForScanning, setIsOpenCamera, setScannedData, setCancelOrReported }: {
    setImageForScanning: React.Dispatch<React.SetStateAction<string | undefined>>,
    setIsOpenCamera: React.Dispatch<React.SetStateAction<boolean>>,
    setScannedData: React.Dispatch<React.SetStateAction<MolluskScannedDetails | undefined>>,
    setCancelOrReported: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const cameraRef = useRef<CameraView>(null);
    const [camFacing, setCamFacing] = useState<string>('back');

   
    const startScanning = async () => {
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
                                .then(durianDetails => setScannedData(durianDetails))
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

    function toggleCameraFacing() {
        setCamFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              ref={cameraRef}
              facing={camFacing as CameraType}
              
            />

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


            <View style={styles.buttonContainer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button_scan,
                        { backgroundColor: pressed ? 'gray' : '#16A34A' },
                    ]}
                    onPress={startScanning}
                >
                    <Text style={styles.text}>Start Scanning</Text>
                </Pressable>
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
        </View>
    );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        position: 'relative'
    },
    camera: {
        width: '100%',
        height: '100%',
        aspectRatio: 3 / 4,
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
        color: '#16A34A'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 20,
        position: 'absolute',
        top: 15,
        zIndex: 1
    },
    icon: {
        paddingHorizontal: 10,
    },
    zoomMessageContainer: {
        position: 'absolute',
        top: '50%',
        left: '10%',
        right: '10%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 10,
    },
    zoomMessageText: {
        color: 'white',
        textAlign: 'center',
    },
});
