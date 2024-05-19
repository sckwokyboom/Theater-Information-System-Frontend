import axios from "axios";
import {config} from "./config.ts";

export abstract class BaseClient<T, Filter> {
    abstract constructFilterQueryPart(filterParams: Filter): string | null

    async fetchData(endpoint: string, filterParams: Filter): Promise<T[] | undefined> {
        try {
            const filterQueryPart = this.constructFilterQueryPart(filterParams)

            if (filterQueryPart != null) {
                const response = await axios.get(`${config.baseApiUrl}/${endpoint}?${this.constructFilterQueryPart(filterParams)}`);
                return response.data;
            } else {
                const response = await axios.get(`${config.baseApiUrl}/${endpoint}`);
                return response.data;
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    async updateData(endpoint: string, itemId: number, updatedData: T): Promise<T | undefined> {
        try {
            const response = await axios.put(`${config.baseApiUrl}/${endpoint}/${itemId}`, updatedData);
            return response.data;
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }

    async deleteData(endpoint: string, itemId: number): Promise<boolean | undefined> {
        try {
            await axios.delete(`${config.baseApiUrl}/${endpoint}/${itemId}`);
            return true;
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }

    async createData(endpoint: string, newData: T): Promise<T | undefined> {
        try {
            const response = await axios.post(`${config.baseApiUrl}/${endpoint}`, newData);
            return response.data;
        } catch (error) {
            console.error('Error adding data:', error);
        }
    }
}