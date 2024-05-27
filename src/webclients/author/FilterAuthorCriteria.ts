export interface FilterAuthorCriteria {
    wasPerformed: string | undefined;
    centuryOfLiving: number | undefined;
    countryOfOriginId: number | undefined;
    genreId: number | undefined;
    dateOfStartPerformanceAuthorsPlays: string | undefined | null;
    dateOfEndPerformanceAuthorsPlays: string | undefined | null;
    performanceId: number | undefined | null;
}
