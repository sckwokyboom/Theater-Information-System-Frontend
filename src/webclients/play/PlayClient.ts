import {BaseClient} from "../BaseCllient.ts";
import {Play} from "./Play.ts";
import {FilterPlayCriteria} from "./FilterPlayCriteria.ts";

export class PlayClient extends BaseClient<Play, FilterPlayCriteria> {
    private static instance: PlayClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): PlayClient {
        if (!PlayClient.instance) {
            PlayClient.instance = new PlayClient();
        }
        return PlayClient.instance;
    }

    override constructFilterQueryPart(): string | null {
        return null;
    }

    async getAllPlays(): Promise<Play[] | undefined> {
        return await this.fetchData("plays", {})
    }
}