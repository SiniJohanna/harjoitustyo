import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, Overlay, ThemeProvider } from 'react-native-elements';
import { StyleSheet, TextInput, Text, View, Alert, KeyboardAvoidingView, Modal, DrawerLayoutAndroidBase } from 'react-native';
import MapView, { Geojson, Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import{ initializeApp} from'firebase/app';
import{ getDatabase, push, ref }  from"firebase/database";

export default function ShowMap() {

  const firebaseConfig = {
    apiKey: "AIzaSyCDlTBFKD6KiwMeVEvwXtqA9e5v3q7BJuQ",
    authDomain: "harjoitustyo-hkipark.firebaseapp.com",
    databaseURL: "https://harjoitustyo-hkipark-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "harjoitustyo-hkipark",
    storageBucket: "harjoitustyo-hkipark.appspot.com",
    messagingSenderId: "263399296731",
    appId: "1:263399296731:web:9f5d3c141b7ae6637686fe"
  };

  const app = initializeApp(firebaseConfig);
  const database= getDatabase(app);

    const [visible, setVisible] = useState(true);
    const [areas, setAreas] = useState(null);
    let zones = [];
    let reserved = '';
    const [address, setAddress] = useState('');
    const [areaId, setAreaId]= useState(null);
    const [destination, setDestination] = useState(
      {
        latitude:60.17150364378772,
        longitude:24.952267526407198,
        latitudeDelta:0.00322,
        longitudeDelta:0.00221,
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
    const [routeShape, setRouteShape] = useState(null);

  useEffect(() => {
    fetchParkinglots();
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
          zones.push(data);
          url = data.next;
          }
          catch(error) {
          console.error(error);
          }
        } while (url !== null)
       setAreas(zones);
       setVisible(false)

    }

    const MarkerData = (id, capacity, lat, lng) => {
      setAreaId(id);
      console.log(lat, lng)
     let url = `https://pubapi.parkkiopas.fi/public/v1/parking_area_statistics/${id}`
      fetch(url)
      .then(response=>response.json())
      .then(responseJson=>{
       // setPCount(responseJson.current_parking_count.toString()) //tämän tila päivittyy yhden painalluksen myöhässä
        reserved = responseJson.current_parking_count //tämän arvo ei jostain syystä mene returniin ekalla klikkauksella
       // console.log(responseJson)
       // console.log(pCount)
        console.log(reserved)
      }
      )
      if (capacity) {
        return (
        
          Alert.alert('Estimated capacity: ' +  capacity + '\n' + 'Currently reserved: ' + reserved ,
          'Press OK to go to this parking area?',
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            {
              text: "OK", 
              onPress: () => {
                setDestination(
                  {
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta:0.00322,
                    longitudeDelta:0.00221,
                  }
                )
                console.log(destination);
              }
            }
          ]
          
          )
         
         
        );
      } else {
        return(
          Alert.alert('Information is not currently available.',
          'Do you still want to go to this parking area?',
          [
            {
              text: 'No thnank you.',
              onPress: ()=>{console.log('Cancel presses')},
              style: 'cancel'
            },
            {
              text: 'Yes, please!', 
              onPress: () => {
                setDestination(
                  {
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta:0.00322,
                    longitudeDelta:0.00221,
                  }
                )
                console.log('key');
              }
            }
          ])
        )
      }
      }

    
      
      

    const getCoordinates = address => {
      fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=KZm8i8wxroMvRbCHHiSfnrJzWshuzTma&location=${address}`)
      .then(response=>  response.json())
      .then(responseJson=>{ 
        setDestination(
          {
            latitude: responseJson.results[0].locations[0].displayLatLng.lat,
            longitude: responseJson.results[0].locations[0].displayLatLng.lng,
            latitudeDelta:0.00322,
            longitudeDelta:0.00221,
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
        console.log('Kohteeseen on ' + responseJson.route.distance + ' mailia')
        fetch(`http://www.mapquestapi.com/directions/v2/routeshape?key=KZm8i8wxroMvRbCHHiSfnrJzWshuzTma&sessionId=${sessionId}&mapWidth=320&mapHeight=240&mapScale=1733371&mapLat=${destination.latitude}&mapLng=${destination.longitude}`)
      .then(response=>response.json())
      .then(responseJson=>{
        console.log(responseJson.route.shape.shapePoints)
        setRouteShape(responseJson.route.shape.shapePoints); //Miten näistä saa piirrettyä reitin?
      })
      })
      
      .catch(error=> { Alert.alert('Error',error); });
  
    }

const saveParkingArea= () =>{
  push(ref(database, 'myParkingAreas/'), {'id': areaId, 'address': address});
  console.log(areaId + ' ' + address)
  setAddress('');
}

  return (

    <SafeAreaProvider>
      <ThemeProvider>
        
        <View style={styles.container}>
        <Overlay isVisible={visible}>
          <Text>Loading parking areas, please wait...</Text>
        </Overlay>
        <MapView
            style={styles.map}
            region={destination} >

                { areas && areas.map((area) =>
                    area.features.map(feature=>
                        <Geojson
                        key = {feature.id}
                        tappable
                        geojson = {{
                            type: 'featureCollection',
                            features: [feature]
                        }}
                        strokeColor='blue'
                        strokeWidth={1}
                        fillColor='green'
                        onPress={()=>{
                          MarkerData(feature.id, feature.properties.capacity_estimate, feature.geometry.coordinates[0][0][0][1], feature.geometry.coordinates[0][0][0][0]);}}
                        >
                        </Geojson>
                        
                        ))
                }
                
              
                <Marker 
                title='You are here'
                coordinate={myLocation}>
                </Marker>
                <Marker 
                title={address}
                pinColor='green'
                coordinate={destination}
                >
                  <Callout onPress={() => getRoute(destination, myLocation)}>
                    <View>
                      <Text>Tap icon on bottom right to open in Google Maps</Text>
                      <Text>{address}</Text>
                    </View>
                  </Callout>
                </Marker>
            </MapView>
            <View>
            <TextInput 
            placeholder='Destination address'
            style={styles.input}
            onChangeText={address=> setAddress(address)}
            value={address} />
            <Button onPress={() => getCoordinates(address)} title='Show destination' />
            <Button onPress={()=>saveParkingArea(destination)} title='Save parking area location to favorites'/>
              </View>
        </View>

      </ThemeProvider>
    </SafeAreaProvider>

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