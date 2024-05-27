import {BaseClient} from "../BaseCllient.ts";
import {FilterSumCriteria} from "./FilterTicketCriteria.ts";
import {Sum} from "./Sum.ts";


export class SumClient extends BaseClient<Sum, FilterSumCriteria> {
    private static instance: SumClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): SumClient {
        if (!SumClient.instance) {
            SumClient.instance = new SumClient();
        }
        return SumClient.instance;
    }

    override constructFilterQueryPart(filterParams: FilterSumCriteria): string | null {
        const queryParams: string[] = [];
        if (filterParams.performanceId) {
            queryParams.push(`performanceId=${filterParams.performanceId}`);
        }
        return queryParams.join('&');
    }

    getSum(performanceId: number): Promise<Sum[] | undefined> {
        return this.fetchData("tickets/sum", {
            performanceId: performanceId,
        })
    }
}