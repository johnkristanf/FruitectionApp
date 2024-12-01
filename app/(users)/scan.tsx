import { OpenCamera } from "@/components/OpenCamera";
import { ScannedImageResult } from "@/components/scan/ScannedResult";
import { Scanning } from "@/components/scan/Scanning";
import { MolluskScannedDetails } from "@/types/reports";
import { useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, Pressable } from "react-native";
import { openGallery } from "@/helpers/open_gallery";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ScanPage() {

    const [scannedData, setScannedData] = useState<MolluskScannedDetails | undefined>();
    const [isOpenCamera, setIsOpenCamera] = useState<boolean>(false);
    const [imageForScanning, setImageForScanning] = useState<string>();

    const [cancelOrReported, setCancelOrReported] = useState<boolean>(false);

    const [_, requestPermission] = useCameraPermissions();

   
    const openCamera = () => {
        requestPermission();
        setIsOpenCamera(true);
    };

    useEffect(() => {
        if (cancelOrReported) {
            setScannedData(undefined);
            setIsOpenCamera(false);
            setImageForScanning(undefined);
            setCancelOrReported(false)
        }

    }, [cancelOrReported])

    return (
        <ImageBackground
            source={require('../../assets/images/scan_bg.png')}
            style={styles.scan_container}
        >

            <View style={styles.signout_container}>
                <FontAwesome 
                    name='sign-out' 
                    size={23} 
                    color="white"
                    onPress={() => router.replace('/')}
                >
                    &nbsp; Sign Out
                </FontAwesome>
            </View>

           

            {isOpenCamera ? (
                <OpenCamera
                    setImageForScanning={setImageForScanning}
                    setIsOpenCamera={setIsOpenCamera}
                    setScannedData={setScannedData}
                    setCancelOrReported={setCancelOrReported}
                />

            ) : imageForScanning && !scannedData ? (
                <Scanning imageForScanning={imageForScanning} />

            ) : imageForScanning && scannedData ? (
                <ScannedImageResult 
                    scannedData={scannedData} 
                    imageForScanning={imageForScanning}
                    setCancelOrReported={setCancelOrReported}
                />

            ) : (
                <View style={styles.capture_methods_container}>

                    <Pressable
                        style={styles.flex_row_center}
                        onPress={openCamera}
                    >
                        <Image source={require('../../assets/images/open_camera_icon.png')} />
                        <Text style={styles.text}>Start Camera</Text>
                    </Pressable>

                    <Pressable
                        style={styles.flex_row_center}
                        onPress={() => openGallery(setImageForScanning, setScannedData, setCancelOrReported)}
                    >
                        <Image source={require('../../assets/images/open_gallery_icon.png')} />
                        <Text style={styles.text}>Upload Gallery</Text>
                    </Pressable>
                </View>
            )}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    scan_container: {
        width: '100%',
        height: '100%',
    },

    signout_container: {
        width: '100%', 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        alignItems: 'flex-end', 
        height: '7%', 
        paddingRight: 15,
        position: 'absolute',
        top: 0
    },

    text: {
        fontWeight: 'bold',
        fontSize: 16
    },

    flex_row_center: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },

    capture_methods_container: {
        width: '80%',
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: 15,
        paddingTop: 100,
        gap: 30,
    },

    
});
