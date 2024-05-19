import {BaseClient} from "../BaseCllient.ts";
import {Performance} from "./Performance.ts";
import {FilterPerformanceCriteria} from "./FilterPerformanceCriteria.ts";

export class PerformanceClient extends BaseClient<Performance, FilterPerformanceCriteria> {
    override constructFilterQueryPart(filterParams: FilterPerformanceCriteria): string {
        const queryParams: string[] = [];
        if (filterParams.repertoireId) {
            queryParams.push(`repertoireId=${filterParams.repertoireId}`);
        }
        if (filterParams.isPremiere) {
            queryParams.push(`isPremiere=${filterParams.isPremiere}`);
        }
        if (filterParams.genreId) {
            queryParams.push(`genreId=${filterParams.genreId}`);
        }
        if (filterParams.dateOfStart) {
            queryParams.push(`dateOfStart=${filterParams.dateOfStart}`);
        }
        if (filterParams.dateOfEnd) {
            queryParams.push(`dateOfEnd=${filterParams.dateOfEnd}`);
        }
        if (filterParams.authorId) {
            queryParams.push(`authorId=${filterParams.authorId}`);
        }
        if (filterParams.authorCountryId) {
            queryParams.push(`authorCountryId=${filterParams.authorCountryId}`);
        }
        if (filterParams.centuryOfPlayWriting) {
            queryParams.push(`centuryOfPlayWriting=${filterParams.centuryOfPlayWriting}`);
        }
        return queryParams.join('&');
    }

}