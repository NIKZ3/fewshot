export type RootStackParamList = {
  FewShot: undefined;
  Camera: undefined;
  NotFound: undefined;
  Init: undefined;
};

export type UnAuthParamList = {
  Login: undefined;
  Register: undefined;
  Root: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Camera: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export interface GlobalData {
  token: string;
}
export interface ContextData {
  data: GlobalData;
  setData: (data: GlobalData) => void;
}
