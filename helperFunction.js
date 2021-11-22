import ytdl from "react-native-ytdl";
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from "expo-notifications";


export const getVideoInfo = async (youtubeURL) => {
  let info = await ytdl.getInfo(youtubeURL);
  return info;
};

export const getDownloadOptionsCustomFormat = (info, format) => {
  let formats = ytdl.filterFormats(
    info.formats,
    format === "video" ? "videoandaudio" : `${format}only`
  );
  return formats;
};

export const downloadVideoAndAudio = async (url, format) => {
  let info = await getVideoInfo(url);
  let downloadOptions = getDownloadOptionsCustomFormat(info, format);
  // console.log(downloadOptions);
  return downloadOptions;
};

export const getMediaPermission = async()=>{
  let {granted} = await MediaLibrary.getPermissionsAsync(false)
  if (granted !== false) return true;
  let resObj = await MediaLibrary.requestPermissionsAsync(false);
  return resObj.granted;
}

export const getNotificationPermission = async()=>{
  let {granted} = await Notifications.getPermissionsAsync(false)
  if (granted !== false) return true;
  let resObj = await Notifications.requestPermissionsAsync(false);
  return resObj.granted;
}
