import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import GlobalContext from "../Context";
import { Api } from "../services/api";

interface LabelProps {
  visible: boolean;
  onClose: any;
  coordinates: {
    x0: number;
    y0: number;
    width: number;
    height: number;
  };
  currentImage: any;
}

const LabelModal: React.FC<LabelProps> = ({
  onClose,
  visible,
  coordinates,
  currentImage,
}) => {
  const [value, setvalue] = React.useState("");
  const { data } = React.useContext(GlobalContext);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      style={{ flex: 1 }}
      transparent
    >
      <View style={{ backgroundColor: "#00000090", flex: 1, padding: 16 }}>
        <View
          style={{
            backgroundColor: "white",
            marginTop: 16,
            padding: 16,
            borderRadius: 8,
          }}
        >
          <View>
            <Text>Label</Text>
            <Text style={{ fontSize: 12, marginTop: 8 }}>
              Coordinates -
              {` (${coordinates.x0.toFixed(2)}, ${coordinates.y0.toFixed(
                2
              )}) width - ${Math.round(
                coordinates.width
              )}, height - ${Math.round(coordinates.height)}`}
            </Text>
            <TextInput
              placeholder="eg. Cat"
              value={value}
              autoFocus
              onChangeText={(val) => setvalue(val)}
              style={{
                borderWidth: 1,
                height: 40,
                borderColor: "#aaa",
                borderRadius: 4,
                marginVertical: 16,
                paddingHorizontal: 6,
              }}
            />
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[styles.button, { marginRight: 16 }]}
              onPress={onClose}
            >
              <Text style={{ color: "#416ce1" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                try {
                  await Api.post(`v1/finetune/${data.network.id}`, {
                    files: {
                      //@ts-ignore
                      uri: currentImage,
                      type: "image/jpeg",
                      name: "image.jpg",
                    },
                    label: value,
                  });
                  onClose();
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              <Text style={{ color: "#416ce1" }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginVertical: 16,
    borderRadius: 4,
    padding: 6,
    borderWidth: 1,
    borderColor: "#416ce1",
    paddingHorizontal: 12,
  },
});

export default LabelModal;
