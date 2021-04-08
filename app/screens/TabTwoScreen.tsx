import { Camera } from "expo-camera";
import * as React from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { Text, View } from "../components/Themed";
import GlobalContext from "../Context";
import { Api } from "../services/api";
import LabelModal from "./LabelModal";
import useBoundingBox from "./useBoundingBox";

const dims = Dimensions.get("window");

export default function TabTwoScreen() {
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(
    null
  );
  const ref = React.createRef<Camera>();
  const [currentImage, setcurrentImage] = React.useState<string | null>(null);
  const [boxMode, setboxMode] = React.useState(false);
  const [labelModal, setlabelModal] = React.useState(false);
  const { x0, y0, width, height, panResponder } = useBoundingBox();
  const { data } = React.useContext(GlobalContext);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1, borderWidth: 1, alignItems: "center" }}>
      {currentImage ? (
        <View style={{ flex: 1 }}>
          <View
            style={{
              position: "relative",
            }}
            {...(boxMode ? panResponder.panHandlers : {})}
          >
            <Image
              source={{ uri: currentImage }}
              style={{ width: dims.width, height: 500 }}
              resizeMode="cover"
            />
            {boxMode && (
              <Svg width="100%" height="100%" style={{ position: "absolute" }}>
                <Rect
                  x={x0}
                  y={y0}
                  width={width}
                  height={height}
                  strokeWidth="3"
                  stroke="red"
                  strokeDasharray={[2, 2]}
                />
              </Svg>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 16,
            }}
          >
            {!boxMode ? (
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setcurrentImage(null)}
                >
                  <Text style={{ color: "#416ce1" }}>Camera mode</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={async () => {
                    if (data.type === 2) {
                      await Api.post(`v1/inference/${data.network.task}`, {
                        id: data.network.id,
                        file: {
                          //@ts-ignore
                          uri: currentImage,
                          type: "image/jpeg",
                          name: "image.jpg",
                        },
                      });
                    } else {
                      setboxMode(true);
                    }
                  }}
                >
                  <Text style={{ color: "#416ce1" }}>
                    {data.type === 2 ? "Send" : "Annotate Object"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setboxMode(false)}
                >
                  <Text style={{ color: "#416ce1" }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setlabelModal(true)}
                >
                  <Text style={{ color: "#416ce1" }}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      ) : (
        <>
          <Camera
            style={{ width: "100%", height: 500 }}
            type={"back"}
            ref={ref}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 40,
              }}
            ></View>
          </Camera>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              ref.current?.takePictureAsync({
                onPictureSaved: (pic) => {
                  setcurrentImage(pic.uri);
                },
              })
            }
          >
            <Text style={{ color: "#416ce1" }}>Capture</Text>
          </TouchableOpacity>
        </>
      )}
      <LabelModal
        coordinates={{ x0, y0, width, height }}
        visible={labelModal}
        currentImage={currentImage}
        onClose={() => setlabelModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    margin: 16,
    borderRadius: 4,
    padding: 6,
    borderWidth: 1,
    borderColor: "#416ce1",
    paddingHorizontal: 12,
    width: 150,
    alignItems: "center",
  },
});
