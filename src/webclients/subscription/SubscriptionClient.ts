import {BaseClient} from "../BaseCllient.ts";
import {Subscription} from "./Subscription.ts";
import {FilterSubscriptionCriteria} from "./FilterSubscriptionCriteria.ts";

export class SubscriptionClient extends BaseClient<Subscription, FilterSubscriptionCriteria> {
    private static instance: SubscriptionClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): SubscriptionClient {
        if (!SubscriptionClient.instance) {
            SubscriptionClient.instance = new SubscriptionClient();
        }
        return SubscriptionClient.instance;
    }

    override constructFilterQueryPart(): string | null {
        return null;
    }

    getAllSubscriptions(): Promise<Subscription [] | undefined> {
        return this.fetchData("subscriptions", {})
    }
}