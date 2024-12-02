import { configureStore } from "@reduxjs/toolkit";
import GlobalStatesReducer from "./slices/GlobalStates";
import AllDataReducer from "./slices/saveAllData";

const store = configureStore({
  reducer: {
    globalStates: GlobalStatesReducer,
    AllData: AllDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
