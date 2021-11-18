import React, { useCallback, useMemo, useRef, useState,useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { AntDesign } from "@expo/vector-icons";
import { downloadVideoAndAudio, getMediaPermission,getNotificationPermission} from "../helperFunction";
import {
  AndroidImportance,
  AndroidNotificationVisibility,
  NotificationChannel,
  NotificationChannelInput,
  NotificationContentInput,
} from "expo-notifications";
import { downloadToFolder } from "expo-file-dl";

import * as MediaLibrary from 'expo-media-library';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const channelId = "DownloadInfo";

const DownloadOptions = ({ url }) => {
  const [uri, setUri] = useState("");
  const [filename, setFilename] = useState("filename.mp4");
  const [downloadProgress, setDownloadProgress] = useState("0%");

  async function setNotificationChannel() {
    const loadingChannel: NotificationChannel | null = await Notifications.getNotificationChannelAsync(
      channelId
    );

    // if we didn't find a notification channel set how we like it, then we create one
    if (loadingChannel == null) {
      const channelOptions: NotificationChannelInput = {
        name: channelId,
        importance: AndroidImportance.HIGH,
        lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
        sound: "default",
        vibrationPattern: [250],
        enableVibrate: true,
      };
      await Notifications.setNotificationChannelAsync(
        channelId,
        channelOptions
      );
    }
  }

  useEffect(() => {
    setNotificationChannel();
  });

  
  const downloadProgressUpdater = ({
    totalBytesWritten,
    totalBytesExpectedToWrite,
  }: {
    totalBytesWritten: number;
    totalBytesExpectedToWrite: number;
  }) => {
    const pctg = 100 * (totalBytesWritten / totalBytesExpectedToWrite);
    console.log(`${pctg.toFixed(0)}%`);
    setDownloadProgress(`${pctg.toFixed(0)}%`);
  };

useEffect(()=>{
  cam()
  getMediaPermission();
  getNotificationPermission();
},[])

const cam = async () => {
  const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
}
  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const [videoFormat, setVideoFormat] = useState([]);
  const [audioFormat, setAudioFormat] = useState([]);

  React.useEffect(() => {
    loadFormats(url);
  }, []);

  const loadFormats = async (url) => {
    const video = await downloadVideoAndAudio(url, "video");
    const audio = await downloadVideoAndAudio(url, "audio");
    setVideoFormat(video);
    setAudioFormat(audio);
  };

  const calculateFileSize = (duration,fps,height,width) => {
    // convert MS to Seconds
    let durationinSeconds = duration * 1000;

    // calculating total numbers of frames in video
    let numberOfFrames = durationinSeconds * fps;
    let frameSize = (height * width * 24) / 8 * 1024
    console.log(numberOfFrames * frameSize / 1024)
    return numberOfFrames * frameSize / 1024;

  }
  // renders
  return (
    <BottomSheetModalProvider>
      <View>
        <TouchableOpacity
          style={styles.videoDownloadOption}
          onPress={handlePresentModalPress}
        >
          <AntDesign
            name="arrowdown"
            // size={20}
            color="#ffffff"
            style={{ fontSize: 18 }}
          />
        </TouchableOpacity>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <View style={styles.contentContainer}>
            <Text style={{ marginLeft: 7, fontWeight: "500" }}>Video</Text>
            <View style={styles.downloadOptionContainer}>
              {videoFormat.map((format,index) => (
                <TouchableOpacity style={styles.downloadOption} key={index}
                onPress={async () => {
                  await downloadToFolder(format.url, filename, "GrabTube", channelId, {
                downloadProgressCallback: downloadProgressUpdater,
              });
                }}>
                  <Text style={styles.downloadOptionQuality}>
                    {format.qualityLabel} 
                  </Text>
                  <Text style={styles.downloadOptionSize}>-- MB</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={{ marginLeft: 7, fontWeight: "500" }}>Audio</Text>
            <View style={styles.downloadOptionContainer}>
              {audioFormat.map((format,index) => (
                <TouchableOpacity style={styles.downloadOption} key={index}>
                  <Text style={styles.downloadOptionQuality}>MP3</Text>
                  <Text style={styles.downloadOptionSize}>-- Mb</Text>
                </TouchableOpacity>
              ))}
            </View>
    
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    // justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 7,
    justifyContent: "flex-start",
    // alignItems: "center",
  },
  videoDownloadOption: {
    flex: 1,
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
  downloadOptionContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    alignItems: "flex-start",
  },
  downloadOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#c2c2c2",
    borderRadius: 100,
    height: 40,
    width: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 5,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  downloadOptionQuality: {
    fontWeight: "500",
    color: "#403e3e",
  },
  downloadOptionSize: {
    fontSize: 10,
    color: "#a1a1a1",
  },
});

export default DownloadOptions;
