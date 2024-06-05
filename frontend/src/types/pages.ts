import { BackendResponse } from "./backend";

export type RootStackParamList = {
  Scan: undefined;
  Loading: { code: string };
  Ingredients: {
    data: BackendResponse;
  };
};
