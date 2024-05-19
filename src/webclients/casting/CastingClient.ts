import {BaseClient} from "../BaseCllient.ts";
import {Casting} from "./Casting.ts";
import {FilterCastingCriteria} from "./FilterCastingCriteria.ts";

export class CastingClient extends BaseClient<Casting, FilterCastingCriteria> {
    override constructFilterQueryPart(filterParams: FilterCastingCriteria): string {
        const queryParams: string[] = [];
        if (filterParams.actorId) {
            queryParams.push(`actorId=${filterParams.actorId}`);
        }
        if (filterParams.dateOfStart) {
            queryParams.push(`dateOfStart=${filterParams.dateOfStart}`);
        }
        if (filterParams.dateOfEnd) {
            queryParams.push(`dateOfEnd=${filterParams.dateOfEnd}`);
        }
        if (filterParams.playGenreId) {
            queryParams.push(`playGenreId=${filterParams.playGenreId}`);
        }
        if (filterParams.productionDirectorId) {
            queryParams.push(`productionDirectorId=${filterParams.productionDirectorId}`);
        }
        if (filterParams.ageCategory) {
            queryParams.push(`ageCategory='${filterParams.ageCategory}'`);
        }
        return queryParams.join('&');
    }
}