import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, TextInput, Text, View, Alert } from 'react-native';
import MapView, { Geojson, Marker, Callout} from 'react-native-maps';
import ShowMap from './components/MapScreen';
import * as Location from 'expo-location';

export default function App() {

  const [areas, setAreas] = useState({});
  let zones = [];
  let stats = [];
  const [address, setAddress] = useState('');
  const [destination, setDestination] = useState(
    {
      latitude:60.17150364378772,
      longitude:24.952267526407198,
      latitudeDelta:0.0322,
      longitudeDelta:0.0221,
    }
  )
  const [myLocation, setMyLocation] = useState(
    {
      latitude: 60.17150364378772,
      longitude: 24.952267526407198,
      latitudeDelta: 0.0322,
      longitudeDelta: 0.0221,
    }
  )

  useEffect(() => {
    fetchParkinglots();
   // getStatistics();
    (async() => {
      let  { status} = await Location.requestForegroundPermissionsAsync();
      if  (status!==   'granted') {
        Alert.alert('No   permissionto get location')
        return;
      }
      let  location= await Location.getCurrentPositionAsync({});
      setMyLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      })
    })();
    }, []);
  
    const fetchParkinglots = async()   => {
      let url = 'https://pubapi.parkkiopas.fi/public/v1/parking_area/'
      do {
          try {
          const response = await fetch(url);
          const data = await response.json();
          setAreas(data);
          zones.push(data);

          url = data.next;
          }
          catch(error) {
          console.error(error);
          }
        } while (url !== null)
       // console.log(zones[0])
       

    }

    const getStatistics = async() => {
      let url = 'https://pubapi.parkkiopas.fi/public/v1/parking_area_statistics/'
   //  do {
        try {
          const response = await fetch(url);
          const statdata = await response.json();
          stats.push(statdata.results);
         // console.log(statdata)
          url = statdata.next
        }
        catch(error) {
        console.error(error);
      }
   //   } while (url !== null)
   //   console.log(stats);
    }

    const getCoordinates = address => {
      console.log(zones);
      fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=KZm8i8wxroMvRbCHHiSfnrJzWshuzTma&location=${address}`)
      .then(response=>  response.json())
      .then(responseJson=>{ 
        setDestination(
          {
            latitude: responseJson.results[0].locations[0].displayLatLng.lat,
            longitude: responseJson.results[0].locations[0].displayLatLng.lng,
            latitudeDelta:0.0322,
            longitudeDelta:0.0221,
          }
        )
      })
      .catch(error=> { Alert.alert('Error',error); });
    }

    const getRoute = (destination, myLocation) => {
      
      let sessionId;
      console.log(myLocation.latitude + ',' + myLocation.longitude);
      console.log(destination.latitude + ',' + destination.longitude);
      fetch(`http://www.mapquestapi.com/directions/v2/route?key=KZm8i8wxroMvRbCHHiSfnrJzWshuzTma&from=${myLocation.latitude + ',' + myLocation.longitude}&to=${destination.latitude + ',' + destination.longitude}`)
      .then(response=> response.json())
      .then(responseJson=>{
        sessionId = responseJson.route.sessionId;
      })
      .catch(error=> { Alert.alert('Error',error); });
      
    //  fetch(`http://www.mapquestapi.com/directions/v2/routeshape?key=KZm8i8wxroMvRbCHHiSfnrJzWshuzTma&sessionId=${sessionId}&mapWidth=320&mapHeight=240&mapScale=1733371&mapLat=${destination.latitude}&mapLng=${destination.longitude}`)
    //  .then(response=>response.json())
    //  .then(responseJson=>{
    //    console.log(responseJson)
    //  })
       
    }

  
  

  
  return (
    <View style={styles.container}>
    <MapView
        style={styles.map}
        region={destination} >
          
          
{/**   console.log(areas.features[0].properties.capacity_estimate)
          {zones.map(zone=>{
            <Geojson
            tappable
            geojson= {zone}
            />
          })}

            <Geojson
            tappable 
            geojson= {areas}
            strokeColor='blue'
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
           */}
           <Geojson
            tappable 
            geojson= {areas}
            strokeColor='blue'
            onPress={()=>{ console.log('you tapped')}}
            >
            </Geojson>


           
            <Marker 
            title='You are here'
            coordinate={myLocation}/>
            <Marker 
            title={address}
            coordinate={destination}
            >
              <Callout onPress={() => getRoute(destination, myLocation)}>
                <View>
                  <Text>Go here</Text>
                  <Text>{address}</Text>
                </View>
              </Callout>
            </Marker>
        </MapView>
        <View>
        <TextInput 
        style={styles.input}
        onChangeText={address=> setAddress(address)}
        value={address} />
        <Button onPress={() => getCoordinates(address)} title='Show' />
      </View>
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  input: {
    width:200,
    borderColor:'gray',
    borderWidth:1
  },
  map: {
    flex:1,
    width: "100%",
    height: "100%"
  }

  
});
