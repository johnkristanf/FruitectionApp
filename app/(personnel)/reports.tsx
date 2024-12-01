import React, { useEffect, useState, Suspense } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import QueryProviderWrapper from "@/components/QueryClientProvider";
import { RegionType } from "@/types/reports";

const initialRegion = {
    latitude: 7.3042,
    longitude: 126.0893,
    latitudeDelta: 1.7022,
    longitudeDelta: 1.7021,
};

// Lazy load the ReportsModal and ReportsMap components
const ReportsModal = React.lazy(() => import('@/components/reports/ReportsModal'));
const ReportsMap =   React.lazy(() => import('@/components/reports/ReportMap'));

export default function ReportsPage() {
    const [reportsModal, setReportsModal] = useState<boolean>(false);
    const [resolved, setResolved] = useState<boolean>(false);
    const [region, setRegion] = useState<RegionType>(initialRegion);

    useEffect(() => {
        if (resolved) {

            Alert.alert(
                "Reported Case Resolved",
                "Successfully resolve the reported case",
                [
                    {
                      text: "Return to Report Map",
                      onPress: () => {
                        router.push("/(personnel)/reports");
                        setResolved(false);
                      },

                    },
                ],
                { cancelable: false }
              );

            
        }
    }, [resolved]);

    return (
        <>
            {reportsModal && (
                <Suspense fallback={
                    <View style={styles.loading_map_message_container}>
                        <Text style={styles.loading_text}>Loading Reports Table...</Text>
                    </View>
                }
                
                >
                    <ReportsModal
                        setRegion={setRegion}
                        setReportsModal={setReportsModal}
                        setResolved={setResolved}
                        isVisible={true}
                        onClose={() => setReportsModal(false)}
                    />
                </Suspense>
            )}

            <View style={styles.container}>
                <View style={styles.flex_row_between}>
                    <Pressable
                        style={styles.reports_button}
                        onPress={() => setReportsModal(true)}
                    >
                        <Text style={{ color: 'white' }}>
                            <FontAwesome name="warning" size={15} color="white" />
                            &nbsp; Reported Cases
                        </Text>
                    </Pressable>

                    <FontAwesome
                        name='sign-out'
                        size={20}
                        color="black"
                        onPress={() => router.replace('/')}
                    >
                        &nbsp; Sign Out
                    </FontAwesome>
                </View>

                <QueryProviderWrapper>
                    <Suspense fallback={
                        <View style={styles.loading_map_message_container}>
                            <Text style={styles.loading_text}>Loading Reports Map...</Text>
                        </View>
                    }
                    
                    >
                        <ReportsMap region={region} />
                    </Suspense>
                </QueryProviderWrapper>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flex_row_between: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '15%',
        paddingHorizontal: 15
    },
    map: {
        width: '100%',
        height: '100%',
    },
    reports_button: {
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#1E90FF',
        color: 'white'
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
