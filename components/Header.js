import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { isValidUrl } from "is-youtube-url";

export default function Header({ url, setUrl, navigation }) {

  const [search, setSearch] = useState(url);
  const [active, setActive] = useState(false);

  React.useEffect(() => {
    setSearch(url);
  }, [url]);
  
  const verifyURL = () => {
    // check if valid youtube url
    setActive(false);
    if (isValidUrl(search)) {
      setUrl(search);
    } else {
      setUrl(`https://m.youtube.com/results?search_query=${search}`);
    }
    // else search on youtube
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setUrl("https://m.youtube.com/")}>
        <Image
          source={require("../assets/icon.png")}
          style={{ width: 30, height: 30, marginLeft: 5 }}
        />
      </TouchableOpacity>
      <View style={styles.searchbar}>
        <TextInput
          // keyboardType="default"
          defaultValue={search === "https://m.youtube.com/" ? "" : search}
          onChange={({ nativeEvent }) => {
            setSearch(nativeEvent.text);
          }}
          returnKeyType="search"
          autoCapitalize="none"
          enablesReturnKeyAutomatically={true}
          onSubmitEditing={() => {
            verifyURL();
          }}
          // selection={{ start: 0}}
          // selection={{ start: 0, end: 0 }}
          onFocus={() => {
            setActive(true);
          }}
          onBlur={() => {
            setActive(false);
          }}
          selectTextOnFocus
          placeholder="Serach or Enter URL"
          style={styles.input}
          placeholderTextColor="#797a73"
        />

        {active ? (
          <AntDesign
            name="search1"
            size={18}
            color="#7a7a7a"
            style={{ marginRight: 4, fontSize: 15, marginBottom: 3 }}
            onPress={() => verifyURL()}
          />
        ) : (
          <AntDesign
            name="closecircle"
            size={18}
            color="#7a7a7a"
            style={{ marginRight: 4, fontSize: 15, marginBottom: 3 }}
            onPress={() => setSearch("")}
          />
        )}
      </View>
      <TouchableOpacity>
        <AntDesign
          name="arrowdown"
          // size={20}
          color="#ff0000"
          style={{ marginRight: 5, fontSize: 18 }}
          onPress={()=>navigation.navigate("Downloads")}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 7,
    paddingBottom: 8,
  },
  searchbar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    padding: 5,
    marginHorizontal: 7,
    flex: 1,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 2,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#4d4d4d",
    marginLeft: 4,
  },
});
