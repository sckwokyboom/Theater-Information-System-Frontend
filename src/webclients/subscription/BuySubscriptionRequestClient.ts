import {BaseClient} from "../BaseCllient.ts";
import {FilterSubscriptionCriteria} from "./FilterSubscriptionCriteria.ts";
import {BuySubscriptionRequest} from "./BuySubscriptionRequest.ts";

export class BuySubscriptionRequestClient extends BaseClient<BuySubscriptionRequest, FilterSubscriptionCriteria> {
    private static instance: BuySubscriptionRequestClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): BuySubscriptionRequestClient {
        if (!BuySubscriptionRequestClient.instance) {
            BuySubscriptionRequestClient.instance = new BuySubscriptionRequestClient();
        }
        return BuySubscriptionRequestClient.instance;
    }

    override constructFilterQueryPart(_: FilterSubscriptionCriteria): string {
        return "";
    }

    async buySubscription(subscriptionRequest: BuySubscriptionRequest): Promise<BuySubscriptionRequest | undefined> {
        try {
            return this.createData("subscriptions/buy", subscriptionRequest);
        } catch (error) {
            console.error('Error buying subscription:', error);
            throw error;
        }
    }
}