import {BaseClient} from "../BaseCllient.ts";
import {Genre} from "./Genre.ts";
import {FilterGenreCriteria} from "./FilterGenreCriteria.ts";

export class GenreClient extends BaseClient<Genre, FilterGenreCriteria> {
    private static instance: GenreClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): GenreClient {
        if (!GenreClient.instance) {
            GenreClient.instance = new GenreClient();
        }
        return GenreClient.instance;
    }

    override constructFilterQueryPart(): string | null {
        return null
    }

    async fetchAllGenres(): Promise<Genre[] | undefined> {
        return await this.fetchData("genres", {})
    }
}