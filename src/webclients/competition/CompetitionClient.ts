import {BaseClient} from "../BaseCllient.ts";
import {Competition} from "./Competition.ts";
import {FilterCompetitionCriteria} from "./FilterCompetitionCriteria.ts";

export class CompetitionClient extends BaseClient<Competition, FilterCompetitionCriteria> {
    private static instance: CompetitionClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): CompetitionClient {
        if (!CompetitionClient.instance) {
            CompetitionClient.instance = new CompetitionClient();
        }
        return CompetitionClient.instance;
    }

    override constructFilterQueryPart(_: FilterCompetitionCriteria): string | null {
        return null;
    }

    async getAllCompetitions(): Promise<Competition[] | undefined> {
        return await this.fetchData("competitions", {})
    }
}