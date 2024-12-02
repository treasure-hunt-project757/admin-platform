import axios, { AxiosResponse } from "axios";
import { QuestionTaskTBC, Task, TaskTBC } from "../models/Interfaces";
import { genericAPI } from "./GenericAPI";

class TaskAPI {
  static readonly endpoint = "/Task";

  // async getAllTasks(): Promise<any[]> {
  //   const response = await genericAPI.get<Task[]>(`${TaskAPI.endpoint}`);
  //   return response.data;
  // }
  async getAllTasks(): Promise<Task[]> {
    const response = await genericAPI.get<Task[]>(`${TaskAPI.endpoint}/getAll`);
    return response.data;
  }

  async deleteTask(taskID: number): Promise<AxiosResponse> {
    try {
      const response = await genericAPI.delete<void>(
        `${TaskAPI.endpoint}/delete/${taskID}`
      );
      return response;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.includes("Task is part of an existing game")) {
          alert("המשימה היא חלק ממשחק קיים, נא לעדכן משחק ואז למחוק המשימה");
        }
        throw new Error(error.response.data.message || "Error deleting task");
      } else {
        throw new Error("Error deleting task");
      }
    }
  }

  //  ---------------------------------- test the apis -----------------------------------------------------

  async createTask(formData: FormData) {
    try {
      const response = await genericAPI.postFormData<any>(
        `${TaskAPI.endpoint}/create`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async updateTask(taskId: number, formData: FormData): Promise<Task> {
    try {
      const response = await genericAPI.putFormData<Task>(
        `${TaskAPI.endpoint}/update/${taskId}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }
  async duplicateTask(
    task: TaskTBC,
    questionTask: QuestionTaskTBC | null,
    newMediaFiles: File[] | null,
    sectorAdmin: string,
    existingMediaIds: number[] | null,
    originalTaskID: number
  ): Promise<Task> {
    const formData = new FormData();

    formData.append(
      "task",
      new Blob([JSON.stringify(task)], { type: "application/json" })
    );

    if (questionTask) {
      formData.append(
        "question",
        new Blob([JSON.stringify(questionTask)], { type: "application/json" })
      );
    }

    formData.append("admin", sectorAdmin);

    if (newMediaFiles && newMediaFiles.length > 0) {
      newMediaFiles.forEach((file) => {
        formData.append(`media`, file, file.name);
      });
    }

    if (existingMediaIds && existingMediaIds.length > 0) {
      formData.append(
        "existingMedia",
        new Blob([JSON.stringify(existingMediaIds)], {
          type: "application/json",
        })
      );
    }
    try {
      const response = await genericAPI.postFormData<Task>(
        `${TaskAPI.endpoint}/duplicate?originalTask=${originalTaskID}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error("Error duplicating task:", error);
      throw error;
    }
  }
}

export const taskAPI = new TaskAPI();
