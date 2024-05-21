import {BaseClient} from "../BaseCllient.ts";
import {Subscription} from "./Subscription.ts";
import {FilterSubscriptionCriteria} from "./FilterSubscriptionCriteria.ts";

export class SubscriptionClient extends BaseClient<Subscription, FilterSubscriptionCriteria> {
    override constructFilterQueryPart(_: FilterSubscriptionCriteria): string {
        return "";
    }
}