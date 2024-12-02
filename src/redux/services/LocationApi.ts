import { Location } from "../models/Interfaces";
import { genericAPI } from "./GenericAPI";

class LocationAPI {
  static readonly endpoint = "/location";

  async getAllLocations(): Promise<any[]> {
    const response = await genericAPI.get<Location[]>(
      `${LocationAPI.endpoint}/getAll`
    );
    return response.data;
  }

  async createLocation(formData: FormData) {
    try {
      const response = await genericAPI.postFormData<any>(
        `${LocationAPI.endpoint}/create`,
        formData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating task:", error);
      if (error.response && error.response.data) {
        throw error.response.data;
      }
      throw error;
    }
  }

  async deleteLocation(locationId: number): Promise<any> {
    try {
      const response = await genericAPI.delete<void>(
        `${LocationAPI.endpoint}/delete/${locationId}`
      );
      return response;
    } catch (error: any) {
      console.error("Error deleting location (in api):" + error);
      if (error.response && error.response.data) {
        console.error(
          "Error deleting location (in api in if): " + error.response.data
        );
        throw error.response.data;
      }
      throw error;
    }
  }

  async updateLocation(
    locationId: number,
    formData: FormData
  ): Promise<Location> {
    try {
      const response = await genericAPI.putFormData<Location>(
        `${LocationAPI.endpoint}/update/${locationId}`,
        formData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error updating location:", error);
      if (error.response && error.response.data) {
        console.error(
          "Error updating location (server response):",
          error.response.data
        );
        throw error.response.data;
      }
      throw error;
    }
  }
}

export const locationAPI = new LocationAPI();
