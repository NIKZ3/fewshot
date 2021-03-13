import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import axios from "axios";
import * as React from "react";
import { ActivityIndicator, ColorSchemeName } from "react-native";
import { View } from "../components/Themed";
import { tintColorLight } from "../constants/Colors";
import GlobalContext from "../Context";
import Login from "../screens/Login";
import NotFoundScreen from "../screens/NotFoundScreen";
import Register from "../screens/Register";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import { RootStackParamList, UnAuthParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

axios.defaults.baseURL = "";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const { setData, data } = React.useContext(GlobalContext);

  React.useEffect(() => {
    (async () => {
      if (!data.token) {
        const localToken = await AsyncStorage.getItem("@jwt_token");
        if (localToken) {
          setData({ token: localToken || "" });
          axios.defaults.headers.common.Authorization = localToken;
        }
      }
    })();
  }, [data.token]);

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {data.token === null ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator color={tintColorLight} size={50} />
        </View>
      ) : data.token ? (
        <RootNavigator />
      ) : (
        <UnAuthNavigator />
      )}
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const StackAuth = createStackNavigator<RootStackParamList>();
const StackUnAuth = createStackNavigator<UnAuthParamList>();

function RootNavigator() {
  return (
    <StackAuth.Navigator>
      <StackAuth.Screen
        name="FewShot"
        component={TabOneScreen}
        options={{ title: "Few Shot" }}
      />
      <StackAuth.Screen
        name="Camera"
        component={TabTwoScreen}
        options={{ title: "Camera" }}
      />
      <StackAuth.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </StackAuth.Navigator>
  );
}

function UnAuthNavigator() {
  return (
    <StackUnAuth.Navigator initialRouteName={"Login"}>
      <StackUnAuth.Screen
        name="Login"
        component={Login}
        options={{ title: "Login" }}
      />
      <StackUnAuth.Screen
        name="Register"
        component={Register}
        options={{ title: "Register" }}
      />
      <StackUnAuth.Screen name="Root" component={RootNavigator} />
    </StackUnAuth.Navigator>
  );
}
