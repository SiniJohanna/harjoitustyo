import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import MapView, { Geojson, Marker, Callout} from 'react-native-maps';
import ShowMap from './components/MapScreen';

export default function App() {

  const [areas, setAreas] = useState({});

  useEffect(() => {
    fetchParkinglots();
    }, []);
  
    const fetchParkinglots = async()   => {
      let url = 'https://pubapi.parkkiopas.fi/public/v1/parking_area/'
      do {
          try {
          const response = await fetch(url);
          const data = await response.json();
          setAreas(data);
          

          url = data.next;
          }
          catch(error) {
          console.error(error);
          }
        } while (url !== null)

    }

  
  return (
    <MapView
        style={styles.container}
        initialRegion={{
          latitude:60.171520647632406,
          longitude:24.95095348096506,
          latitudeDelta:0.0322,
          longitudeDelta:0.0221,}} >
{/**   console.log(areas.features[0].properties.capacity_estimate)*/}
            <Geojson
            tappable 
            geojson= {areas}
            strokeColor='blue'
            title='parkki'
            onPress={()=>{ console.log(areas.features[0].properties.capacity_estimate)}}
            >
            </Geojson>

            {areas.features.map((feature)=>
            {console.log(feature.properties.capacity_estimate),
              <Marker
              key= {feature.id}
              title= {feature.properties.capacity_estimate}
              coordinates= {{
                latitude: feature.geometry.coordinates[0][0][0][1],
                longitude: feature.geometry.coordinates[0][0][0][0]
              }} />
            }
            )}
           
           
            <Marker 
            title='hello'
            coordinate={{
              latitude: 60.17150364378772,
              longitude: 24.952267526407198,
            }}/>
        </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
