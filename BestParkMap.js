import React, { useState, useEffect } from 'react';
import { Text, View, Alert, } from 'react-native';
import MapView, { Geojson, Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';


export default function MyPark({route}) {

    const {id} = route.params;
    const [parkinglot, setParkinglot] = useState(null);
    const [myLocation, setMyLocation] = useState(null);
    const [routeShape, setRouteShape] = useState(null);
    const [region, setRegion] = useState(
        {
            latitude: 60.192059,
            longitude: 24.945831,
            latitudeDelta:0.0322,
            longitudeDelta:0.0221,
          }
    )

    const getParinglot= async(id) => { 
        let url = `https://pubapi.parkkiopas.fi/public/v1/parking_area/${id}`
        try {
            const response = await fetch(url);
            const data = await response.json();
            setRegion(
                {
                    latitude: data.geometry.coordinates[0][0][0][1],
                    longitude: data.geometry.coordinates[0][0][0][0],
                    latitudeDelta:0.00322,
                    longitudeDelta:0.00221,
                  }
            )
            setParkinglot(data)
            console.log(data);
            }
            catch(error) {
            console.error(error);
            }
    }

    console.log(id)
    useEffect(() => {
        getParinglot(id);
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

        const getRoute = (destination, myLocation) => {
      
            let sessionId;
            console.log('tap')
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
    

    return(
         <MapView
        style={{flex:1, width: "100%", height: "100%"}}
        region={region}
        >
           
            {parkinglot && 
            <Geojson
            tappable
            geojson={{
                type: 'FeatureCollection',
                features: [parkinglot,
                {
                    geometry: {
                        coordinates: [parkinglot.geometry.coordinates[0][0][0][1],parkinglot.geometry.coordinates[0][0][0][1]],
                        type: 'Point'
                    },
                    type: 'Feature'
                }]
            }}
            strokeColor='blue'
            strokeWidth={1}
            fillColor='green'
            onPress={() => console.log('tap')} />
            
            }
            <Marker 
                
                pinColor='green'
                coordinate={region}
                >
                  <Callout onPress={() => getRoute(region, myLocation)}>
                    <View>
                      <Text>Tap icon on bottom right to open in Google Maps</Text>
                      
                    </View>
                  </Callout>
                </Marker>
            
        </MapView>
    )
}