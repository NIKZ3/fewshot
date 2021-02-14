import React from "react";
import { PanResponder } from "react-native";

const useBoundingBox = () => {
  const [coordinates1, setcoordinates1] = React.useState({
    x0: 100,
    y0: 100,
  });
  const [coordinates2, setcoordinates2] = React.useState({
    width: 50,
    height: 50,
  });

  const { x0, y0 } = coordinates1;
  const { width, height } = coordinates2;

  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderStart: (evt, gestureState) => {
        setcoordinates1({
          x0: evt.nativeEvent.locationX,
          y0: evt.nativeEvent.locationY,
        });
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        setcoordinates2({
          width: Math.abs(gestureState.dx),
          height: Math.abs(gestureState.dy),
        });
      },
    })
  ).current;

  return { panResponder, x0, y0, width, height };
};

export default useBoundingBox;
