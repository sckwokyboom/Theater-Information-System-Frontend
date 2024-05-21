export class BuySubscriptionRequest {
    performanceIds: number[];
    placeIds: number[];

    constructor(performanceIds: number[],
                placeIds: number[]) {
        this.performanceIds = performanceIds
        this.placeIds = placeIds
    }
}