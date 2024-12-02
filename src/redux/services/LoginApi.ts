import { genericAPI } from "./GenericAPI";
import { Admin } from "../models/Interfaces";

interface LoginResponse {
  token: string;
  message: string;
  admin: Admin;
}

class LoginAPI {
  async login(username: string, password: string): Promise<Admin> {
    const response = await genericAPI.login<LoginResponse>(username, password);
    const { token, admin } = response.data;
    const adminToStore = {
      ...admin,
      role: admin.role
    };
    localStorage.setItem("admin", JSON.stringify(adminToStore));
    localStorage.setItem('authToken', token);
    // localStorage.setItem('admin', JSON.stringify(admin));
    genericAPI.setAuthToken(token);
    return admin;
  }
}

export const loginAPI = new LoginAPI();
