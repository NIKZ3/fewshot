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
  network: {
    config_url: string;
    id: number;
    known_classes: string;
    owner_id: any;
    public_access: boolean;
    task: "segmentation" | "detection";
    title: string;
    url: string;
  };
  type: number;
}
export interface ContextData {
  data: GlobalData;
  setData: (data: Partial<GlobalData>) => void;
}
