import { AxiosResponse } from "axios";
import { Game, GameTBC, Unit } from "../models/Interfaces";
import { genericAPI } from "./GenericAPI";

class GameApi {
  static readonly endpoint = "/game";

  async getAllGames(): Promise<Game[]> {
    const response = await genericAPI.get<Game[]>(`${GameApi.endpoint}/getAll`);
    return response.data;
  }

  async createGame(
    game: GameTBC,
    image: File | null,
    units: Unit[]
  ): Promise<any> {
    const formData = new FormData();
    formData.append(
      "game",
      new Blob([JSON.stringify(game)], { type: "application/json" })
    );
    if (image) {
      formData.append("image", image);
    }
    if (units.length > 0) {
      formData.append(
        "units",
        new Blob([JSON.stringify(units)], { type: "application/json" })
      );
    }
    const response = await genericAPI.postFormData(
      `${GameApi.endpoint}/create`,
      formData
    );
    return response;
  }

  async deleteGame(gameID: number): Promise<AxiosResponse> {
    try {
      const response = await genericAPI.delete<void>(
        `${GameApi.endpoint}/delete/${gameID}`
      );
      return response;
    } catch (error: any) {
      console.error("Error deleting game (in api):" + error);
      if (error.response && error.response.data) {
        console.error(
          "Error deleting game (in api in if): " + error.response.data
        );
        throw error.response.data;
      }
      throw error;
    }
  }

  // async updateGame(game: Game): Promise<AxiosResponse> {
  //   try {
  //     const formData = new FormData();
  //     formData.append(
  //       "game",
  //       new Blob([JSON.stringify(game)], { type: "application/json" })
  //     );
  //     const response = await genericAPI.putFormData(
  //       `${GameApi.endpoint}/update/${game.gameID}`,
  //       formData
  //     );
  //     return response;
  //   } catch (error: any) {
  //     console.error("Error updating game:", error);
  //     if (error.response && error.response.data) {
  //       console.error(
  //         "Error updating game (response data):",
  //         error.response.data
  //       );
  //       throw error.response.data;
  //     }
  //     throw error;
  //   }
  // }
  async updateGame(game: Partial<Game>, units: Unit[]): Promise<AxiosResponse> {
    try {
      const formData = new FormData();
      formData.append(
        "game",
        new Blob([JSON.stringify(game)], { type: "application/json" })
      );
      formData.append(
        "units",
        new Blob([JSON.stringify(units)], { type: "application/json" })
      );
      const response = await genericAPI.putFormData(
        `${GameApi.endpoint}/update/${game.gameID}`,
        formData
      );
      return response;
    } catch (error: any) {
      console.error("Error updating game:", error);
      if (error.response && error.response.data) {
        console.error(
          "Error updating game (response data):",
          error.response.data
        );
        throw error.response.data;
      }
      throw error;
    }
  }

  async getGamesForObject(objectID: number): Promise<Game[]> {
    try {
      const response = await genericAPI.get<Game[]>(
        `${GameApi.endpoint}/get-games-for-object/${objectID}`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching games for object:", error);
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw error;
    }
  }
}

export const gameAPI = new GameApi();
