import {BaseClient} from "../BaseCllient.ts";
import {Ticket} from "./Ticket.ts";
import {FilterTicketCriteria} from "./FilterTicketCriteria.ts";
import {Sum} from "./Sum.ts";
import {SumClient} from "./SumClient.ts";


export class TicketClient extends BaseClient<Ticket, FilterTicketCriteria> {
    private static instance: TicketClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): TicketClient {
        if (!TicketClient.instance) {
            TicketClient.instance = new TicketClient();
        }
        return TicketClient.instance;
    }

    override constructFilterQueryPart(filterParams: FilterTicketCriteria): string | null {
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
        if (filterParams.dateOfStart) {
            queryParams.push(`dateOfStart=${filterParams.dateOfStart}`);
        }
        if (filterParams.dateOfEnd) {
            queryParams.push(`dateOfEnd=${filterParams.dateOfEnd}`);
        }
        if (filterParams.isPreSold) {
            queryParams.push(`isPreSold=${filterParams.isPreSold}`);
        }
        return queryParams.join('&');
    }

    getAllTickets(): Promise<Ticket[] | undefined> {
        return this.fetchData("tickets", {
            performanceId: undefined,
            isPremiere: undefined,
            isUpcomingPerformances: undefined,
            dateOfStart: undefined,
            dateOfEnd: undefined,
            isPreSold: undefined
        })
    }

    async getSum(performanceId: number): Promise<Sum | undefined> {
        return (await SumClient.getInstance().getSum(performanceId))?.pop()
    }
}