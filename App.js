import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
} from "react-native";

// screens
import HomeScreen from "./screens/HomeScreen"
import DownloadsScreen from "./screens/DownloadsScreen"

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Downloads" component={DownloadsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


