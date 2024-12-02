export interface Task {
  taskID: number;
  name: string;
  description?: string;
  taskFreeTexts?: string[];
  questionTask?: QuestionTask;
  mediaList?: MediaTask[];
  adminIDAPI: number;
  withMsg: boolean;
}

export interface TaskTBC {
  name: string;
  description?: string;
  taskFreeTexts?: string[];
  questionTask?: QuestionTask;
  mediaList?: MediaTask[];
  withMsg: boolean;
}

export interface QuestionTaskTBC {
  question: string;
  answers: string[];
  correctAnswer: number;
}

export interface QuestionTask {
  questionTaskID: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  taskID: number;
}
export interface MediaTask {
  mediaTaskID: number;
  fileName: string;
  mediaPath: string;
  mediaType: string;
  mediaUrl: string;
}

export interface MediaTaskTBC {
  fileName: string;
  mediaPath: string;
  mediaType: string;
  file: File;
}

export interface LocationTBC {
  locationID: number;
  name: string;
  description?: string;
  floor: number;
  qrcode: string;
  locationImage?: LocationImage;
  objectsList?: ObjectLocation[];
}

export interface Location {
  locationID: number;
  name: string;
  description?: string;
  floor: number;
  QRCode: string;
  qrcodePublicUrl: string;
  locationImagePublicUrl: string;
  locationImage?: LocationImage;
  objectsList?: ObjectLocation[];
}

export interface LocationImage {
  locationImgID: number;
  name: string;
  type: string;
  gcsObjectName: string;
  publicUrl: string;
}

export interface ObjectLocation {
  objectID: number;
  name: string;
  description?: string;
  games?: Game[];
  // location: Location;
  // objectImages: ObjectImage[];
}

export interface ObjectImage {
  id: number;
  name: string;
  imagePath: string;
  object: ObjectLocation;
  imageUrl: string;
}

export interface Game {
  gameID?: number;
  adminID?: number;
  gameName?: string;
  description?: string;
  qrcodeURL?: string;
  units?: Unit[];
}

export interface GameTBC {
  gameName: string;
  description: string;
  // gameImage?: GameImage;
  units?: Unit[];
}

// export interface GameImage {
//   gameImgID: number;
//   name: string;
//   type: string;
//   imagePath: string;
// }

export interface Unit {
  unitID: number;
  unitOrder: number;
  name: string;
  description?: string;
  hint: string;
  objectID: number;
  taskID: number;
  locationID: number;
  locationDTO?: Location;
  objectDTO?: ObjectLocation;
  taskDTO?: Task;
}

export interface Admin {
  adminID: number;
  username: string;
  sector: string;
  role: UserRole;
  gamesList?: Game[];
  tasksList?: Task[];
}

export interface AdminTBC {
  username: string;
  password: string;
  sector: string;
}

export enum UserRole {
  MainAdmin,
  SectorAdmin,
}
