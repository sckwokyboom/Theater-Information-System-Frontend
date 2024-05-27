import {BaseClient} from "../BaseCllient.ts";
import {Role} from "./Role.ts";
import {FilterRoleCriteria} from "./FilterRoleCriteria.ts";


export class RoleClient extends BaseClient<Role, FilterRoleCriteria> {
    private static instance: RoleClient | null = null;

    private constructor() {
        super();
    }

    public static getInstance(): RoleClient {
        if (!RoleClient.instance) {
            RoleClient.instance = new RoleClient();
        }
        return RoleClient.instance;
    }

    override constructFilterQueryPart(): string | null {
        return null;
    }

    getAllRoles(): Promise<Role[] | undefined> {
        return this.fetchData("roles", {})
    }
}