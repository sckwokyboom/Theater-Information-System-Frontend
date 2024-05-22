import {BaseClient} from "../BaseCllient.ts";
import {Nationality} from "./Nationality.ts";
import {FilterNationalityCriteria} from "./FilterNationalityCriteria.ts";

export class NationalityClient extends BaseClient<Nationality, FilterNationalityCriteria> {
    private static instance: NationalityClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): NationalityClient {
        if (!NationalityClient.instance) {
            NationalityClient.instance = new NationalityClient();
        }
        return NationalityClient.instance;
    }

    override constructFilterQueryPart(_: FilterNationalityCriteria): string | null {
        return null
    }

    async getAllNationalities(): Promise<Nationality[] | undefined> {
        return await this.fetchData("nationalities", {})
    }
}