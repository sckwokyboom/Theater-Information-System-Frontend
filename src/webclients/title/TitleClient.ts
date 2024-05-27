import {BaseClient} from "../BaseCllient.ts";
import {Title} from "./Title.ts";
import {FilterTitleCriteria} from "./FilterTitleCriteria.ts";

export class TitleClient extends BaseClient<Title, FilterTitleCriteria> {
    private static instance: TitleClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): TitleClient {
        if (!TitleClient.instance) {
            TitleClient.instance = new TitleClient();
        }
        return TitleClient.instance;
    }

    override constructFilterQueryPart(): string | null {
        return null;
    }

    async getAllTitles(): Promise<Title[] | undefined> {
        return await this.fetchData("titles", {})
    }
}