import { FetchReports } from "@/api/get/reports";
import { UpdateReportStatus } from "@/api/put/reports";
import { RegionType, ReportedCasesTypes } from "@/types/reports";
import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView, FlatList, View, Text, StyleSheet, Button } from "react-native";
import React from 'react';

const myItemSeparator = () => {
    return <View style={{ height: 1, backgroundColor: "grey", marginHorizontal: 10 }} />;
};

const myListEmpty = () => {
    return (
        <View style={{ alignItems: "center" }}>
            <Text style={styles.item}>No data found</Text>
        </View>
        );
};


function ReportsTable({setResolved, setRegion, setReportsModal}: {
  setResolved: React.Dispatch<React.SetStateAction<boolean>>,
  setRegion: React.Dispatch<React.SetStateAction<RegionType>>,
  setReportsModal: React.Dispatch<React.SetStateAction<boolean>>
}) {

  const queryClient = useQueryClient()
  const { data }: UseQueryResult<ReportedCasesTypes[], Error> = useQuery(
      {
        queryKey: ['reports'],
        queryFn: FetchReports,
      }
  );
  const reports = data;

  const mutation = useMutation({
    mutationFn: UpdateReportStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setResolved(true)
    }
  })

  const handleUpdate = (report_id: number) => {
    mutation.mutate(report_id);
  };

  const ViewMapLocation = (longitude: number, latitude: number) => {
    setRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 2.2022,
      longitudeDelta: 2.2021,
    });

    setReportsModal(false)
  }

 
  
//   kwaa ang longitude og latitude sa database para sa function sa view map

  const renderItem = ({ item }: { item: ReportedCasesTypes }) => (
    <View style={styles.row}>
      <Text 
        style={styles.item}
        numberOfLines={1} // Limits text to 1 line
        ellipsizeMode="tail" // Adds ellipsis at the end if text overflows
      >
        {item.city} {item.district} {item.province}
      </Text>

      <Text style={styles.item}>{item.mollusk_type}</Text>

      <Button title="View Map" onPress={() => ViewMapLocation(item.longitude, item.latitude)} color="#2196F3" />
      {
        item.status === "Resolved" 
        ? <Text style={styles.resolved_text}>Resolved</Text> 
        : <Button title="Resolve" onPress={() => handleUpdate(item.report_id) } color="#4CAF50" />
      }
      
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerItem}>Address</Text>
      <Text style={styles.headerItem}>Type</Text>
      <View style={{flexDirection: 'row', justifyContent: 'center', width: '40%'}}>
      <Text style={styles.headerItem}>Actions</Text>

      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <FlatList
          data={reports}
          renderItem={renderItem}
          keyExtractor={(item) => item.report_id.toString()}
          ItemSeparatorComponent={myItemSeparator}
          ListEmptyComponent={myListEmpty}
          ListHeaderComponent={renderHeader}
          style={styles.scrollView}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '107%',
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
  },

  scrollView: {
    flex: 1,
  },

  header: {
    fontSize: 30,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    width: '100%',
    gap: 3
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'grey',
  },

  headerItem: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center'
  },

  item: {
    fontSize: 13,
    width: '25%'
  },

  resolved_text: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'green'
  }
});

export default ReportsTable