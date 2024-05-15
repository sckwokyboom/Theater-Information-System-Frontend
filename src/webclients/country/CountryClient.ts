import {BaseClient} from "../BaseCllient.ts";
import {FilterCountryCriteria} from "./FilterCountryCriteria.ts";
import {Country} from "./Country.ts";

export class CountryClient extends BaseClient<Country, FilterCountryCriteria> {
    private static instance: CountryClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): CountryClient {
        if (!CountryClient.instance) {
            CountryClient.instance = new CountryClient();
        }
        return CountryClient.instance;
    }

    override constructFilterQueryPart(_: FilterCountryCriteria): string | null {
        return null;
    }

    async fetchAllCountries(): Promise<Country[] | undefined> {
        return await this.fetchData("countries", {})
    }
}