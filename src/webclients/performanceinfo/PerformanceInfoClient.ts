import {BaseClient} from "../BaseCllient.ts";
import {PerformanceInfo} from "./PerformanceInfo.ts";
import {FilterPerformanceInfoCriteria} from "./FilterPerformanceInfoCriteria.ts";

export class PerformanceInfoClient extends BaseClient<PerformanceInfo, FilterPerformanceInfoCriteria> {
    override constructFilterQueryPart(filterParams: FilterPerformanceInfoCriteria): string {
        const queryParams: string[] = [];
        if (filterParams.performanceId) {
            queryParams.push(`performanceId=${filterParams.performanceId}`);
        }
        return queryParams.join('&');
    }
}