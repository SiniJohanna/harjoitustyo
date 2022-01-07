import React, {useState, useEffect} from 'react';
import { Text, View, FlatList, Alert } from 'react-native';
import{ ListItem } from'react-native-elements';
import { initializeApp } from 'firebase/app';
import{ getDatabase, ref, onValue, remove } from "firebase/database";

export default function SavedAreas({navigation}) {

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

      const [items, setItems] =useState([{}]);
      const [itemsWithKeys, setKeys] = useState([]);

      useEffect(() =>  {
        const itemsRef= ref(database, 'myParkingAreas/') 
        onValue(itemsRef, (snapshot) => {
          const data= snapshot.val();
          console.log(data)
            setItems(Object.values(data));
            console.log(items)
            setKeys(data)
        })
    }, []);

    const deleteItem= (item) =>{
        Alert.alert(
            "Do you want to delete the address?",
            "The address will be deleted permanently.",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              {
                text: "OK", 
                onPress: () => { console.log(item.id)
                  const key = Object.keys(itemsWithKeys).find(key => itemsWithKeys[key] === item);
                  remove(ref(database, `myParkingAreas/${key}`));
                }
              }
            ]
          );
        
        
        
    }

    return(
        <View>
            <FlatList
      ListHeaderComponent= {<Text >My destinations</Text>}
      keyExtractor={(item , index) => index.toString()}
      data={ items }
      renderItem={({item}) => (
          <ListItem bottomDivider>
            <ListItem.Content>
                <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
              <ListItem.Title
              onLongPress={()=> deleteItem(item)}>{item.address}</ListItem.Title>
              <ListItem.Subtitle 
              onPress={() => navigation.navigate('Parking area', {id: item.id})}
              >Show on map</ListItem.Subtitle>
              </View>
            </ListItem.Content>
          </ListItem>)
      }
      />
        </View>
    )
}