import localforage from "localforage";
import { ICreditProduct } from "@services/prospects/types";

export async function intializedData<T>(option: string, data: T[]) {
  try {
    await localforage.setItem(option, data);
  } catch (error) {
    return error;
  }
}

export async function get<T = unknown>(option: string) {
  await fakeNetwork();
  try {
    const optionsData = await localforage.getItem(option);

    return optionsData as T;
  } catch (error) {
    return error;
  }
}

export async function getById<T>(
  bd: string,
  key: string,
  identifier: number | string,
  returnMultiple: boolean = false
): Promise<T> {
  try {
    const data = await get(bd);
    if (Array.isArray(data)) {
      if (returnMultiple) {
        const filteredData = data.filter(
          (item) =>
            item[key] ===
            (typeof item[key] === "number"
              ? Number(identifier)
              : String(identifier))
        );
        return filteredData as T;
      } else {
        const foundData = data.find(
          (item) =>
            item[key] ===
            (typeof item[key] === "number"
              ? Number(identifier)
              : String(identifier))
        );
        if (!foundData)
          throw new Error(`No match found for identifier ${identifier}`);
        return foundData as T;
      }
    } else {
      throw new Error("Data structure not valid, must be an array of objects");
    }
  } catch (error) {
    throw new Error(`Failed to get data: ${error}`);
  }
}

interface functionActiveById {
  key: string;
  nameDB: string;
  identifier: number | string;
  editData: { [key: string]: string | ICreditProduct[] };
}

export async function updateActive(props: functionActiveById) {
  const { key, nameDB, identifier, editData } = props;

  try {
    const data = await get(nameDB);
    if (Array.isArray(data)) {
      const indexData = data.findIndex((item) => item[key] === identifier);

      for (const field in editData) {
        data[indexData][field] = editData[field];
      }

      await localforage.setItem(nameDB, data);
    } else {
      throw new Error("data structure not valid, must be an object list");
    }
  } catch (error) {
    return error;
  }
}

async function fakeNetwork() {
  return new Promise((res) => {
    setTimeout(res, 0);
  });
}

export async function addItem<T>(option: string, newItem: T) {
  await fakeNetwork();
  try {
    const data = await localforage.getItem<T[]>(option);
    const updatedData = Array.isArray(data) ? data : [];
    const newTrace = {
      ...newItem,
      trace_id: crypto.randomUUID(),
    };

    updatedData.push(newTrace as T);
    await localforage.setItem(option, updatedData);
    return newTrace;
  } catch (error) {
    return "Failed to add item: " + error;
  }
}
