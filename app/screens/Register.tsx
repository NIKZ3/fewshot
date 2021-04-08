import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { tintColorLight } from "../constants/Colors";
import GlobalContext from "../Context";
import { Api } from "../services/api";

const Register = ({ navigation }: { navigation: StackNavigationProp<any> }) => {
  const [{ username, password, confPassword }, setState] = React.useState({
    username: "",
    password: "",
    confPassword: "",
  });

  const onChange = (
    key: "username" | "password" | "confPassword",
    value: string
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const { setData, data } = React.useContext(GlobalContext);

  const onSubmit = async () => {
    try {
      if (!username || !password) {
        Alert.alert("Invalid Data", "Username or password cannot be empty");
      } else if (password !== confPassword) {
        Alert.alert("Invalid Data", "Passwords should match");
      } else {
        const result = await Api.post("users/signup", { username, password });
        if (result.status === 200) {
          Alert.alert("Success", "Registered Successfully", [
            {
              onPress: async () => {
                const token = result.request.responseHeaders.authorization;
                await AsyncStorage.setItem("@jwt_token", token);
                Api.defaults.headers.common.Authorization = token;
                setData({ token });
              },
            },
          ]);
        } else {
          Alert.alert("Error", "Oops, some issue occured while registering");
        }
      }
    } catch (err) {
      Alert.alert("Error", "Oops, some issue occured while registering");
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
      <View style={[styles.container]}>
        <Text style={[styles.title]}>Confirm Password</Text>
        <TextInput
          style={[styles.inputContainer]}
          secureTextEntry
          value={confPassword}
          onChangeText={(value) => onChange("confPassword", value)}
        />
      </View>
      <View style={{ marginTop: 8 }} />
      <Button title="Register" onPress={onSubmit} />
      <Text style={{ fontSize: 12, marginTop: 24 }}>
        Already Registered?{" "}
        <Text
          style={{ textDecorationLine: "underline", color: tintColorLight }}
          onPress={() => navigation.navigate("Login")}
        >
          Login Here
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
  },
});
export default Register;
