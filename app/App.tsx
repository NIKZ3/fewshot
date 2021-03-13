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
            setData: (newData: GlobalData) =>
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
