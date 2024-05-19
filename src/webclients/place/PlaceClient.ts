import {BaseClient} from "../BaseCllient.ts";
import {Place} from "./Place.ts";
import {FilterPlaceCriteria} from "./FilterPlaceCriteria.ts";

export class PlaceClient extends BaseClient<Place, FilterPlaceCriteria> {
    override constructFilterQueryPart(filterParams: FilterPlaceCriteria): string {
        const queryParams: string[] = [];
        return queryParams.join('&');
    }
}