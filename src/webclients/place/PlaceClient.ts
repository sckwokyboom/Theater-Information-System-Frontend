import {BaseClient} from "../BaseCllient.ts";
import {Place} from "./Place.ts";
import {FilterPlaceCriteria} from "./FilterPlaceCriteria.ts";

export class PlaceClient extends BaseClient<Place, FilterPlaceCriteria> {
    private static instance: PlaceClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): PlaceClient {
        if (!PlaceClient.instance) {
            PlaceClient.instance = new PlaceClient();
        }
        return PlaceClient.instance;
    }

    override constructFilterQueryPart(filterParams: FilterPlaceCriteria): string {
        const queryParams: string[] = [];
        if (filterParams.isPremiere) {
            queryParams.push(`isPremiere=${filterParams.isPremiere}`);
        }
        if (filterParams.isUpcomingPerformances) {
            queryParams.push(`isUpcomingPerformances=${filterParams.isUpcomingPerformances}`);
        }
        if (filterParams.performanceId) {
            queryParams.push(`performanceId=${filterParams.performanceId}`);
        }
        return queryParams.join('&');
    }

    getFreePlaces(performanceId: number): Promise<Place [] | undefined> {
        const filter = {
            performanceId: performanceId,
            isPremiere: undefined,
            isUpcomingPerformances: undefined
        }
        return this.fetchData("places/filter", filter)
    }


}