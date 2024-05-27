export interface FilterTicketCriteria {
    performanceId: number | undefined;
    isPremiere: string | undefined;
    isUpcomingPerformances: string | undefined;
    dateOfStart: string | undefined;
    dateOfEnd: string | undefined;
    isPreSold: string | undefined;
}

export interface FilterSumCriteria {
    performanceId: number | undefined;
}