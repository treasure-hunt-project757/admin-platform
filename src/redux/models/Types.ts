export type Page = {
  sectorPage: 1;
  gamesPage: 2;
  LocationsPage: 3;
};

export const buttonsName = {
  Sectors: "משתמשים",
  Games: "משחקים",
  Locations: "חדרים",
  Tasks: "משימות",
  TrainModel: "אימון מודל",
  Logout: "יציאה",
};

export type Sector = {
  name: string;
  userName: string;
  password: string;
  gamesNumber: number;
  color: string;
};
export type Task = {
  name: string;
  description: string;
  sector: string;
};
export type Game = {
  name: string;
  image: string;
  description: string;
  lastModifiedDate: Date;
  sector: string;
};
export type Location = {
  name: string;
  description: string;
  floor: number;
  objects: Object[];
};
export type Object = {
  name: string;
  image: string;
  description: string;
  lastModifiedDate: Date;
  sector: string;
};
