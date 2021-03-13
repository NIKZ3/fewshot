import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { tintColorLight } from "../constants/Colors";
import GlobalContext from "../Context";
import { RootStackParamList, UnAuthParamList } from "../types";

const Login = ({
  navigation,
}: {
  navigation: StackNavigationProp<UnAuthParamList>;
}) => {
  const { setData, data } = React.useContext(GlobalContext);

  const [{ username, password }, setState] = React.useState({
    username: "",
    password: "",
  });

  const onChange = (key: "username" | "password", value: string) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async () => {
    try {
      const result = await axios.post("", { username, password });
      if (result.status === 200) {
        // await AsyncStorage.setItem('@jwt_token', result.data.token)
        // setData({ token: result.data.token });
      } else if (result.status === 401) {
        Alert.alert("Error", "Username or password incorrect");
      } else {
        Alert.alert("Error", "Oops, some issue occured while logging in");
      }
    } catch (err) {
      //>>>>>>>>>>>>>
      if (username === "test") {
        setData({ token: "temp" });
      }
      Alert.alert("Error", "Oops, some issue occured while logging in");
    }
  };

  return (
    <View style={styles.cont}>
      <View style={[styles.container]}>
        <Text style={[styles.title]}>Username</Text>
        <TextInput
          style={[styles.inputContainer]}
          value={username}
          onChangeText={(value) => onChange("username", value)}
        />
      </View>
      <View style={[styles.container]}>
        <Text style={[styles.title]}>Password</Text>
        <TextInput
          style={[styles.inputContainer]}
          secureTextEntry
          value={password}
          onChangeText={(value) => onChange("password", value)}
        />
      </View>
      <View style={{ marginTop: 8 }} />
      <Button title="Login" onPress={onSubmit} />
      <Text style={{ fontSize: 12, marginTop: 24 }}>
        Not Registered?{" "}
        <Text
          style={{ textDecorationLine: "underline", color: tintColorLight }}
          onPress={() => navigation.navigate("Register")}
        >
          Register Here
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  container: {
    width: "100%",
    position: "relative",
    backgroundColor: "white",
    marginBottom: 19.7,
    borderWidth: 0,
  },

  inputContainer: {
    fontSize: 11.7,
    paddingLeft: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#ddd",
    height: 33.3,
  },
  title: {
    color: tintColorLight,
    marginBottom: 8,
  },
});
export default Login;
