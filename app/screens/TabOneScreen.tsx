import * as React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { tintColorLight } from "../constants/Colors";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function TabOneScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Few Shot!</Text>
      <Text style={styles.itemText}>
        Identify the objects by taking their images, if the app fails to
        recognize the object you can help us improve.
      </Text>
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate("Camera")}
      >
        <AntDesign name="camera" size={20} color={tintColorLight} />
        <Text style={{ fontSize: 14, marginLeft: 8 }}>Camera Mode</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    padding: 8,
    borderColor: "#ddd",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 16,
  },
  itemText: {
    color: "#222",
    fontSize: 16,
    width: "90%",
    textAlign: "center",
    marginTop: 8,
  },
  heading: {
    fontSize: 20,
    color: "#222",
  },
});
