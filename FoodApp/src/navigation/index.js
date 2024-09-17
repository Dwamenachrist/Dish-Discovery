import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

//Screens
import WelcomeScreen from '../Screens/WelcomeScreen';
import HomeScreen from "../Screens/HomeScreen";
import RecipeDetailScreen from "../components/RecipeDetailScreen";

const Stack = createNativeStackNavigator();

const Index = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Welcome' screenOptions={{headerShown: false}}>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Welcome" component={WelcomeScreen}/>
                <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Index