import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Admin,
  Game,
  Location,
  ObjectLocation,
  Task,
} from "../models/Interfaces";

interface GlobalStates {
  locations: Location[];
  Sectors: Admin[];
  Tasks: Task[];
  Games: Game[];
  Objects: ObjectLocation[];
}

const initialState: GlobalStates = {
  locations: [],
  Sectors: [],
  Tasks: [],
  Games: [],
  Objects: [],
};

const saveAllData = createSlice({
  name: "globalStates",
  initialState,
  reducers: {
    setLocations(state, action: PayloadAction<Location[]>) {
      state.locations = action.payload;
    },
    setTasks(state, action: PayloadAction<Task[]>) {
      state.Tasks = action.payload;
    },
    setGames(state, action: PayloadAction<Game[]>) {
      state.Games = action.payload;
    },
    setSectors(state, action: PayloadAction<Admin[]>) {
      state.Sectors = action.payload;
    },
    setObjects(state, action: PayloadAction<ObjectLocation[]>) {
      state.Objects = action.payload;
    },
  },
});

export const { setLocations, setTasks, setGames, setSectors, setObjects } =
  saveAllData.actions;

export default saveAllData.reducer;
