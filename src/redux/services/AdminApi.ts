import { AxiosResponse } from "axios";
import { Admin, AdminTBC } from "../models/Interfaces";
import { genericAPI } from "./GenericAPI";

class AdminApi {
  async getAllAdmins(): Promise<Admin[]> {
    const response = await genericAPI.get<Admin[]>("/admin/getAll");
    return response.data;
  }

  async createSectorAdmin(admin: AdminTBC): Promise<Admin> {
    const response = await genericAPI.post<Admin>("/admin/create", admin);
    return response.data;
  }

  async updateAdmin(admin: Admin): Promise<Admin> {
    const response = await genericAPI.put<Admin>("/admin/update", admin);
    return response.data;
  }

  async deleteAdmin(adminID: number): Promise<AxiosResponse> {
    try {
      const response = await genericAPI.delete<void>(
        `/admin/delete/${adminID}`
      );
      return response;
    } catch (error: any) {
      throw new Error(error.response.data.message || "Error deleting admin");
    }
  }

  async updateSectorAdmin(
    adminID: number,
    admin: Admin,
    newPassword?: string
  ): Promise<Admin> {
    const formData = new FormData();
    formData.append(
      "admin",
      new Blob([JSON.stringify(admin)], { type: "application/json" })
    );
    if (newPassword) {
      formData.append("newPassword", newPassword);
    }
    const response = await genericAPI.putFormData<Admin>(
      `/admin/update/${adminID}`,
      formData
    );
    return response.data;
  }
}

export const adminAPI = new AdminApi();
