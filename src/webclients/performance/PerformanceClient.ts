import {BaseClient} from "../BaseCllient.ts";
import {Performance} from "./Performance.ts";
import {FilterPerformanceCriteria} from "./FilterPerformanceCriteria.ts";

export class PerformanceClient extends BaseClient<Performance, FilterPerformanceCriteria> {
    private static instance: PerformanceClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): PerformanceClient {
        if (!PerformanceClient.instance) {
            PerformanceClient.instance = new PerformanceClient();
        }
        return PerformanceClient.instance;
    }

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
        if (filterParams.isUpcoming) {
            queryParams.push(`isUpcoming=${filterParams.isUpcoming}`);
        }
        return queryParams.join('&');
    }

    getUpcomingPerformances(): Promise<Performance[] | undefined> {
        const upcomingFilter = {
            repertoireId: undefined,
            isPremiere: undefined,
            genreId: undefined,
            dateOfStart: undefined,
            dateOfEnd: undefined,
            authorId: undefined,
            authorCountryId: undefined,
            centuryOfPlayWriting: undefined,
            isUpcoming: "true"
        }
        return this.fetchData("performances/filter", upcomingFilter)
    }

    getAllPerformances(): Promise<Performance[] | undefined> {
        const emptyFilter = {
            repertoireId: undefined,
            isPremiere: undefined,
            genreId: undefined,
            dateOfStart: undefined,
            dateOfEnd: undefined,
            authorId: undefined,
            authorCountryId: undefined,
            centuryOfPlayWriting: undefined,
            isUpcoming: undefined
        }
        return this.fetchData("performances/filter", emptyFilter)
    }

}