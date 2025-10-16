import * as React from 'react';
import { p, div } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen() {
    return (
        <div style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <div>Home Screen</p>
        </div>
    );
}


const Stack = createNativeStackNavigator();
function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'My home',
                }}
            />
        </Stack.Navigator>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    );
}