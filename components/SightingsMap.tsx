import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Text, Image, Pressable} from 'react-native';
import { MolluskSightingsType } from '@/types/mollusk';

import Colors from '@/constants/Colors';
import React from 'react';


const MolluskSightingsMap = ({molluskName, molluskSightings, setOpenSightingsMap}: {
  molluskName: string,
  molluskSightings: MolluskSightingsType[],
  setOpenSightingsMap: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    const { decimalLatitude, decimalLongitude } = molluskSightings[0]

    const initialRegion = {
        latitude: decimalLatitude,
        longitude: decimalLongitude,
        latitudeDelta: 100,  
        longitudeDelta: 100,
    };

    
    return (
        <View style={styles.container}>

            <MapView initialRegion={initialRegion} style={styles.map}>

                {molluskSightings && molluskSightings?.map((data, index) => (

                <Marker
                    key={index}
                    coordinate={{ latitude: data.decimalLatitude, longitude: data.decimalLongitude }}
                    pinColor="red"
                >

                    <Callout>
                    <View style={styles.calloutContainer}>
                        <Text style={styles.report_details_text}>Sightings Details</Text>
                        <Text style={styles.calloutText}>{molluskName}</Text>

                        {data.country && <Text style={styles.calloutText}>{data.country}</Text>}
                        
                
                        <Text>
                        {data.decimalLatitude}° N, {data.decimalLongitude}° E
                        </Text>

                    </View>

                    </Callout>

                </Marker>

                ))}

            </MapView>

            <View style={styles.legendContainer}>

                <View style={styles.legendItem}>
                    <Image source={require('../assets/images/red_marker.png')} style={styles.markerImage} />
                    <Text>Commonly Sighted Mollusk Area</Text>
                </View>

            </View>

            <View style={styles.button_container}>
                <Pressable
                    style={styles.button_cancel}
                    onPress={() => setOpenSightingsMap(false)}
                >
                    <Text style={styles.text}> Return to Report </Text>
                </Pressable>
            </View>

           

        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  legendContainer: {
    position: 'absolute',
    top: 20,
    right: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },

  markerImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },


  report_details_text: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 5,
  },

  calloutContainer: {
    width: 200,
    padding: 10,
  },

  calloutText: {
    fontSize: 12,
    marginBottom: 5,
  },

  button_container: {
    width: '100%',
    height: '5%',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    paddingHorizontal: 10
  },

  button_cancel: {
    backgroundColor: Colors.dark.background,
    color: '#fff',
    width: '100%',
    height: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    
  },

  text: {
    color: Colors.light.background,
    fontWeight: "bold",
    textAlign: 'center',
  },

});

export default MolluskSightingsMap;
