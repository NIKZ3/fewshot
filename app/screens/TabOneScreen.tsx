import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import * as React from "react";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, View } from "../components/Themed";
import { tintColorLight } from "../constants/Colors";
import GlobalContext from "../Context";
import { Api } from "../services/api";

const pickerTypes = [
  { label: "Fine Tune", value: 1 },
  { label: "Inference", value: 2 },
];

export default function TabOneScreen({ navigation }: any) {
  const [networkList, setnetworkList] = React.useState<any[]>([]);
  const [loading, setloading] = React.useState(true);
  const { setData, data } = React.useContext(GlobalContext);

  React.useEffect(() => {
    (async () => {
      try {
        const result = await Api.get("users/networks");
        setnetworkList(result.data || []);
        setData({ network: result.data[0], type: pickerTypes[0].value });
        setloading(false);
      } catch (err) {
        setloading(false);

        if (err.response?.status.code === 401) {
          setData({ token: "" });
          Alert.alert("Error", "Session Expired");
        } else {
          Alert.alert("Error", "Oops, some issue occured while logging in");
        }
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size={50} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Few Shot!</Text>
      <Text style={styles.itemText}>
        Identify the objects by taking their images, if the app fails to
        recognize the object you can help us improve.
      </Text>
      <Text style={styles.heading}>Select Network</Text>
      <View style={styles.pickerCont}>
        <Picker
          style={styles.picker}
          selectedValue={data.network.id}
          onValueChange={(itemValue) =>
            setData({
              network: networkList.find((itm) => itm.id === itemValue),
            })
          }
        >
          {networkList.map((item: any) => (
            <Picker.Item key={item.id} label={item.title} value={item.id} />
          ))}
        </Picker>
      </View>
      <Text style={styles.heading}>Select Type</Text>
      <View style={styles.pickerCont}>
        <Picker
          style={styles.picker}
          selectedValue={data.type}
          onValueChange={(itemValue) => setData({ type: itemValue })}
        >
          {pickerTypes.map((item: any) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
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
  },
  centered: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  item: {
    padding: 8,
    borderColor: "#ddd",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 100,
    alignSelf: "center",
  },
  itemText: {
    color: "#222",
    fontSize: 16,
    width: "90%",
    marginTop: 8,
    padding: 12,
  },
  heading: {
    fontSize: 20,
    color: "#222",
    padding: 12,
    paddingBottom: 0,
  },
  picker: {
    height: 30,
    borderWidth: 1,
  },
  pickerCont: {
    borderWidth: 1,
    borderRadius: 6,
    margin: 12,
  },
});
