import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import GlobalContext from "./Context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { GlobalData } from "./types";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [data, setData] = React.useState<GlobalData>({} as any);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <GlobalContext.Provider
          value={{
            data,
            setData: (newData: Partial<GlobalData>) =>
              setData((prevData) => ({ ...prevData, ...newData })),
          }}
        >
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </GlobalContext.Provider>
      </SafeAreaProvider>
    );
  }
}

//// >>>>>>>>>>>>>>>>

/*
  1. pick network from networks list
  2. select type of training, finetune/inference
  3. after selection capture image send to one of the selected api's along with network id's
*/
