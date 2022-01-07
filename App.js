import React from 'react';
import ShowMap from './components/MapScreen';
import StackNav from './components/StackNav';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { Ionicons} from '@expo/vector-icons'; 

export default function App() {

  const Tab   = createBottomTabNavigator();

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
  
      if (route.name === 'Parking areas map') {
        iconName = 'location';
      } else if (route.name === 'Favorites') {
        iconName = 'star';
      }
  
      return <Ionicons name={iconName} size={size} color={color} />;
    }
  });


  
  return (

    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name='Parking areas map' component={ShowMap} />
        <Tab.Screen name='Favorites' component={StackNav}/>
      </Tab.Navigator>
    </ NavigationContainer>

  );
}
