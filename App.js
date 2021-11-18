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

import { WebView } from "react-native-webview";
import { isVideo } from "is-youtube-url";
import { AntDesign } from "@expo/vector-icons";

// components
import Header from "./components/Header";
import DownloadOptions from "./components/DownloadOptions";
import {getMediaPermission,getNotificationPermission} from "./helperFunction"



export default function App() {
  const [url, setUrl] = useState("https://m.youtube.com/");
  const [canGoBack, setCanGoBack] = useState(false);
  const webView = React.useRef();


  useEffect(()=>{
    getMediaPermission()
    getNotificationPermission()
  },[])


  const handleBack = useCallback(() => {
    if (canGoBack && webView.current) {
      webView.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
    };
  }, [handleBack]);

  return (
    <SafeAreaView style={styles.container}>
      <Header url={url} setUrl={setUrl} />
      <WebView
        injectedJavaScript={`
       (function() {
         function wrap(fn) {
           return function wrapper() {
             var res = fn.apply(this, arguments);
             window.ReactNativeWebView.postMessage(window.location.href);
             return res;
           }
         }
         history.pushState = wrap(history.pushState);
         history.replaceState = wrap(history.replaceState);
         window.addEventListener('popstate', function() {
           window.ReactNativeWebView.postMessage(window.location.href);
         });
       })();
       true;
     `}
        onMessage={(event) => {
          setUrl(event.nativeEvent.data);
        }}
        source={{ uri: url }}
        ref={webView}
        onNavigationStateChange={(newNavState) => {
          let { url, canGoBack } = newNavState;
          setUrl(newNavState.url);
          setCanGoBack(canGoBack);
        }}
        style={{ flex: 1 }}
        allowsBackForwardNavigationGestures
      />
      {isVideo(url) ? <DownloadOptions url={url} /> : null}
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
  videoDownloadOption: {
    backgroundColor: "#ff0000",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    padding: 7,
    borderRadius: 50,
  },
});
