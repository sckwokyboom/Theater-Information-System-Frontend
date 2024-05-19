import {BaseClient} from "../BaseCllient.ts";
import {Actor} from "./Actor.ts";
import {FilterActorCriteria} from "./FilterActorCriteria.ts";

export class ActorClient extends BaseClient<Actor, FilterActorCriteria> {
    private static instance: ActorClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): ActorClient {
        if (!ActorClient.instance) {
            ActorClient.instance = new ActorClient();
        }
        return ActorClient.instance;
    }

    async fetchAllActors(): Promise<Actor[] | undefined> {
        return await this.fetchData("actors", {
            roleWeight: undefined,
            roleHeight: undefined,
            roleEyeColor: undefined,
            roleSkinColor: undefined,
            roleHairColor: undefined,
            roleVoiceType: undefined,
            roleGender: undefined,
            roleAge: undefined,
            roleNationalityId: undefined,
            titleId: undefined,
            age: undefined,
            gender: undefined,
            dateOfStartForTitle: undefined,
            dateOfEndForTitle: undefined
        })
    }

    override constructFilterQueryPart(filterParams: FilterActorCriteria): string {
        const queryParams: string[] = [];
        if (filterParams.roleWeight) {
            queryParams.push(`roleWeight=${filterParams.roleWeight}`);
        }
        if (filterParams.roleHeight) {
            queryParams.push(`roleHeight=${filterParams.roleHeight}`);
        }
        if (filterParams.roleEyeColor) {
            queryParams.push(`roleEyeColor=${filterParams.roleEyeColor}`);
        }
        if (filterParams.roleSkinColor) {
            queryParams.push(`roleSkinColor=${filterParams.roleSkinColor}`);
        }
        if (filterParams.roleHairColor) {
            queryParams.push(`roleHairColor=${filterParams.roleHairColor}`);
        }
        if (filterParams.roleVoiceType) {
            queryParams.push(`roleVoiceType=${filterParams.roleVoiceType}`);
        }
        if (filterParams.roleGender) {
            queryParams.push(`roleGender=${filterParams.roleGender}`);
        }
        if (filterParams.roleAge) {
            queryParams.push(`roleAge=${filterParams.roleAge}`);
        }
        if (filterParams.roleNationalityId) {
            queryParams.push(`roleNationalityId=${filterParams.roleNationalityId}`);
        }
        if (filterParams.titleId) {
            queryParams.push(`titleId=${filterParams.titleId}`);
        }
        if (filterParams.age) {
            queryParams.push(`age=${filterParams.age}`);
        }
        if (filterParams.gender) {
            queryParams.push(`gender=${filterParams.gender}`);
        }
        if (filterParams.dateOfStartForTitle) {
            queryParams.push(`dateOfStartForTitle=${filterParams.dateOfStartForTitle}`);
        }
        if (filterParams.dateOfEndForTitle) {
            queryParams.push(`dateOfEndForTitle=${filterParams.dateOfEndForTitle}`);
        }

        return queryParams.join('&');
    }
}

