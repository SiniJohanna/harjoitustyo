import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SavedAreas from './Favorites';
import MyPark from './BestParkMap';

const Stack = createNativeStackNavigator();

export default function StackNav() {
    return (
        <NavigationContainer independent={true}>
          <Stack.Navigator>
            <Stack.Screen name="Saved locations" component={SavedAreas} />
            <Stack.Screen name="Parking area" component={MyPark} />
          </Stack.Navigator>
        </NavigationContainer>
      );
}