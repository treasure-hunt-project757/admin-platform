import { configureStore } from "@reduxjs/toolkit";
import globalStatesSlice from "../slices/GlobalStates";
import saveAllData from "../slices/saveAllData";

const store = configureStore({
  reducer: {
    globalStates: globalStatesSlice,
    saveAllData: saveAllData,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
