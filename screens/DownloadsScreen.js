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



export default function DownloadsScreen() {

  return (
    <SafeAreaView style={styles.container}>
    <Text>Show Downloads</Text>
      <Text>Ad</Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 28,
  },

});
