import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL } from "./constants";
import { BaseRecord ,DataProvider, GetListParams, GetListResponse } from "@refinedev/core";
import { error } from "console";
import { mockTasks } from "./mockData";


export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({ resource }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource === "tasks") {
      return { data: mockTasks as unknown as TData[], total: mockTasks.length };
    }
    return { data: [] as TData[], total: 0 };
  },
  getOne: async () => {throw new Error("Funcion no presente")},
  create: async () => {throw new Error("Funcion no presente")},
  update: async () => {throw new Error("Funcion no presente")},
  deleteOne: async () => {throw new Error("Funcion no presente")},

  getApiUrl: () => ''
}
