import {BaseClient} from "../BaseCllient.ts";
import {FilterAuthorCriteria} from "./FilterAuthorCriteria.ts";
import {Author} from "./Author.ts";

export class AuthorClient extends BaseClient<Author, FilterAuthorCriteria> {
    private static instance: AuthorClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): AuthorClient {
        if (!AuthorClient.instance) {
            AuthorClient.instance = new AuthorClient();
        }
        return AuthorClient.instance;
    }

    override constructFilterQueryPart(filterParams: FilterAuthorCriteria): string {
        const queryParams: string[] = [];
        if (filterParams.wasPerformed) {
            queryParams.push(`wasPerformed=${filterParams.wasPerformed}`);
        }
        if (filterParams.centuryOfLiving) {
            queryParams.push(`centuryOfLiving=${filterParams.centuryOfLiving}`);
        }
        if (filterParams.countryOfOriginId) {
            queryParams.push(`countryOfOriginId=${filterParams.countryOfOriginId}`);
        }
        if (filterParams.genreId) {
            queryParams.push(`genreId=${filterParams.genreId}`);
        }
        if (filterParams.dateOfStartPerformanceAuthorsPlays) {
            queryParams.push(`dateOfStartPerformanceAuthorsPlays=${filterParams.dateOfStartPerformanceAuthorsPlays}`);
        }
        if (filterParams.dateOfEndPerformanceAuthorsPlays) {
            queryParams.push(`dateOfEndPerformanceAuthorsPlays=${filterParams.dateOfEndPerformanceAuthorsPlays}`);
        }
        return queryParams.join('&');
    }

    async getAllAuthors(): Promise<Author[] | undefined> {
        return await this.fetchData("authors", {
                wasPerformed: undefined,
                centuryOfLiving: undefined,
                countryOfOriginId: undefined,
                genreId: undefined,
                dateOfStartPerformanceAuthorsPlays: undefined,
                dateOfEndPerformanceAuthorsPlays: undefined
            }
        )
    }
}

