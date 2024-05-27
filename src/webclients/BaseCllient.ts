import axios, {AxiosError, AxiosResponse} from "axios";
import {config} from "./config.ts";

// Интерфейс для стандартной ошибки
interface StandardError {
    message: string;
}

// Пользовательский type guard для StandardError
function isStandardError(error: unknown): error is StandardError {
    return typeof error === "object" && error !== null && "message" in error;
}

// Пользовательский type guard для AxiosError с response
function isAxiosErrorWithResponse(error: unknown): error is AxiosError {
    return axios.isAxiosError(error) && error.response !== undefined;
}

export abstract class BaseClient<T, Filter> {
    abstract constructFilterQueryPart(filterParams: Filter): string | null;

    async fetchData(endpoint: string, filterParams: Filter): Promise<T[] | undefined> {
        try {
            const filterQueryPart = this.constructFilterQueryPart(filterParams);

            const url = filterQueryPart != null
                ? `${config.baseApiUrl}/${endpoint}?${filterQueryPart}`
                : `${config.baseApiUrl}/${endpoint}`;

            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async updateData(endpoint: string, itemId: number, updatedData: T): Promise<T | undefined> {
        try {
            const response = await axios.put(`${config.baseApiUrl}/${endpoint}/${itemId}`, updatedData);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async deleteData(endpoint: string, itemId: number): Promise<boolean | undefined> {
        try {
            await axios.delete(`${config.baseApiUrl}/${endpoint}/${itemId}`);
            return true;
        } catch (error) {
            this.handleError(error);
        }
    }

    async createData(endpoint: string, newData: T): Promise<T | undefined> {
        try {
            const response = await axios.post(`${config.baseApiUrl}/${endpoint}`, newData);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: unknown): void {
        if (isAxiosErrorWithResponse(error)) {
            const axiosError = error as AxiosError;
            const response: AxiosResponse = axiosError.response!;
            console.error('Backend returned an error:', response.status, response.data);
            throw new Error(`Server error: ${response.status} - ${response.data}`);
        } else if (isStandardError(error)) {
            console.error('Error with the request:', error.message);
            throw new Error('Request error');
        } else {
            console.error('An unknown error occurred:', error);
            throw new Error('Unknown error');
        }
    }
}
