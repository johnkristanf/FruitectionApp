import { OpenCamera } from "@/components/OpenCamera";
import { ScannedImageResult } from "@/components/scan/ScannedResult";
import { Scanning } from "@/components/scan/Scanning";
import { DurianScannedDetails } from "@/types/reports";
import { useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Image, Pressable } from "react-native";
import { openGallery } from "@/helpers/open_gallery";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ScanPage() {

    const [scannedData, setScannedData] = useState<DurianScannedDetails | undefined >();
    const [isOpenCamera, setIsOpenCamera] = useState<boolean>(false);
    const [imageForScanning, setImageForScanning] = useState<string>();
    const [capturedImagesForHealthy, setCapturedImagesForHealthy] = useState<any[]>([]);

    

    const [scanType, setScanType] = useState<string>("");
    const [diseaseType, setDiseaseType] = useState<string>("");

    const [cancelOrReported, setCancelOrReported] = useState<boolean>(false);

    const [_, requestPermission] = useCameraPermissions();

   
    const openDiseasedLeafCameraScan = () => {
        requestPermission();
        setScanType("diseased");
        setDiseaseType("leaf")
        setIsOpenCamera(true);
    };

    const openDiseasedFruitCameraScan = () => {
        requestPermission();
        setScanType("diseased");
        setDiseaseType("fruit")
        setIsOpenCamera(true);
    };


    const openHealthyCameraScan = () => {
        requestPermission();
        setScanType("healthy");
        setDiseaseType("healthy")
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

    console.log("imageForScanning: ", imageForScanning);
    console.log("scannedData: ", scannedData);
    

    return (
        <ImageBackground
            source={require('../../assets/images/city_bg.jpeg')}
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
                    setCapturedImagesForHealthy={setCapturedImagesForHealthy}
                    setIsOpenCamera={setIsOpenCamera}
                    setScannedData={setScannedData}
                    setCancelOrReported={setCancelOrReported}
                    scanType={scanType}
                    diseaseType={diseaseType}
                />

            ) : imageForScanning && !scannedData ? (
                <Scanning 
                    imageForScanning={imageForScanning} 
                    capturedImagesForHealthy={capturedImagesForHealthy}
                    scanType={scanType}
                />

            ) : imageForScanning && scannedData ? (
                <ScannedImageResult 
                    scannedData={scannedData} 
                    imageForScanning={imageForScanning}
                    setCancelOrReported={setCancelOrReported}
                    scanType={scanType}
                    capturedImagesForHealthy={capturedImagesForHealthy}
                />

            ) : (
                <View style={styles.capture_methods_container}>
                    <Pressable style={styles.pressableContainer} onPress={openDiseasedLeafCameraScan}>
                        <View style={styles.flex_row_center}>
                            <Image source={require('../../assets/images/diseased_leaf_scan.png')} style={{ width: 30, height: 60 }} />
                            <Text style={styles.text}>Diseased Durian Leaf Scan</Text>
                        </View>
                    </Pressable>

                    <Pressable style={styles.pressableContainer} onPress={openDiseasedFruitCameraScan}>
                        <View style={styles.flex_row_center}>
                            <Image source={require('../../assets/images/diseased_scan_icon.png')} style={{ width: 50, height: 70 }} />
                            <Text style={styles.text}>Diseased Durian Fruit Scan</Text>
                        </View>
                    </Pressable>

                    <Pressable style={styles.pressableContainer} onPress={openHealthyCameraScan}>
                        <View style={styles.flex_row_center}>
                            <Image source={require('../../assets/images/healthy_scan_icon.png')} style={{ width: 50, height: 50 }} />
                            <Text style={styles.text}>Healthy Durian Camera</Text>
                        </View>
                    </Pressable>

                    <Pressable style={styles.pressableContainer} onPress={() => openGallery(setImageForScanning, setScannedData, setCancelOrReported, setScanType)}>
                        <View style={styles.flex_row_center}>
                            <Image source={require('../../assets/images/open_gallery_icon.png')} style={{ width: 50, height: 50 }} />
                            <Text style={styles.text}>Upload Gallery</Text>
                        </View>
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
        fontSize: 16,
        color: '#ffff'
    },

    flex_row_center: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        padding: 5,
        borderRadius: 10
    },

    capture_methods_container: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 15,
        paddingTop: 100,
        gap: 30,
    },
    pressableContainer: {
        width: '80%', // Adjust the width as needed
        borderWidth: 1,
        borderColor: '#9CA3AF',
        padding: 5,
        borderRadius: 10,
        alignItems: 'center', // Center the content horizontally
    },

    
});
