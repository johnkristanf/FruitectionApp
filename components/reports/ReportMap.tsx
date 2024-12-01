import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Text, Image } from 'react-native';

import { FetchReports } from '@/api/get/reports';
import { RegionType, ReportedCasesTypes } from '@/types/reports';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react';

const ReportsMap = ({ region }: { region: RegionType }) => {
  const { data }: UseQueryResult<ReportedCasesTypes[], Error> = useQuery({
    queryKey: ['reports'],
    queryFn: FetchReports,
  });

  const reports = data;
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current) mapRef.current.animateToRegion(region, 600);
  }, [region]);

  return (
    <View style={styles.container}>
      <MapView 
        region={region} 
        ref={mapRef} 
        style={styles.map}
      >
        {/* Render Markers */}
        {reports && reports?.map((report) => (
          <Marker
            key={report.report_id}
            coordinate={{ latitude: report.latitude, longitude: report.longitude }}
            pinColor={report.status === 'Resolved' ? 'green' : 'red'}
          >
            <Callout>
              <View style={styles.calloutContainer}>
                <Text style={styles.report_details_text}>Report Details</Text>
                <Text style={styles.calloutText}>{report.reporter_name}</Text>
                <Text style={styles.calloutText}>{report.mollusk_type}</Text>
                <Text style={styles.calloutText}>
                  {report.city} {report.district}, {report.province}
                </Text>
                <Text style={styles.calloutText}>{report.reportedAt}</Text>
                <Text style={styles.calloutText}>
                  {report.latitude}° N, {report.longitude}° E
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <Image source={require('../../assets/images/red_marker.png')} style={styles.markerImage} />
          <Text>In Progress</Text>
        </View>

        <View style={styles.legendItem}>
          <Image source={require('../../assets/images/green_marker.png')} style={styles.markerImage} />
          <Text>Resolved</Text>
        </View>
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
    top: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
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
});

export default ReportsMap;
