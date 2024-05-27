import {BaseClient} from "../BaseCllient.ts";
import {Repertoire} from "./Repertoire.ts";
import {FilterRepertoireCriteria} from "./FilterRepertoireCriteria.ts";

export class RepertoireClient extends BaseClient<Repertoire, FilterRepertoireCriteria> {
    private static instance: RepertoireClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): RepertoireClient {
        if (!RepertoireClient.instance) {
            RepertoireClient.instance = new RepertoireClient();
        }
        return RepertoireClient.instance;
    }

    override constructFilterQueryPart(): string | null {
        return null;
    }

    async getAllRepertoires(): Promise<Repertoire[] | undefined> {
        return await this.fetchData("repertoires", {})
    }
}