import { FontAwesome } from "@expo/vector-icons";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import QueryProviderWrapper from "../QueryClientProvider";
import { RegionType } from "@/types/reports";
import React, { Suspense } from "react";

// Lazy load the ReportsTable component
const ReportsTable = React.lazy(() => import('./ReportsTable'));

interface ReportsModalProps {
    setRegion: React.Dispatch<React.SetStateAction<RegionType>>;
    setReportsModal: React.Dispatch<React.SetStateAction<boolean>>;
    setResolved: React.Dispatch<React.SetStateAction<boolean>>;
    isVisible: boolean;
    onClose: () => void;
}

const ReportsModal: React.FC<ReportsModalProps> = ({ setRegion, setReportsModal, setResolved, isVisible, onClose }) => {

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.bgBlur} />

                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Text style={{ fontWeight: '700', fontSize: 20 }}>Reported Cases</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <FontAwesome name="close" size={30} color="black" />
                        </TouchableOpacity>
                    </View>

                    <QueryProviderWrapper>
                        <Suspense fallback={
                            <View style={styles.loading_map_message_container}>
                                <Text style={styles.loading_text}>Loading Reports...</Text>
                            </View>
                        }
                        
                        >
                            <ReportsTable setResolved={setResolved} setRegion={setRegion} setReportsModal={setReportsModal} />
                        </Suspense>
                    </QueryProviderWrapper>

                </View>

            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 600,
    },
    bgBlur: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "gray",
        opacity: 0.75,
        zIndex: 599,
    },
    contentContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        width: "95%",
        height: "80%",
        alignItems: "center",
        position: "absolute",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        zIndex: 1000
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: '10%',
        justifyContent: "center",
    },
    title: {
        color: "#333",
        fontSize: 24,
        fontWeight: "bold",
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 10,
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
        fontSize: 20
    }
});

export default ReportsModal;
