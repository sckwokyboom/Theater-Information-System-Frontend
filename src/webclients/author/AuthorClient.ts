import {BaseClient} from "../BaseCllient.ts";
import {FilterAuthorCriteria} from "./FilterAuthorCriteria.ts";
import {Author} from "./Author.ts";

export class AuthorClient extends BaseClient<Author, FilterAuthorCriteria> {
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
}

